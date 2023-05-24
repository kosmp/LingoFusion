import React, {useContext, useState} from 'react';
import {observer} from "mobx-react-lite";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import styles from "./Login.module.scss";
import { Context } from '../../index';
import { useNavigate } from 'react-router-dom';
import PopUpWindow from '../../components/PopUpWindow';
import Spinner from '../../components/Spinner';

const Login = () => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const {store} = useContext(Context);
  const [isDataLoaded, setDataLoaded] = useState(true);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setDataLoaded(false);
    const isSuccess = await store.login(login, password);
    setDataLoaded(true);
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

  if (!isDataLoaded) {
    return (
      <Spinner />
    );
  }

  return (
    <div className={styles.container}>
      <Paper classes={{ root: styles.root }}>
        <Typography classes={{ root: styles.title }} variant="h5">
          Login
        </Typography>
        <TextField className={styles.field} value={login} onChange={e => setLogin(e.target.value)} label="Login" fullWidth />
        <TextField className={styles.field} value={password} onChange={e => setPassword(e.target.value)} type = 'password' label="Password" fullWidth />
        <div className={styles.buttons}>
          <Button className={styles.button} onClick={handleSubmit} size="large" variant="contained" fullWidth>
            LogIn
          </Button>
        </div>
      </Paper>
      <PopUpWindow error={error} handleCloseError={handleCloseError} />
    </div>
  );
};

export default observer(Login);