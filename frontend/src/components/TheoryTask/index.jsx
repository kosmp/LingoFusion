import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { useParams } from 'react-router-dom';
import Paper from '@mui/material/Paper';
import TaskButtons from '../TaskButtons';

const TheoryTask = ({taskTemplate, taskEnrollment, courseType, taskEnrollmentStatus,
  handlePrevTask, handleNextTask, handleComplete, handleChangeTask, handleDeleteTask, handleSubmit, isFirstTask, isLastTask}) => {
  const { taskId } = useParams();
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');

  useEffect(() => {
    setTitle(taskTemplate?.title);
    setContent(taskTemplate?.content);
  }, [taskId]);

  return (
    <Paper style={{ padding: 30 }}>
      <h3>Theory Task</h3>
      <h3>Title: {title}</h3>
      <ReactMarkdown>{content}</ReactMarkdown>

      {taskEnrollmentStatus === 'Completed' && (
        <h4>
          Gained experience for task: {taskEnrollment?.expForTask}
        </h4>
      )}

      <TaskButtons
        isFirstTask={isFirstTask}
        isLastTask={isLastTask}
        isCompleted={taskEnrollment?.completedAt}
        handleSubmit={(event) => handleSubmit(event, [])}
        handleChangeTask={handleChangeTask}
        handleDeleteTask={handleDeleteTask}
        handleNextTask={handleNextTask}
        handlePrevTask={handlePrevTask}
        handleComplete={handleComplete}
        taskStatus={taskEnrollmentStatus}
        courseType={courseType}
      />
    </Paper>
  );
};

export default TheoryTask;
