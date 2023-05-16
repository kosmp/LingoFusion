import { useContext, useEffect } from 'react';
import './App.css';
import {observer} from "mobx-react-lite";
import { Header } from "./components/Header";
import { Context } from '.';
import { Container } from '@mui/material';
import { Routes, Route } from 'react-router-dom';
// import { Home, Registration, Login, Profile, CourseCatalog,
//    CourseTemplate, CreateCourseTemplate, UpdateCourseTemplate, TaskTemplate, CreateTaskTemplate, UpdateTaskTemplate,
//     CourseEnrollment, TaskEnrollment} from "./pages";
import { Home } from './pages/Home';
import { Registration } from './pages/Registration';
import { Login } from './pages/Login';
import { Profile } from './pages/Profile';
import { CourseCatalog } from './pages/CourseCatalog';
import { CourseTemplate } from './pages/CourseTemplate';
import { CreateCourseTemplate } from './pages/CreateCourseTemplate';
import { UpdateCourseTemplate } from './pages/UpdateCourseTemplate';
import { TaskTemplate } from './pages/TaskTemplate';
import { CreateTaskTemplate } from './pages/CreateTaskTemplate';
import { UpdateTaskTemplate } from './pages/UpdateTaskTemplate';
import { CourseEnrollment } from './pages/CourseEnrollment';
import { TaskEnrollment } from './pages/TaskEnrollment';

function App() {
  return (
    <div className="App">
      <Header />
      <Container maxWidth='lg'>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/catalog" element={<CourseCatalog />} />
          <Route path="/courseTemplate/:courseId" element={<CourseTemplate />} />
          <Route path="/courseTemplate/create" element={<CreateCourseTemplate />} />
          <Route path="/courseTemplate/:courseId/update" element={<UpdateCourseTemplate />} />
          <Route path="/courseTemplate/:courseId/taskTemplate/:taskId" element={<TaskTemplate />} />
          <Route path="/courseTemplate/:courseId/taskTemplate/create" element={<CreateTaskTemplate />} />    
          <Route path="/courseTemplate/:courseId/taskTemplate/:taskId/update" element={<UpdateTaskTemplate />} />  
          <Route path="/courseEnrollment/:courseId/" element={<CourseEnrollment />} />
          <Route path="/courseEnrollment/:courseId/taskTemplate/:taskId" element={<TaskEnrollment />} />
        </Routes>
      </Container>
    </div>
  );
}

export default observer(App);
