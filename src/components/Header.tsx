import { AppBar, Toolbar, Container, Box, IconButton, Menu, Badge } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import AccountCircle from '@mui/icons-material/AccountCircle';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartRoundedIcon from '@mui/icons-material/ShoppingCartRounded';
import React, { ChangeEventHandler } from 'react';

import { ReactComponent as Logo } from '../assets/logo-no-background-white.svg';
import { Search, SearchIconWrapper, StyledInputBase } from './SearchBar';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../routes';
import { useDispatch } from '../redux/hooks';
import { clearUser } from '../redux/user/userSlice';

type HeaderProps = {
  includeSearch?: boolean;
  searchValue?: string;
  onSearchChange?: ChangeEventHandler;
};

export const Header: React.FC<HeaderProps> = ({ includeSearch, searchValue, onSearchChange }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleAccountItemClick = () => {
    navigate(ROUTES.USER_ACCOUNT);
    handleClose();
  };

  const handleLogout = () => {
    console.log('gandle logout');
    dispatch(clearUser());
    handleClose();
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ gap: 1 }}>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            <IconButton onClick={() => navigate(ROUTES.BASE)}>
              <Logo
                style={{
                  width: 60,
                  height: 60,
                  alignSelf: 'center',
                }}
              />
            </IconButton>
          </Box>
          {includeSearch && (
            <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                value={searchValue}
                onChange={onSearchChange}
                placeholder="Search…"
                inputProps={{ 'aria-label': 'search' }}
              />
            </Search>
          )}
          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            <IconButton
              onClick={() => navigate(ROUTES.SHOPPING_CART)}
              size="large"
              aria-label="show 17 new notifications"
              color="inherit"
            >
              <Badge badgeContent={17} color="error">
                <ShoppingCartRoundedIcon />
              </Badge>
            </IconButton>
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={handleAccountItemClick}>My account</MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
