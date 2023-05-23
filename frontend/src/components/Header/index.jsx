import React, { useState, useContext } from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import styles from './Header.module.scss';
import Container from '@mui/material/Container';
import { Context } from '../../index';
import { observer } from "mobx-react-lite";
import { NavLink, useNavigate } from 'react-router-dom';

const Header = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const { store } = useContext(Context);
  const navigate = useNavigate();
  
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    handleMenuClose();
    const isSuccess = await store.logout();
    if (isSuccess) {
      navigate('/login');
    } else {
      
    }
  };

  const handleProfile = () => {
    handleMenuClose();
  };

  return (
    <div className={styles.root}>
      <Container maxWidth="lg">
        <div className={styles.inner}>
          <a className={styles.logo} href="/">
            <div>LingoFusion</div>
          </a>
          <div className={styles.buttons}>
          {store.isAuth ? (
            <>
            <NavLink to="/courseTemplate/create">
                <Button variant="contained" color="error">
                  Create course
                </Button>
              </NavLink>
              <NavLink to="/catalog">
                <Button variant="contained" color="error">
                  Courses
                </Button>
              </NavLink>
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
                getcontentanchorel={null}
              >
                <NavLink to={`/profile/${store.user._id}`} className={styles.activeLink}>
                  <MenuItem onClick={handleProfile} style={{ display: 'block',  padding: '8px 16px'}}>
                    Profile
                  </MenuItem>
                </NavLink>
                <MenuItem onClick={handleLogout} style={{ display: 'block',  padding: '8px 16px'}}>Logout</MenuItem>
              </Menu>
            </>)  : (
              <>
                <NavLink to="/login">
                  <Button variant="contained">LogIn</Button>
                </NavLink>
                <NavLink to="/register">
                  <Button variant="contained">Create account</Button>
                </NavLink>
              </>
            ) }
          </div>
        </div>
      </Container>
    </div>
  );
};

export default observer(Header);
