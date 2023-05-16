import React from 'react';
import Button from '@mui/material/Button';

import styles from './Header.module.scss';
import Container from '@mui/material/Container';

export const Header = () => {
  const isAuth = true;

  const onClickLogout = () => {};
//   const onClickProfile = () => {};
  const onClickCatalog = () => {};
  const onClickCreateCourseTemplate = () => {};

  return (
    <div className={styles.root}>
      <Container maxWidth="lg">
        <div className={styles.inner}>
          <a className={styles.logo} href="/">
            <div>LingoFusion</div>
          </a>
          <div className={styles.buttons}>
            {isAuth ? (
              <>
                <a href="/courseTemplate/create">
                    <Button onClick={onClickCreateCourseTemplate} variant="contained" color="error">
                        Create course
                    </Button>
                </a>
                <a href="/catalog">
                    <Button onClick={onClickCatalog} variant="contained" color="error">
                        Courses
                    </Button>
                </a>
                {/* <a href={`/users/${userId}/profile`}>
                    <Button onClick={onClickProfile} variant="contained" color="error">
                        Profile
                    </Button>
                </a> */}
                <Button onClick={onClickLogout} variant="contained" color="error">
                  LogOut
                </Button>
              </>
            ) : (
              <>
                <a href="/login">
                  <Button variant="contained">LogIn</Button>
                </a>
                <a href="/register">
                  <Button variant="contained">Create account</Button>
                </a>
              </>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
};