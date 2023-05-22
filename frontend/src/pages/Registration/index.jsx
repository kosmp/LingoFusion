import React, {useContext, useState} from 'react';
import {observer} from "mobx-react-lite";
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import styles from './Registration.module.scss';
import { Context } from '../../index';
import { useNavigate } from 'react-router-dom';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

const Registration = () => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const {store} = useContext(Context);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const isSuccess = await store.registration(login, password);
    if (isSuccess) {
      navigate('/');
    }
  }

  const handleError = (errorMessage) => {
    setError(errorMessage);
  };

  const handleCloseError = () => {
    setError(null);
  };

  React.useEffect(() => {
    store.setErrorCallback(handleError);
    return () => {
      // Очистка коллбэка при размонтировании компонента
      store.setErrorCallback(null);
    };
  }, [store]);

  return (
    <>
      <Paper classes={{ root: styles.root }}>
        <Typography classes={{ root: styles.title }} variant="h5">
          Registration
        </Typography>
        <TextField className={styles.field} value={login} onChange={e => setLogin(e.target.value)} label="Login" fullWidth />
        <TextField className={styles.field} value={password} onChange={e => setPassword(e.target.value)} type = 'password' label="Password" fullWidth />
        <div className={styles.buttons}>
          <Button className={styles.button} onClick={handleSubmit} size="large" variant="contained" fullWidth>
            Register
          </Button>
        </div>
      </Paper>
      <Snackbar open={!!error} autoHideDuration={6000} onClose={handleCloseError}>
        <MuiAlert onClose={handleCloseError} severity="error" className={styles.popup}>
          {error}
        </MuiAlert>
      </Snackbar>
    </>
  );
};

export default observer(Registration);