import React from 'react';
import Button from '@mui/material/Button';

const TaskButtons = (props) => {
  const {
    isFirstTask,
    isLastTask,
    isCompleted,
    handlePrevTask,
    handleNextTask,
    handleSubmit,
    handleComplete,
    handleChangeTask,
    handleDeleteTask,
    taskStatus,
    courseType
  } = props;

  return (
    <>
      {!isFirstTask && (
        <Button variant="contained" color="primary" onClick={handlePrevTask}>
          Prev task
        </Button>
      )}

      {courseType === 'courseEnrollment' && (
        <Button variant="contained" color="primary" onClick={handleSubmit} disabled={taskStatus === 'Completed'}>
          Submit Answer
        </Button>
      )}

      {courseType === 'courseTemplate' && (
        <>
          <Button variant="contained" color="primary" onClick={handleChangeTask}>
            Change Task
          </Button>
          <Button variant="contained" color="primary" onClick={handleDeleteTask}>
            Delete Task
          </Button>
        </>
      )}

      {!isLastTask && (
        <Button variant="contained" color="primary" onClick={handleNextTask}>
          Next task
        </Button>
      )}

      {courseType === 'courseEnrollment' && isLastTask && !isCompleted && (
        <Button variant="contained" color="primary" onClick={handleComplete}>
          Complete
        </Button>
      )}
    </>
  );
};

export default TaskButtons;
