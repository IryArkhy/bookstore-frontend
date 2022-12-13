import React, { createContext, useState, FC, useMemo } from 'react';
import { Snackbar, AlertProps, Alert, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

export type MessageNotifier = (message: string) => void;

export type InitialNotificationState = {
  isVisible: boolean;
  severity: AlertProps['severity'];
  message: string;
  notifySuccess: MessageNotifier;
  notifyError: MessageNotifier;
  notifyInfo: MessageNotifier;
  notifyWarning: MessageNotifier;
};

const initialContextState: InitialNotificationState = {
  isVisible: false,
  severity: 'success',
  message: '',
  notifySuccess: () => undefined,
  notifyError: () => undefined,
  notifyInfo: () => undefined,
  notifyWarning: () => undefined,
};

const initNotifState: Pick<InitialNotificationState, 'isVisible' | 'severity' | 'message'> = {
  isVisible: false,
  severity: 'success',
  message: '',
};

export const NotificationContext = createContext(initialContextState);

const NotificationProvider: FC<{ children?: React.ReactNode }> = ({ children }) => {
  const [notifState, setNotifState] = useState(initNotifState);

  const notifySuccess = (message: string) => {
    setNotifState({ isVisible: true, message, severity: 'success' });
  };

  const notifyError = (message: string) => {
    setNotifState({ isVisible: true, message, severity: 'error' });
  };
  const notifyInfo = (message: string) => {
    setNotifState({ isVisible: true, message, severity: 'info' });
  };
  const notifyWarning = (message: string) => {
    setNotifState({ isVisible: true, message, severity: 'warning' });
  };

  const handleClose = () => {
    const { severity, ...rest } = initNotifState;
    setNotifState((prev) => ({ ...prev, ...rest }));
  };

  const action = (
    <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
      <CloseIcon fontSize="small" />
    </IconButton>
  );

  const value = useMemo(
    () => ({
      ...notifState,
      notifySuccess,
      notifyError,
      notifyInfo,
      notifyWarning,
    }),
    [notifState],
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}

      {notifState.severity === 'info' ? (
        <Snackbar
          action={action}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          autoHideDuration={4000}
          onClose={handleClose}
          open={notifState.isVisible}
          message={notifState.message}
        />
      ) : (
        <Snackbar
          autoHideDuration={4000}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          onClose={handleClose}
          open={notifState.isVisible}
          message={notifState.message}
        >
          <Alert
            variant="filled"
            onClose={handleClose}
            severity={notifState.severity}
            sx={{ width: '100%' }}
          >
            {notifState.message}
          </Alert>
        </Snackbar>
      )}
    </NotificationContext.Provider>
  );
};

export default NotificationProvider;
