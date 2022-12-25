import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { LoadingButton } from '@mui/lab';
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

import { ReactComponent as Authentication } from '../../assets/authentication.svg';
import { ReactComponent as Logo } from '../../assets/logo-no-background.svg';
import { NotificationContext } from '../../lib/notifications';
import { ErrorData } from '../../lib/storeApi/utils';
import { useDispatch } from '../../redux/hooks';
import { signUp } from '../../redux/user/thunks';
import { ROUTES } from '../../routes';

type SignUpFormValues = {
  email: string;
  username: string;
  password: string;
};

export const SignUp: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(false);
  const { control, handleSubmit } = useForm<SignUpFormValues>({
    defaultValues: {
      email: '',
      username: '',
      password: '',
    },
  });

  const [isPasswordVisible, setIsPasswordVisible] = React.useState(false);
  const { notifyError } = React.useContext(NotificationContext);

  const handlePasswordVisibility = () => {
    setIsPasswordVisible((current) => !current);
  };

  const navigateToRegistration = () => {
    navigate(ROUTES.LOGIN);
  };

  const handleSignUp = async ({ email, username, password }: SignUpFormValues) => {
    setIsLoading(true);
    const resultAction = await dispatch(signUp({ email, username, password }));
    setIsLoading(false);
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
          <form onSubmit={handleSubmit(handleSignUp)} style={{ flex: 1 }}>
            <Stack gap={4}>
              <Logo
                style={{
                  width: 100,
                  height: 100,
                  alignSelf: 'center',
                }}
              />
              <Typography align="center" variant="subtitle1">
                Create your account
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
                name="username"
                control={control}
                rules={{
                  required: true,
                }}
                render={({ field }) => (
                  <FormControl>
                    <TextField
                      type="username"
                      autoComplete="username"
                      size="medium"
                      label="Username"
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
              <LoadingButton
                loading={isLoading}
                type="submit"
                variant="contained"
                sx={{ alignSelf: 'center' }}
              >
                Sign Up
              </LoadingButton>

              <Box display="flex" alignItems="center" justifyContent="center">
                <Typography variant="caption">Already have an account? Go</Typography>

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
            <Authentication
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
