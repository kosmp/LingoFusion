import './App.css';
import {observer} from "mobx-react-lite";
import { Header } from "./components/Header";
import { Container } from '@mui/material';
import { Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { Registration } from './pages/Registration';
import { Login } from './pages/Login';
import { Profile } from './pages/Profile';
import { CourseCatalog } from './pages/CourseCatalog';
import { CourseTemplate } from './pages/CourseTemplate';
import { CreateCourseTemplate } from './pages/CreateCourseTemplate';
import { UpdateCourseTemplate } from './pages/UpdateCourseTemplate';
import { TaskTemplate } from './pages/TaskTemplate';
import { CreateTestTaskTemplate } from './pages/CreateTestTaskTemplate';
import { CreateTheoryTaskTemplate } from './pages/CreateTheoryTaskTemplate';
import { CreateFillInGapsTaskTemplate } from './pages/CreateFillInGapsTaskTemplate';
import { UpdateTaskTemplate } from './pages/UpdateTaskTemplate';
import { CourseEnrollment } from './pages/CourseEnrollment';
import { TestTaskEnrollment } from './pages/TestTaskEnrollment';
import { TheoryTaskEnrollment } from './pages/TheoryTaskEnrollment';
import { FillInGapsTaskEnrollment } from './pages/FillInGapsTaskEnrollment';

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
          <Route path="/courseTemplate/:courseId/taskTemplate/createTest" element={<CreateTestTaskTemplate />} />    
          <Route path="/courseTemplate/:courseId/taskTemplate/createTheory" element={<CreateTheoryTaskTemplate />} /> 
          <Route path="/courseTemplate/:courseId/taskTemplate/createFillInGaps" element={<CreateFillInGapsTaskTemplate />} /> 
          <Route path="/courseTemplate/:courseId/taskTemplate/:taskId/update" element={<UpdateTaskTemplate />} />  
          <Route path="/courseEnrollment/:courseId/" element={<CourseEnrollment />} />
          <Route path="/courseEnrollment/:courseId/testTaskEnrollment/:taskId" element={<TestTaskEnrollment />} />
          <Route path="/courseEnrollment/:courseId/fillInGapsTaskEnrollment/:taskId" element={<FillInGapsTaskEnrollment />} />
          <Route path="/courseEnrollment/:courseId/theoryTaskEnrollment/:taskId" element={<TheoryTaskEnrollment />} />
        </Routes>
      </Container>
    </div>
  );
}

export default observer(App);
