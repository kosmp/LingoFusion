import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { useParams } from 'react-router-dom';
import Paper from '@mui/material/Paper';
import TaskButtons from '../TaskButtons';

const TheoryTask = (props) => {
  const { taskId } = useParams();
  const [content, setContent] = useState('');

  useEffect(() => {
    const taskContent = 'Some **Markdown** content';

    setContent(taskContent);
  }, [taskId]);

  const handleSubmit = (event) => {
    event.preventDefault();
    
  };

  const handlePrevTask = () => {

  };

  const handleNextTask = () => {

  };

  const handleChangeTask = () => {;

  };

  const handleDeleteTask = () => {

  };

  const { taskIds } = props;
  const isLastTask = taskIds[taskIds.length - 1] === taskId;
  const isFirstTask = taskIds[0] === taskId;

  return (
    <Paper style={{ padding: 30 }}>
      <h3>Theory Task</h3>
      <ReactMarkdown>{content}</ReactMarkdown>

      <TaskButtons
        isFirstTask={isFirstTask}
        isLastTask={isLastTask}
        handleSubmit={handleSubmit}
        handleChangeTask={handleChangeTask}
        handleDeleteTask={handleDeleteTask}
        handleNextTask={handleNextTask}
        handlePrevTask={handlePrevTask}
        courseType={props.courseType}
      />
    </Paper>
  );
};

export default TheoryTask;
