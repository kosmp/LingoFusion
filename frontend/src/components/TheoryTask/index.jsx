import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { useParams } from 'react-router-dom';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';

const TheoryTask = (props) => {
  const { taskId } = useParams();
  const [content, setContent] = useState('');

  useEffect(() => {
    const taskContent = 'Some **Markdown** content';

    setContent(taskContent);
  }, [taskId]);

  const handleSubmit = () => {

  };

  const handlePrevTask = () => {

  };

  const handleNextTask = () => {

  };

  const { taskIds } = props;
  const isLastTask = taskIds[taskIds.length - 1] === taskId;
  const isFirstTask = taskIds[0] === taskId;

  return (
    <Paper style={{ padding: 30 }}>
      <h3>Theory Task</h3>
      <ReactMarkdown>{content}</ReactMarkdown>

      {!isFirstTask && (
        <Button variant="contained" color="primary" onClick={handlePrevTask}>
          Prev task
        </Button>
      )}
      <Button variant="contained" color="primary" onClick={handleSubmit}>
        Submit
      </Button>
      {!isLastTask && (
        <Button variant="contained" color="primary" onClick={handleNextTask}>
          Next task
        </Button>
      )}
      {isLastTask && (
        <Button variant="contained" color="primary">
          Complete
        </Button>
      )}
    </Paper>
  );
};

export default TheoryTask;
