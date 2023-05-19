import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { useParams } from 'react-router-dom';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';

const TheoryTaskEnrollment = () => {
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

  return (
    <Paper style={{ padding: 30 }}>
      <h3>Theory Task</h3>
      <ReactMarkdown>{content}</ReactMarkdown>
      <Button variant="contained" color="primary" onClick={handlePrevTask}>
        Prev task
      </Button>
      <Button variant="contained" color="primary" onClick={handleSubmit}>
        Submit
      </Button>
      <Button variant="contained" color="primary" onClick={handleNextTask}>
        Next task
      </Button>
      </Paper>
  );
};

export default TheoryTaskEnrollment;
