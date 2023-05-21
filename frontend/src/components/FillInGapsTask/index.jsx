import React, { useState, useEffect } from 'react';
import Paper from '@mui/material/Paper';
import { useParams } from 'react-router-dom';
import TaskButtons from '../TaskButtons';

const FillInGapsTask = (props) => {
  const { taskId } = useParams();
  const [content, setContent] = useState('Please {{gap}} the {{gap}} before proceeding.');
  const [answers, setAnswers] = useState([]);
  const [trueAnswers, setTrueAnswers] = useState([]);
  const [gainedExp, setGainedExp] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);

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

  const handleSubmit = (event) => {
    event.preventDefault();

    if (props.taskStatus === 'InProgress') {
      // get task Template
      fetch('')
      .then((response) => response.json())
      .then((data) => {
        if (data.taskType !== 'theory') {
          setTrueAnswers(data.trueAnswers || []);
        } else {
          setTrueAnswers([]);
        }
      })
      .catch((error) => {
        console.error('Error fetching single task:', error);
      });

      // submit task request

  }
    
  };

  const handlePrevTask = () => {

  };

  const handleNextTask = () => {

  };

  const handleChangeTask = () => {;

  };

  const handleDeleteTask = () => {

  };

  const handleAnswerChange = (index, event) => {
    const newAnswers = [...answers];
    newAnswers[index] = event.target.value;
    setAnswers(newAnswers);
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
                disabled={props.taskStatus === 'Completed'}
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
          {props.taskStatus === 'Completed' && (
            <div>
              <h4>
                This task already completed
              </h4>
              <h4>
                Gained experience for task: {gainedExp}
              </h4>
              <h4>
                Your Answers: {userAnswers}
              </h4>
              <h4>
                Correct Answers: {trueAnswers.join(', ')}
              </h4>
            </div>
          )}

          <TaskButtons
            isFirstTask={isFirstTask}
            isLastTask={isLastTask}
            handleSubmit={handleSubmit}
            handleChangeTask={handleChangeTask}
            handleDeleteTask={handleDeleteTask}
            handleNextTask={handleNextTask}
            handlePrevTask={handlePrevTask}
            taskStatus={props.taskStatus}
            courseType={props.courseType}
          />
        </div>
      </form>
    </Paper>
  );
};

export default FillInGapsTask;
