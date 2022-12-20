import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  FormControl,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { ReactComponent as Logo } from '../../assets/logo-no-background.svg';
import { ReactComponent as Reading } from '../../assets/reading.svg';
import { NotificationContext } from '../../lib/notifications';
import { ErrorData } from '../../lib/storeApi/utils';
import { useDispatch } from '../../redux/hooks';
import { login } from '../../redux/user/thunks';
import { ROUTES } from '../../routes';

type LoginFormValues = {
  email: string;
  password: string;
};

export const Login: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { control, handleSubmit } = useForm<LoginFormValues>({
    defaultValues: {
      email: '',
      password: '',
    },
  });
  const [isPasswordVisible, setIsPasswordVisible] = React.useState(false);
  const { notifyError } = React.useContext(NotificationContext);

  const handlePasswordVisibility = () => {
    setIsPasswordVisible((current) => !current);
  };

  const navigateToRegistration = () => {
    navigate(ROUTES.SIGN_UP);
  };

  const handleLogin = async (values: LoginFormValues) => {
    const resultAction = await dispatch(login({ email: values.email, password: values.password }));

    if (resultAction.meta.requestStatus === 'rejected') {
      notifyError((resultAction.payload as ErrorData).message);
    } else {
      navigate(ROUTES.BOOKS_LIST);
    }
  };

  return (
    <Container
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
      }}
    >
      <Card sx={{ width: 0.7 }}>
        <CardContent sx={{ display: 'flex', gap: 7 }}>
          <form onSubmit={handleSubmit(handleLogin)} style={{ flex: 1 }}>
            <Stack gap={4} flex={1}>
              <Logo
                style={{
                  width: 100,
                  height: 100,
                  alignSelf: 'center',
                }}
              />
              <Typography align="center" variant="subtitle1">
                Login to your account
              </Typography>
              <Controller
                name="email"
                control={control}
                rules={{
                  required: true,
                }}
                render={({ field }) => (
                  <FormControl>
                    <TextField
                      type="email"
                      autoComplete="email"
                      size="medium"
                      label="Email"
                      {...field}
                    />
                  </FormControl>
                )}
              />
              <Controller
                name="password"
                control={control}
                rules={{
                  required: true,
                }}
                render={({ field }) => (
                  <FormControl variant="standard">
                    <TextField
                      id="standard-adornment-password"
                      type={isPasswordVisible ? 'text' : 'password'}
                      {...field}
                      label="Password"
                      autoComplete="current-password"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={handlePasswordVisibility}
                            >
                              {isPasswordVisible ? (
                                <VisibilityOff fontSize="small" />
                              ) : (
                                <Visibility fontSize="small" />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </FormControl>
                )}
              />
              <Button type="submit" variant="contained" sx={{ alignSelf: 'center' }}>
                Login
              </Button>
              <Box display="flex" alignItems="center" justifyContent="center">
                <Typography variant="caption">Don't have an account? Create</Typography>
                <Button
                  size="small"
                  color="primary"
                  variant="text"
                  onClick={navigateToRegistration}
                >
                  here
                </Button>
              </Box>
            </Stack>
          </form>
          <Box
            width={0.4}
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
          >
            <Reading
              style={{
                width: '100%',
                height: '40vh',
              }}
            />
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};
