import React, { useContext } from 'react';
import { Context } from '../index';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = ({...props }) => {
  const { store } = useContext(Context);

  if (store.isAuth) {
    return <Outlet {...props} />;
  } else {
    return <Navigate to="/login" />;
  }
};

export default PrivateRoute;
