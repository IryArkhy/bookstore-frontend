import { Box } from '@mui/material';
import React from 'react';
import { Header } from '../../components';

export const Books: React.FC = () => {
  const [searchValue, setSearchValue] = React.useState('');

  const handleSearchValueChange: React.ChangeEventHandler<HTMLInputElement> = ({ target }) => {
    setSearchValue(target.value);
  };

  return (
    <Box>
      <Header includeSearch searchValue={searchValue} onSearchChange={handleSearchValueChange} />
    </Box>
  );
};
