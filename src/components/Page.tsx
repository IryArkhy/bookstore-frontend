import { Box, Container } from '@mui/material';
import React from 'react';

import { Header } from './Header';

export const Page: React.FC<{ renderHeader?: () => JSX.Element; children?: React.ReactNode }> = ({
  renderHeader,
  children,
}) => {
  return (
    <Box>
      {renderHeader ? renderHeader() : <Header />}
      <Container sx={{ py: 5 }}>{children}</Container>
    </Box>
  );
};
