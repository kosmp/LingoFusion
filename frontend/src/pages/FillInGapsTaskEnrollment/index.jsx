import React, { useState, useEffect } from 'react';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';

export const FillInGapsTaskEnrollment = () => {
  const [content, setContent] = useState('Please {{gap}} the {{gap}} before proceeding.');
  const [answers, setAnswers] = useState([]);

  useEffect(() => {
    fetch('')
      .then(response => response.json())
      .then(data => {
        setContent(data.text);
        setAnswers(Array(data.gaps.length).fill(''));
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }, []);

  const handleAnswerChange = (index, event) => {
    const newAnswers = [...answers];
    newAnswers[index] = event.target.value;
    setAnswers(newAnswers);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    console.log('Answers:', answers);
  };

  const renderContentWithGaps = () => {
    const gapRegex = /{{gap}}/g;
    const gapsCount = (content.match(gapRegex) || []).length;

    if (!content || gapsCount === 0) {
      return null;
    }

    const contentParts = content.split(gapRegex);

    return contentParts.map((part, index) => (
      <React.Fragment key={index}>
        {part}
        {index !== contentParts.length - 1 && (
          <input
            type="text"
            value={answers[index] || ''}
            onChange={(event) => handleAnswerChange(index, event)}
            placeholder={`Enter answer for gap ${index + 1}`}
          />
        )}
      </React.Fragment>
    ));
  };

  return (
    <Paper style={{ padding: 30 }}>
      <h3>Fill in Gaps Task</h3>
      <form onSubmit={handleSubmit}>
        {renderContentWithGaps()}
        <Button variant="contained" onClick={handleSubmit}>
          Submit
        </Button>
      </form>
    </Paper>
  );
};