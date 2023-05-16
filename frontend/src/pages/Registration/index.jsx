import React from 'react';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';

import styles from './Registration.module.scss';

export const Registration = () => {
  return (
    <Paper classes={{ root: styles.root }}>
      <Typography classes={{ root: styles.title }} variant="h5">
        Registration
      </Typography>
      <TextField className={styles.field} label="Login" fullWidth />
      <TextField className={styles.field} label="Password" fullWidth />
      <div className={styles.buttons}>
        <Button className={styles.button} size="large" variant="contained" fullWidth>
          Register
        </Button>
      </div>
    </Paper>
  );
};