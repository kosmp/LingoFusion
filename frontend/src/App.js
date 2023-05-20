import './App.css';
import {observer} from "mobx-react-lite";
import { Header } from "./components/Header";
import { Container } from '@mui/material';
import { Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { Registration } from './pages/Registration';
import { Login } from './pages/Login';
import { CourseCatalog } from './pages/CourseCatalog';
import { CreateCourseTemplate } from './pages/CreateCourseTemplate';
import { UpdateCourseTemplate } from './pages/UpdateCourseTemplate';
import { UpdateTaskTemplate } from './pages/UpdateTaskTemplate';
import { CoursePage } from './pages/CoursePage';
import { CreateTaskTemplate } from './pages/CreateTaskTemplate';
import { TaskPage } from './pages/TaskPage';

function App() {
  return (
    <div className="App">
      <Header />
      <Container maxWidth='lg'>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/login" element={<Login />} />
          <Route path="/catalog" element={<CourseCatalog />} />
          <Route path="/:courseType/:courseId" element={<CoursePage />} />
          <Route path="/courseTemplate/create" element={<CreateCourseTemplate />} />
          <Route path="/courseTemplate/:courseId/update" element={<UpdateCourseTemplate />} />
          <Route path="/courseTemplate/:courseId/taskTemplate/create/:taskType" element={<CreateTaskTemplate />} />    
          <Route path="/courseTemplate/:courseId/taskTemplate/:taskId/update" element={<UpdateTaskTemplate />} />  
          <Route path="/:courseType/:courseId/:taskType/:taskId" element={<TaskPage />} />
        </Routes>
      </Container>
    </div>
  );
}

export default observer(App);
