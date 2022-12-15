import { ThemeProvider, createTheme } from '@mui/material';
import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { PersistGate } from 'redux-persist/integration/react';

import './App.css';
import NotificationProvider from './lib/notifications';
import { ProtectedRoute } from './lib/router-dom';
import { NotFoundPage } from './pages/404';
import { Book } from './pages/book';
import { Books } from './pages/books';
import { Checkout } from './pages/checkout';
import { Login } from './pages/login';
import { Order } from './pages/order';
import { Orders } from './pages/orders';
import { SignUp } from './pages/signUp';
import { UserProfile } from './pages/userProfile';
import { useSelector } from './redux/hooks';
import { persistor, store } from './redux/store';
import { getToken } from './redux/user/selectors';
import { ROUTES } from './routes';

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
        <Route
          path={ROUTES.BOOK.INDEX}
          element={
            <ProtectedRoute token={token}>
              <Book />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.CHECKOUT}
          element={
            <ProtectedRoute token={token}>
              <Checkout />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

function App() {
  const theme = createTheme({
    palette: {
      primary: {
        main: '#3285a8',
      },
      secondary: {
        main: '#F39237',
      },
    },
  });

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
