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

function App() {
  const {store} = useContext(Context);
  const [checkAuthStatus, setCheckAuthStatus] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      if (localStorage.getItem('token')) {
        await store.checkAuth()
        
        setCheckAuthStatus('checked');
      } 
    }
    
    checkAuth();
  }, []);
  
  if (store.isLoading || !checkAuthStatus) {
    return (
      <Spinner />
    );
  }

  return (
    <div className="App">
      <Header />
      <Container maxWidth='lg'>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/login" element={<Login />} />     

          <Route element={<PrivateRoute />}>
            <Route path="/catalog" element={<CourseCatalog />} />
            <Route path={`/profile/${store.user._id}`} element={<Profile />} />
            <Route path="/courseTemplate/:action" element={<CreateUpdateCourseTemplate />} />
            <Route path="/courseTemplate/:courseId/:action" element={<CreateUpdateCourseTemplate />} />
            <Route path="/courseTemplate/:courseId/taskTemplate/:action/:taskType" element={<CreateUpdateTaskTemplate />} />
            <Route path="/courseTemplate/:courseId/taskTemplate/:taskId/:action/:taskType" element={<CreateUpdateTaskTemplate />} />
            <Route path="/:courseType/:courseId" element={<CoursePage />} />
            <Route path="/:courseType/:courseId/:taskType/:taskId" element={<TaskPage />} />
          </Route>

        </Routes>
      </Container>
    </div>
  );
}

export default observer(App);
