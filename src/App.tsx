import React from 'react';
import { Route, BrowserRouter, Routes } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material';
import { Provider } from 'react-redux';

import { store } from './redux/store';
import './App.css';
import { Login } from './pages/login';

function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
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
          <Router />
        </Provider>
      </ThemeProvider>
    </React.StrictMode>
  );
}

export default App;
