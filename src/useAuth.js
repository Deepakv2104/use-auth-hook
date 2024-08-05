import { useState, useEffect, useCallback } from 'react';
import jwtDecode from 'jwt-decode';
import { getCookie, setCookie, deleteCookie } from './utils';

const useProvideAuth = ({ baseURL, endpoints }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = getCookie('authToken');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setIsAuthenticated(true);
        setUser(decoded.user);
        setRoles(decoded.roles || []);
        scheduleTokenRefresh(token);
      } catch (error) {
        console.error('Invalid token:', error);
        logout();
      }
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (credentials) => {
    setLoading(true);
    try {
      const response = await fetch(`${baseURL}${endpoints.login}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });
      if (!response.ok) throw new Error('Login failed');
      const { token, requiresMFA } = await response.json();

      if (requiresMFA) {
        // Trigger MFA flow
        promptForMFA();
      } else {
        completeLogin(token);
      }
    } catch (error) {
      setError(error.message);
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [baseURL, endpoints]);

  const completeLogin = useCallback((token) => {
    const decoded = jwtDecode(token);
    setIsAuthenticated(true);
    setUser(decoded.user);
    setRoles(decoded.roles || []);
    setCookie('authToken', token, 7); // Store token in cookie
    scheduleTokenRefresh(token);
  }, []);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    setUser(null);
    setRoles([]);
    deleteCookie('authToken'); // Remove the auth token cookie
  }, []);

  const checkPermission = useCallback(
    (requiredRole) => roles.includes(requiredRole),
    [roles]
  );

  const scheduleTokenRefresh = useCallback((currentToken) => {
    const { exp } = jwtDecode(currentToken);
    const expiresIn = exp * 1000 - Date.now() - 60000; // Refresh 1 minute before expiry
    if (expiresIn > 0) {
      setTimeout(refreshToken, expiresIn);
    } else {
      logout();
    }
  }, [logout]);

  const refreshToken = useCallback(async () => {
    try {
      const response = await fetch(`${baseURL}${endpoints.refreshToken}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getCookie('authToken')}`,
        },
      });
      if (!response.ok) throw new Error('Token refresh failed');
      const { token } = await response.json();
      completeLogin(token);
    } catch (error) {
      console.error(error);
      logout();
    }
  }, [baseURL, endpoints, completeLogin, logout]);

  const startOAuthFlow = useCallback((provider) => {
    window.location.href = `${baseURL}${endpoints.oauth}/${provider}`;
  }, [baseURL, endpoints]);

  return {
    isAuthenticated,
    user,
    login,
    logout,
    checkPermission,
    startOAuthFlow,
    loading,
    error,
  };
};

export default useProvideAuth;
