import React, { useState } from 'react';
import Button from '@mui/material/Button';

const CreateFillInGapsTask = () => {
  const [content, setContent] = useState('');
  const gapMarker = '{{gap}}';
  const [answers, setAnswers] = useState([]);
  const gaps = content.match(new RegExp(gapMarker, 'g')) || [];

  const handleContentChange = (event) => {
    setContent(event.target.value);
  };

  const handleAnswerChange = (index, event) => {
    const newAnswers = [...answers];
    newAnswers[index] = event.target.value;
    setAnswers(newAnswers);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (gaps.length === 0) {
      console.log('Add at least 1 gap!');
      return;
    }

    if (answers.length === gaps.length && answers.every(answer => answer.trim() !== '')) {
      console.log('Savevd:', content, answers);
    } else {
      console.log('Fill in all gaps!');
    }
  };

  return (
    <div>
      <h3>Fill in Gaps Task Form</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <textarea value={content} onChange={handleContentChange} placeholder="Enter task content..." />
        </div>

        <div>Gap Marker: {gapMarker}</div>

        {gaps.map((gap, index) => (
          <div key={index}>
            <input
              type="text"
              value={answers[index] || ''}
              onChange={(event) => handleAnswerChange(index, event)}
              placeholder={`Enter answer for gap ${index + 1}`}
              required
            />
          </div>
        ))}

        <Button variant="contained" color="primary" type="submit" disabled={gaps.length === 0}>
          Submit
        </Button>
      </form>
    </div>
  );
};

export default CreateFillInGapsTask;
