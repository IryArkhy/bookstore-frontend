import React from 'react';
import { Route, BrowserRouter, Routes } from 'react-router-dom';
import { Box, createTheme, ThemeProvider } from '@mui/material';
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

function Router() {
  const token = useSelector(getToken);

  return (
    <BrowserRouter>
      <Routes>
        <Route path={ROUTES.LOGIN} element={<Login />} />
        <Route path={ROUTES.SIGN_UP} element={<SignUp />} />
        <Route
          path="/books"
          element={
            <ProtectedRoute token={token}>
              <Box>books</Box>
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
