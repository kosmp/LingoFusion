import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useNavigate } from 'react-router-dom';
import styles from './Header.module.scss';
import Container from '@mui/material/Container';

export const Header = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();

  };

  const handleProfile = () => {
    handleMenuClose();

    navigate('/profile/:userId');
  };

  return (
    <div className={styles.root}>
      <Container maxWidth="lg">
        <div className={styles.inner}>
          <a className={styles.logo} href="/">
            <div>LingoFusion</div>
          </a>
          <div className={styles.buttons}>
            <a href="/courseTemplate/create">
              <Button variant="contained" color="error">
                Create course
              </Button>
            </a>
            <a href="/catalog">
              <Button variant="contained" color="error">
                Courses
              </Button>
            </a>
            <Button onClick={handleMenuOpen} variant="contained" color="error">
              User
            </Button>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              getContentAnchorEl={null}
            >
              <MenuItem onClick={handleProfile}>Profile</MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </div>
        </div>
      </Container>
    </div>
  );
};
