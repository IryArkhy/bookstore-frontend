import React from 'react';
import { Route, BrowserRouter, Routes, Navigate } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import { store, persistor } from './redux/store';
import './App.css';
import { Login } from './pages/login';
import { useSelector } from './redux/hooks';
import { getToken } from './redux/user/selectors';
import { ProtectedRoute } from './lib/router-dom';
import NotificationProvider from './lib/notifications';
import { ROUTES } from './routes';
import { SignUp } from './pages/signUp';
import { Books } from './pages/books';
import { UserProfile } from './pages/userProfile';
import { Orders } from './pages/orders';
import { Order } from './pages/order';

function Router() {
  const token = useSelector(getToken);

  return (
    <BrowserRouter>
      <Routes>
        <Route path={ROUTES.BASE} element={<Navigate to={ROUTES.BOOKS_LIST} />} />
        <Route path={ROUTES.LOGIN} element={<Login />} />
        <Route path={ROUTES.SIGN_UP} element={<SignUp />} />
        <Route
          path={ROUTES.BOOKS_LIST}
          element={
            <ProtectedRoute token={token}>
              <Books />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.USER_ACCOUNT}
          element={
            <ProtectedRoute token={token}>
              <UserProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.ORDER_LIST}
          element={
            <ProtectedRoute token={token}>
              <Orders />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.ORDER.INDEX}
          element={
            <ProtectedRoute token={token}>
              <Order />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

function App() {
  const theme = createTheme();

  return (
    <React.StrictMode>
      <ThemeProvider theme={theme}>
        <Provider store={store}>
          <PersistGate persistor={persistor}>
            <NotificationProvider>
              <Router />
            </NotificationProvider>
          </PersistGate>
        </Provider>
      </ThemeProvider>
    </React.StrictMode>
  );
}

export default App;
