import { useContext, useEffect } from 'react';
import './App.css';
import {observer} from "mobx-react-lite";
import LoginForm from './components/loginForm';
import { Context } from '.';

function App() {
  const {store} = useContext(Context);

  useEffect(() => {
      if (localStorage.getItem('token')) {
          store.checkAuth()
      }
  }, []);

  if (store.isLoading) { // если isLoading === true, то показываем Loader
    return (
      <div>Loading...</div>
    );
  }

  if (!store.isAuth) {
    return (
      <LoginForm/>
    )
  }

  return (
    <div className="App">
      <h1>{store.isAuth ? `User is authorized: ${store.user.login}` : 'You need to authorize'}</h1>
      <button onClick={() => store.logout()}>LogOut</button>
    </div>
  );
}

export default observer(App);
