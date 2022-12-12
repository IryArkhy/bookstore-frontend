import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import {
  Card,
  CardContent,
  Container,
  FormControl,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
} from '@mui/material';
import React from 'react';

import { ReactComponent as Reading } from '../../assets/reading.svg';

export const Login: React.FC = () => {
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
      <Card>
        <CardContent sx={{ display: 'flex' }}>
          <Stack gap={4}>
            <FormControl>
              <TextField size="medium" label="Email" />
            </FormControl>
            <FormControl sx={{ m: 1 }} variant="standard">
              <TextField
                id="standard-adornment-password"
                type={true ? 'text' : 'password'}
                onChange={() => {}}
                label="Password"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => {}}
                        onMouseDown={() => {}}
                      >
                        {true ? (
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
          </Stack>
          <Reading />
        </CardContent>
      </Card>
    </Container>
  );
};
