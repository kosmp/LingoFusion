import React, { useState, useEffect } from 'react';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import { useParams } from 'react-router-dom';

const FillInGapsTask = (props) => {
  const { taskId } = useParams();
  const [content, setContent] = useState('Please {{gap}} the {{gap}} before proceeding.');
  const [answers, setAnswers] = useState([]);

  useEffect(() => {
    fetch(``)
      .then(response => response.json())
      .then(data => {
        setContent(data.text);
        setAnswers(Array(data.gaps.length).fill(''));
      })
      .catch(error => { 
        console.error('Error:', error);
      });
  }, [taskId]);

  const handleAnswerChange = (index, event) => {
    const newAnswers = [...answers];
    newAnswers[index] = event.target.value;
    setAnswers(newAnswers);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('Answers:', answers);
  };

  const handlePrevTask = () => {

  };

  const handleNextTask = () => {

  };

  const renderContentWithGaps = () => {
    const gapRegex = /{{gap}}/g;
    const gapsCount = (content.match(gapRegex) || []).length;

    if (!content || gapsCount === 0) {
      return null;
    }

    const contentParts = content.split(gapRegex);

    return (
      <>
        {contentParts.map((part, index) => (
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
        ))}
      </>
    );
  };

  const { taskIds } = props;
  const isFirstTask = taskIds[0] === taskId;
  const isLastTask = taskIds[taskIds.length - 1] === taskId;

  return (
    <Paper style={{ padding: 30 }}>
      <h3>Fill in Gaps Task</h3>
      <form onSubmit={handleSubmit}>
        {renderContentWithGaps()}
        <div style={{ marginTop: 20 }}>
          {!isFirstTask && (
            <Button variant="contained" color="primary" onClick={handlePrevTask}>
              Prev task
            </Button>
          )}
          <Button variant="contained" onClick={handleSubmit}>
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
        </div>
      </form>
    </Paper>
  );
};

export default FillInGapsTask;