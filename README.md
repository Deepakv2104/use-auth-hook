
# use-auth-hook

### Overview
use-auth-hook is a powerful and flexible React hook designed to simplify authentication management in modern web applications. It provides a comprehensive solution for handling authentication states, managing secure token storage, and integrating with various authentication providers, including support for JWTs and OAuth. With use-auth-hook, developers can easily implement login, logout, and token refresh functionalities, while ensuring secure practices and scalability.

## Feature
* Customizable API Endpoints: Easily configure the base URL and specific authentication endpoints for seamless integration with any backend.
* JWT Management: Securely store, decode, and manage JWT tokens using cookies with HttpOnly and Secure flags to enhance security.
* OAuth Support: Integrated support for third-party authentication providers (Google, Facebook, etc.) via OAuth.
* Multi-Factor Authentication (MFA): Optional support for MFA to add an extra layer of security.
* Role-Based Access Control: Manage user roles and permissions to control access to different parts of the application.
* Automatic Token Refresh: Automatically refresh tokens before they expire, ensuring a smooth user experience.
* Error Handling and User Feedback: Comprehensive error handling mechanisms with clear user feedback for various authentication scenarios.
## Installation

To install the package, use npm:

```bash
 npm install use-auth-hook

```

## Basic usage

**1.Set up AuthProvider**: Wrap your application with the AuthProvider component and provide configuration for your authentication endpoints.
```javascript
// App.js
import React from 'react';
import { AuthProvider } from 'use-auth-hook'; // Import the AuthProvider from the package
import Dashboard from './Dashboard';
import Login from './Login';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

const authConfig = {
  baseURL: 'https://yourapi.com',
  endpoints: {
    login: '/auth/login',
    refreshToken: '/auth/refresh-token',
    logout: '/auth/logout',
    oauth: '/auth/oauth',
  },
};

function App() {
  return (
    <AuthProvider config={authConfig}>
      <Router>
        <Switch>
          <Route path="/login" component={Login} />
          <Route path="/dashboard" component={Dashboard} />
          {/* Add more routes as needed */}
        </Switch>
      </Router>
    </AuthProvider>
  );
}

export default App;

```
**2.Implement Login Component**: Use the useAuth hook to manage user authentication.

```javascript
// Login.js
import React, { useState } from 'react';
import { useAuth } from 'use-auth-hook';

function Login() {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const { login, error } = useAuth();

  const handleInputChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    try {
      await login(credentials);
      // Redirect to a protected route or show a success message
    } catch (err) {
      console.error('Login failed', err);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <input
        type="text"
        name="username"
        value={credentials.username}
        onChange={handleInputChange}
        placeholder="Username"
      />
      <input
        type="password"
        name="password"
        value={credentials.password}
        onChange={handleInputChange}
        placeholder="Password"
      />
      <button onClick={handleLogin}>Login</button>
      {error && <p>{error}</p>}
    </div>
  );
}

export default Login;

```

**3.Protected Routes**: Use the useAuth hook to protect routes based on authentication status.

```javascript
// PrivateRoute.js
import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useAuth } from 'use-auth-hook';

const PrivateRoute = ({ component: Component, ...rest }) => {
  const { isAuthenticated } = useAuth();

  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated ? <Component {...props} /> : <Redirect to="/login" />
      }
    />
  );
};

export default PrivateRoute;
```

## Configuration
The use-auth-hook relies on a configuration object passed to the AuthProvider. This configuration includes:

* baseURL: The base URL of your API server.
* endpoints: An object containing the endpoints for various authentication actions.

```javascript
const authConfig = {
  baseURL: 'https://yourapi.com',
  endpoints: {
    login: '/auth/login',
    refreshToken: '/auth/refresh-token',
    logout: '/auth/logout',
    oauth: '/auth/oauth',
  },
};

```
## Advanced Features
### Multi-Factor Authentication (MFA)
To integrate MFA, ensure your backend supports MFA and the frontend handles MFA challenges. If the requiresMFA flag is returned during login, you can trigger a secondary authentication step.

### OAuth Integration
Use the startOAuthFlow function from the hook to initiate OAuth authentication flows. This function redirects users to the OAuth provider's authentication page.

```javascript
const { startOAuthFlow } = useAuth();

// Trigger OAuth flow for a specific provider (e.g., Google)
const handleOAuthLogin = () => startOAuthFlow('google');
```
### Token Management
Tokens are securely stored using HttpOnly and Secure cookies, preventing access through JavaScript and ensuring they are sent only over HTTPS.


## Error Handling
The useAuth hook provides an error state to capture and display error messages to users. This helps in diagnosing issues during the authentication process.

## Security Best Practices
Secure Storage: Use HttpOnly and Secure flags for cookies to store tokens safely.
Token Expiry: Implement automatic token refresh and handle expired tokens gracefully.
Role-Based Access Control: Use the checkPermission function to enforce user roles and permissions.


## Authors

- [@Deepakv2104](https://github.com/Deepakv2104)

## 🔗 Links
[![portfolio](https://img.shields.io/badge/my_portfolio-000?style=for-the-badge&logo=ko-fi&logoColor=white)](https://deepak-vishwakarma.netlify.app/)
[![linkedin](https://img.shields.io/badge/linkedin-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/deepak-vishwakarma-21289b1b9/)
[![twitter](https://img.shields.io/badge/twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white)](https://x.com/DeepakV2001)
[![github](https://img.shields.io/badge/github-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Deepakv2104)
