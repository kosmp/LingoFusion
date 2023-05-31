import React, {useContext, useState} from 'react';
import {observer} from "mobx-react-lite";
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import styles from './Registration.module.scss';
import { Context } from '../../index';
import { useNavigate } from 'react-router-dom';
import Spinner from '../../components/Spinner';

const Registration = ({handleError, handleSuccessfulOperation}) => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const {store} = useContext(Context);
  const [isDataLoaded, setDataLoaded] = useState(true);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    try {
      setDataLoaded(false);

      if (await store.registration(login, password)) {
        navigate('/');
        handleSuccessfulOperation();
      }
    } catch (error) {
      handleError(`Login error. ${error?.response?.data?.message}`)
    } finally {
      setDataLoaded(true);
    }
  }

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
  );
};

export default observer(Registration);