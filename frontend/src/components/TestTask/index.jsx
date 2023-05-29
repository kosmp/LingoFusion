import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Paper from '@mui/material/Paper';
import TaskButtons from '../TaskButtons';

const TestTask = ({taskTemplate, taskEnrollment, courseType, taskEnrollmentStatus,
    handlePrevTask, handleNextTask, handleComplete, handleChangeTask, handleDeleteTask, handleSubmit, isFirstTask, isLastTask}) => {
  const { taskId } = useParams();
  const [question, setQuestion] = useState('');
  const [title, setTitle] = useState('');
  const [expForTrueTask, setExpForTrueTask] = useState('');
  const [userAnswers, setUserAnswers] = useState([]);

  useEffect(() => {
    setTitle(taskTemplate?.title);
    setQuestion(taskTemplate?.question);
    setExpForTrueTask(taskTemplate?.expForTrueTask);
  }, [taskId]);

  const handleOptionChange = (optionId) => {
    const isSelected = userAnswers.includes(String(optionId));
  
    if (isSelected) {
      setUserAnswers(userAnswers.filter((id) => String(id) !== String(optionId)));
    } else {
      setUserAnswers([...userAnswers, String(optionId)]);
    }
  };

  return (
    <Paper style={{ padding: 30 }}>
      <h2>Test Task</h2>
      <h3>Title: {title}</h3>
      <h3>Question: {question}</h3>
      
      {(taskTemplate) && taskTemplate?.options?.map((option, index) => (
        <div key={index}>
          <FormControlLabel
            control={
              <Checkbox
                checked={userAnswers.includes(String(index))}
                onChange={() => handleOptionChange(index)}
                disabled={taskEnrollmentStatus === 'Completed'}
              />
            }
            label={option}
          />
        </div>
      ))}

      <div style={{ marginTop: 20 }}>
          <h4>
            Max experience you can get for task: {expForTrueTask}
          </h4>
          {taskEnrollmentStatus === 'Completed' && (
            <div>
              <h4>
                This task already completed at: {taskEnrollment?.completedAt}
              </h4>
              <h4>
                Started at: {taskEnrollment?.startedAt}
              </h4>
              <h4>
                Gained experience for task: {taskEnrollment?.expForTask}
              </h4>
              <h4>
                Your Answers: {taskEnrollment?.userAnswers?.join((', '))}
              </h4>
              <h4>
                Correct Answers: {taskTemplate?.trueAnswers?.join(', ')}
              </h4>
            </div>
          )}

          <TaskButtons
            isFirstTask={isFirstTask}
            isLastTask={isLastTask}
            isCompleted={taskEnrollment?.completedAt}
            handleSubmit={(event) => handleSubmit(event, userAnswers)}
            handleChangeTask={handleChangeTask}
            handleDeleteTask={handleDeleteTask}
            handleNextTask={handleNextTask}
            handlePrevTask={handlePrevTask}
            handleComplete={handleComplete}
            taskStatus={taskEnrollmentStatus}
            courseType={courseType}
          />
        </div>
    </Paper>
  );
};

export default TestTask;
