import React from 'react';
import { Navigate } from 'react-router-dom';

type ProtectedRouteProps = {
  token: string | null;
  children: React.ReactElement<any, any> | null;
};

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ token, children }) => {
  if (token) {
    return children;
  } else {
    return <Navigate to="/login" replace />;
  }
};
