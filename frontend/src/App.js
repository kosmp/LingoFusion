import './App.css';
import { useContext, useEffect, useState } from 'react';
import {observer} from "mobx-react-lite";
import Header from "./components/Header";
import { Container } from '@mui/material';
import { Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import Registration from './pages/Registration';
import Login from './pages/Login';
import { CourseCatalog } from './pages/CourseCatalog';
import { CreateUpdateCourseTemplate } from './pages/CreateUpdateCourseTemplate';
import { CreateUpdateTaskTemplate } from './pages/CreateUpdateTaskTemplate';
import { CoursePage } from './pages/CoursePage';
import { TaskPage } from './pages/TaskPage';
import { Profile } from './pages/Profile';
import { Context } from '.';
import PrivateRoute from './utils/privateRoute';
import Spinner from './components/Spinner';
import PopUpWindow from './components/PopUpWindow';

function App() {
  const {store} = useContext(Context);
  const [checkAuthStatus, setCheckAuthStatus] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      if (localStorage.getItem('token')) {
        await store.checkAuth();
      } 
      setCheckAuthStatus('checked');
    }

    checkAuth();
  }, []);

  const handleError = (errorMessage) => {
    setError(errorMessage);
  };

  const handleCloseError = () => {
    setError(null);
  };
  
  if (store.isLoading || !checkAuthStatus) {
    return (
      <Spinner />
    );
  }

  return (
    <div className="App">
      <Header />
      <Container>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/login" element={<Login />} />     

          <Route element={<PrivateRoute />}>
            <Route path="/catalog" element={<CourseCatalog handleError={handleError} />} />
            <Route path={`/profile/${store.user._id}`} element={<Profile handleError={handleError} />} />
            <Route path="/courseTemplate/create" element={<CreateUpdateCourseTemplate action='create' handleError={handleError} />} />
            <Route path="/courseTemplate/:courseId/update" element={<CreateUpdateCourseTemplate action='update' handleError={handleError} />} />
            <Route path="/courseTemplate/:courseId/:action" element={<CreateUpdateCourseTemplate handleError={handleError} />} />
            <Route path="/courseTemplate/:courseId/taskTemplate/create/:taskType" element={<CreateUpdateTaskTemplate action='create' handleError={handleError} />} />
            <Route path="/courseTemplate/:courseId/taskTemplate/:taskId/update/:taskType" element={<CreateUpdateTaskTemplate action='update' handleError={handleError} />} />
            <Route path="/courseTemplate/:courseId" element={<CoursePage courseType='courseTemplate' handleError={handleError} />} />
            <Route path="/courseEnrollment/:courseId" element={<CoursePage courseType='courseEnrollment' handleError={handleError} />} />
            <Route path="/courseTemplate/:courseId/:taskType/:taskId" element={<TaskPage courseType='courseTemplate' handleError={handleError} />} />
            <Route path="/courseEnrollment/:courseId/:taskType/:taskId" element={<TaskPage courseType='courseEnrollment' handleError={handleError} />} />
          </Route>

        </Routes>
      </Container>

      <PopUpWindow error={error} handleCloseError={handleCloseError} />
    </div>
  );
}

export default observer(App);
