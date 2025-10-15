/**
 * Navigation Bar Component for Project Zenith
 * Provides navigation and user controls across all pages
 */

import React, { useState, useContext } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Avatar,
  Menu,
  MenuItem,
  IconButton,
  Chip
} from '@mui/material';
import {
  AccountCircle,
  ExitToApp
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useUser, useClerk } from '@clerk/clerk-react';
import UserContext from '../contexts/UserContext';

const NavigationBar = () => {
  const navigate = useNavigate();
  const { user: clerkUser } = useUser();
  const { signOut } = useClerk();
  const { user } = useContext(UserContext);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSignOut = async () => {
    await signOut();
    localStorage.removeItem('zenith_user');
    navigate('/');
    handleMenuClose();
  };

  const handleProfile = () => {
    navigate('/profile');
    handleMenuClose();
  };

  const getRoleColor = (role) => {
    return 'success';
  };

  const getRoleDisplay = (role) => {
    return 'Beneficiary';
  };

  return (
    <>
      <AppBar position="static" sx={{ bgcolor: 'primary.main' }}>
        <Toolbar>
          {/* Logo and Title */}
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, cursor: 'pointer' }}
            onClick={() => navigate('/')}
          >
            🎯 Project Zenith
          </Typography>

          {/* User Info and Controls */}
          {clerkUser && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {/* Role Indicator */}
              <Chip
                label={getRoleDisplay(user?.role || 'beneficiary')}
                color={getRoleColor(user?.role || 'beneficiary')}
                size="small"
                sx={{ color: 'white' }}
              />

              {/* User Menu */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2">
                  {clerkUser.firstName} {clerkUser.lastName}
                </Typography>
                
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleMenuOpen}
                  color="inherit"
                >
                  <Avatar
                    src={clerkUser.imageUrl}
                    alt={clerkUser.firstName}
                    sx={{ width: 32, height: 32 }}
                  >
                    <AccountCircle />
                  </Avatar>
                </IconButton>
              </Box>
            </Box>
          )}

          {/* Login Button for non-authenticated users */}
          {!clerkUser && (
            <Button
              color="inherit"
              onClick={() => navigate('/login')}
              startIcon={<AccountCircle />}
            >
              Login
            </Button>
          )}
        </Toolbar>
      </AppBar>

      {/* User Menu */}
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
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleProfile}>
          <AccountCircle sx={{ mr: 2 }} />
          Profile
        </MenuItem>
        
        <MenuItem onClick={handleSignOut}>
          <ExitToApp sx={{ mr: 2 }} />
          Sign Out
        </MenuItem>
      </Menu>
    </>
  );
};

export default NavigationBar;
