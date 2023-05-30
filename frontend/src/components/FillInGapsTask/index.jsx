import React, { useState, useEffect } from 'react';
import Paper from '@mui/material/Paper';
import { useParams } from 'react-router-dom';
import TaskButtons from '../TaskButtons';

const FillInGapsTask = ({taskTemplate, taskEnrollment, courseType, taskEnrollmentStatus,
   handlePrevTask, handleNextTask, handleComplete, handleChangeTask, handleDeleteTask, handleSubmit, isFirstTask, isLastTask}) => {
  const { taskId } = useParams();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [expForTrueTask, setExpForTrueTask] = useState('');
  const [userAnswers, setUserAnswers] = useState([]);

  useEffect(() => {
    setContent(taskTemplate?.text);
    setTitle(taskTemplate?.title);
    setExpForTrueTask(taskTemplate?.expForTrueTask);
  }, [taskId]);

  const handleAnswerChange = (index, event) => {
    const newAnswers = [...userAnswers];
    newAnswers[index] = event.target.value;
    setUserAnswers([...newAnswers]);
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
                value={userAnswers[index] || ''}
                onChange={(event) => handleAnswerChange(index, event)}
                placeholder={`Enter answer for gap ${index + 1}`}
                disabled={taskEnrollmentStatus === 'Completed'}
              />
            )}
          </React.Fragment>
        ))}
      </>
    );
  };

  return (
    <Paper style={{ padding: 30 }}>
      <h3>Fill in Gaps Task</h3>
      <h3>Title: {title}</h3>
        {renderContentWithGaps()}
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
                Correct Answers: {taskTemplate?.blanks?.map((blank) => blank.answer)?.join(', ')}
              </h4>
            </div>
          )}

          <TaskButtons
            isFirstTask={isFirstTask}
            isLastTask={isLastTask}
            isCompleted={taskEnrollment?.completedAt}
            handleSubmit={async (event) => { handleSubmit(event, userAnswers)
              await handleSubmit(event, userAnswers);
            }}
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

export default FillInGapsTask;
