import React from 'react';
import Button from '@mui/material/Button';
import styles from './TaskButtons.module.scss';

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
    <div className={styles.buttonsContainer}>
      {!isFirstTask && (
        <Button variant="contained" color="primary" onClick={handlePrevTask} className={styles.button} >
          Prev task
        </Button>
      )}

      {courseType === 'courseEnrollment' && (
        <Button variant="contained" color="primary" onClick={handleSubmit} disabled={taskStatus === 'Completed'} className={styles.button} >
          Submit Answer
        </Button>
      )}

      {courseType === 'courseTemplate' && (
        <>
          <Button variant="contained" color="primary" onClick={handleChangeTask} className={styles.button} >
            Change Task
          </Button>
          <Button variant="contained" color="primary" onClick={handleDeleteTask} className={styles.button} >
            Delete Task
          </Button>
        </>
      )}

      {!isLastTask && (
        <Button variant="contained" color="primary" onClick={handleNextTask} className={styles.button} >
          Next task
        </Button>
      )}

      {courseType === 'courseEnrollment' && isLastTask && !isCompleted && (
        <Button variant="contained" color="primary" onClick={handleComplete} className={styles.button} >
          Complete
        </Button>
      )}
    </div>
  );
};

export default TaskButtons;
