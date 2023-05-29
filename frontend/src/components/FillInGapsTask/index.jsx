import React, { useState, useEffect } from 'react';
import Paper from '@mui/material/Paper';
import { useNavigate, useParams } from 'react-router-dom';
import TaskButtons from '../TaskButtons';
import $api from "../../http/index";

const FillInGapsTask = ({taskTemplate, taskEnrollment, taskIds, courseType, handleError, handleSuccessfulOperation, taskTypes}) => {
  const { taskType, taskId, courseId } = useParams();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [expForTrueTask, setExpForTrueTask] = useState('');
  const [userAnswers, setUserAnswers] = useState([]);
  const [taskEnrollmentStatus, setTaskEnrollmentStatus] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setContent(taskTemplate?.text);
    setTitle(taskTemplate?.title);
    setExpForTrueTask(taskTemplate?.expForTrueTask);

    setTaskEnrollmentStatus(taskEnrollment?.status);
  }, [taskId]);


  const handleSubmit = async (event) => {
    event.preventDefault();

    // if it's taskEnrollment then courseId is courseEnrollmentId
    if (taskEnrollment?.status === 'InProgress') {
      try {
        const response = await $api.post(`/courses/${courseId}/tasks/${taskId}/submit`, {
          userAnswers: userAnswers
        });

        if (response.status === 200) {
          setTaskEnrollmentStatus('Completed');
          handleSuccessfulOperation();
        } else {
          handleError(response?.data?.message);
        }
      } catch (error) {
        handleError(`Error with submitting taskEnrollment. ${error?.response?.data?.message + ((error?.response?.data?.message) ? ". " : "") + error?.response?.data?.errors?.map((error) => error.msg).join(" ")}`);
      }
    }
  };

  const handleComplete = async () => {
    try {
      const response = await $api.post(`/courses/${courseId}/complete`);

      if (response.status === 200) {
        navigate(`/courseEnrollment/${courseId}`);
        handleSuccessfulOperation();
      } else {
        handleError(response?.data?.message);
      }
    } catch (error) {
      handleError(`Error with completing courseEnrollment. ${error?.response?.data?.message + ((error?.response?.data?.message) ? ". " : "") + error?.response?.data?.errors?.map((error) => error.msg).join(" ")}`);
    }
  }

  const handlePrevTask = async () => {
    if (courseType === 'courseTemplate') {
      // just go to the prev taskId from taskIds
      try {
        const currentIndex = taskIds.indexOf(taskId);
        if (currentIndex !== -1 && currentIndex > 0) {
          const prevTaskId = taskIds[currentIndex - 1];
          const prevTaskType = taskTypes[currentIndex - 1];

          navigate(`/${courseType}/${courseId}/${prevTaskType}/${prevTaskId}`);
          handleSuccessfulOperation();
        }
      } catch (error) {
        handleError('Error related to moving to prev task template.')
      }
    } else if (courseType === 'courseEnrollment') {
      // need to make a request for the prev task
      try {
        const response = await $api.get(`/courses/${courseId}/prevTask`);

        if (response.status === 200) {
          const data = await response.data;
          navigate(`/courseEnrollment/${courseId}/${data.taskEnrollment.taskType}/${data.taskEnrollment._id}`);

          handleSuccessfulOperation();
        } else {
          handleError(response?.data?.message);
        }
      } catch (error) {
        handleError('Error related to request get prev task enrollment of course.');
      }
    }
  };

  const handleNextTask = async () => {
    if (courseType === 'courseTemplate') {
      try {
        const currentIndex = taskIds.indexOf(taskId);
        if (currentIndex !== -1 && currentIndex < taskIds.length - 1) {
          const nextTaskId = taskIds[currentIndex + 1];
          const nextTaskType = taskTypes[currentIndex + 1];

          navigate(`/${courseType}/${courseId}/${nextTaskType}/${nextTaskId}`);
          handleSuccessfulOperation();
        }
      } catch (error) {
        handleError('Error related to moving to next task template.')
      }
    } else if (courseType === 'courseEnrollment') {
      // need to make a request for the next task
      try {
        const response = await $api.get(`/courses/${courseId}/nextTask`);

        if (response.status === 200) {
          const data = await response.data;
          navigate(`/courseEnrollment/${courseId}/${data.taskEnrollment.taskType}/${data.taskEnrollment._id}`);

          handleSuccessfulOperation();
        } else {
          handleError(response?.data?.message);
        }
      } catch (error) {
        handleError('Error related to request get next task enrollment of course.');
      }
    }
  };

  const handleChangeTask = () => {;
    if (courseType === 'courseTemplate') {
      navigate(`/courseTemplate/${courseId}/taskTemplate/${taskId}/update/${taskType}`);
    }
  };

  const handleDeleteTask = async () => {
    try {
      const response = await $api.delete(`/courses/${courseId}/tasks/${taskTemplate._id}`);

      if (response.status === 200) {
        navigate(`/courseTemplate/${courseId}`)
        handleSuccessfulOperation();
      } else {
        handleError(response?.data?.message);
      }
    } catch (error) {
      handleError(`Error with deleting taskTemplate. ${error?.response?.data?.message}`)
    }
  };

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
      <form onSubmit={handleSubmit}>
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
                Gained experience for task: {taskEnrollment.expForTask}
              </h4>
              <h4>
                Your Answers: {taskEnrollment.userAnswers.join((', '))}
              </h4>
              <h4>
                Correct Answers: {taskTemplate.blanks.map((blank) => blank.answer).join(', ')}
              </h4>
            </div>
          )}

          <TaskButtons
            isFirstTask={taskIds[0] === taskId}
            isLastTask={taskIds[taskIds.length - 1] === taskId}
            isCompleted={taskEnrollment?.completedAt}
            handleSubmit={handleSubmit}
            handleChangeTask={handleChangeTask}
            handleDeleteTask={handleDeleteTask}
            handleNextTask={handleNextTask}
            handlePrevTask={handlePrevTask}
            handleComplete={handleComplete}
            taskStatus={taskEnrollmentStatus}
            courseType={courseType}
          />
        </div>
      </form>
    </Paper>
  );
};

export default FillInGapsTask;
