import { Box, Button, Typography } from '@mui/material';
import { Stack } from '@mui/system';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import { ReactComponent as NotFound } from '../../assets/404.svg';
import { Page } from '../../components';
import { ROUTES } from '../../routes';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <Page>
      <Stack gap={2} alignItems="center">
        <Typography variant="h6">Oops! You seem to be lost.</Typography>
        <Box display="flex" gap={1} alignItems="center">
          <Typography>Navigate back</Typography>
          <Button onClick={() => navigate(ROUTES.BOOKS_LIST)}>Home</Button>
        </Box>
        <NotFound height={300} />
      </Stack>
    </Page>
  );
};
