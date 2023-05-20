import React from 'react';
import Button from '@mui/material/Button';

const TaskButtons = (props) => {
  const {
    isFirstTask,
    isLastTask,
    handlePrevTask,
    handleNextTask,
    handleSubmit,
    handleChangeTask,
    handleDeleteTask,
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
        <Button variant="contained" color="primary" onClick={handleSubmit}>
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

      {courseType === 'courseEnrollment' && isLastTask && (
        <Button variant="contained" color="primary">
          Complete
        </Button>
      )}
    </>
  );
};

export default TaskButtons;
