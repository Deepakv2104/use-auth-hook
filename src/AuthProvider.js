import React from 'react';
import AuthContext from './AuthContext';
import useProvideAuth from './useAuth';

const AuthProvider = ({ children, config }) => {
  const auth = useProvideAuth(config);
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
