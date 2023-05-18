import React, { useState, useEffect } from 'react';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import {marked} from 'marked';

const TheoryTaskEnrollment = ({ match }) => {
  const [content, setContent] = useState('');

  useEffect(() => {
    const taskContent = 'Some ***Markdown*** content';

    setContent(taskContent);
  });

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  const renderContent = () => {
    const renderedContent = marked(content); // Преобразование Markdown в HTML

    return <div dangerouslySetInnerHTML={{ __html: renderedContent }} />;
  };

  return (
    <Paper style={{ padding: 30 }}>
      <h3>Theory Task</h3>
      {renderContent()}
      <Button variant="contained" onClick={handleSubmit}>
          Submit
        </Button>
    </Paper>
  );
};

export default TheoryTaskEnrollment;
