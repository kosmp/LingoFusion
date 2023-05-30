import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import TestTask from '../../components/TestTask';
import FillInGapsTask from '../../components/FillInGapsTask';
import TheoryTask from '../../components/TheoryTask';
import $api from "../../http/index";
import Spinner from '../../components/Spinner';

export const TaskPage = ({courseType, handleError, handleSuccessfulOperation}) => {
  const { taskType, taskId, courseId } = useParams();
  const [taskIds, setTaskIds] = useState([]);
  const [taskTypes, setTaskTypes] = useState([]);
  const [taskTemplate, setTaskTemplate] = useState(null);
  const [taskEnrollment, setTaskEnrollment] = useState(null);
  const [isDataLoaded, setDataLoaded] = useState(true);
  const [taskEnrollmentStatus, setTaskEnrollmentStatus] = useState(null);
  const [isFirstTask, setIsFirstTask] = useState(false);
  const [isLastTask, setIsLastTask] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setDataLoaded(false);
    const fetchData = async () => {
      await fetchTask();

      setDataLoaded(true);
    }

    fetchData();
  }, [taskId]);

  const handleSubmit = async (event, userAnswers) => {
    event.preventDefault();

    try {
      setDataLoaded(false);

      // if it's taskEnrollment then courseId is courseEnrollmentId
      if (taskEnrollment?.status === 'InProgress') {
        const response = await $api.post(`/courses/${courseId}/tasks/${taskId}/submit`, {
          userAnswers: userAnswers
        });
        if (response.status === 200) {
          setTaskEnrollmentStatus('Completed');
          await fetchTask();
          handleSuccessfulOperation();
        } else {
          handleError(response?.data?.message);
        }
      }
    } catch (error) {
      handleError(`Error with submitting taskEnrollment. ${error?.response?.data?.message + ((error?.response?.data?.message) ? ". " : "") + error?.response?.data?.errors?.map((error) => error.msg).join(" ")}`);
    } finally {
      setDataLoaded(true);
    }
  };

  const handleComplete = async () => {
    try {
      setDataLoaded(false);
      const response = await $api.post(`/courses/${courseId}/complete`);

      if (response.status === 200) {
        navigate(`/courseEnrollment/${courseId}`);
        handleSuccessfulOperation();
      } else {
        handleError(response?.data?.message);
      }
    } catch (error) {
      handleError(`Error with completing courseEnrollment. ${error?.response?.data?.message + ((error?.response?.data?.message) ? ". " : "") + error?.response?.data?.errors?.map((error) => error.msg).join(" ")}`);
    } finally {
      setDataLoaded(true);
    }
  }

  const handleChangeTask = () => {;
    if (courseType === 'courseTemplate') {
      navigate(`/courseTemplate/${courseId}/taskTemplate/${taskId}/update/${taskType}`);
    }
  };

  const handleDeleteTask = async () => {
    try {
      setDataLoaded(false);
      const response = await $api.delete(`/courses/${courseId}/tasks/${taskTemplate._id}`);

      if (response.status === 200) {
        navigate(`/courseTemplate/${courseId}`)
        handleSuccessfulOperation();
      } else {
        handleError(response?.data?.message);
      }
    } catch (error) {
      handleError(`Error with deleting taskTemplate. ${error?.response?.data?.message}`)
    } finally {
      setDataLoaded(true);
    }
  };

  const handlePrevTask = async () => {
    try {
      setDataLoaded(false);

      if (courseType === 'courseTemplate') {
        // just go to the prev taskId from taskIds
        const currentIndex = taskIds.indexOf(taskId);
        if (currentIndex !== -1 && currentIndex > 0) {
          const prevTaskId = taskIds[currentIndex - 1];
          const prevTaskType = taskTypes[currentIndex - 1];
  
          navigate(`/${courseType}/${courseId}/${prevTaskType}/${prevTaskId}`);
          handleSuccessfulOperation();
        }
      } else if (courseType === 'courseEnrollment') {
        // need to make a request for the prev task
        const response = await $api.get(`/courses/${courseId}/prevTask`);
  
        if (response.status === 200) {
          const data = await response.data;
          navigate(`/courseEnrollment/${courseId}/${data.taskEnrollment.taskType}/${data.taskEnrollment._id}`);
  
          handleSuccessfulOperation();
        } else {
          handleError(response?.data?.message);
        }
      }
    } catch (error) {
      handleError('Error associated with the transition to another task.')
    } finally {
      setDataLoaded(true);
    }
  };

  const handleNextTask = async () => {
    try {
      setDataLoaded(false);

      if (courseType === 'courseTemplate') {
        const currentIndex = taskIds.indexOf(taskId);
        if (currentIndex !== -1 && currentIndex < taskIds.length - 1) {
          const nextTaskId = taskIds[currentIndex + 1];
          const nextTaskType = taskTypes[currentIndex + 1];
  
          navigate(`/${courseType}/${courseId}/${nextTaskType}/${nextTaskId}`);
          handleSuccessfulOperation();
        }
      } else if (courseType === 'courseEnrollment') {
        // need to make a request for the next task
        const response = await $api.get(`/courses/${courseId}/nextTask`);
  
        if (response.status === 200) {
          const data = await response.data;
          navigate(`/courseEnrollment/${courseId}/${data.taskEnrollment.taskType}/${data.taskEnrollment._id}`);
  
          handleSuccessfulOperation();
        } else {
          handleError(response?.data?.message);
        }
      }
    } catch (error) {
      handleError('Error associated with the transition to another task.')
    } finally {
      setDataLoaded(true);
    }
  };

  if (!isDataLoaded) {
    return (
      <Spinner />
    );
  }

  const fetchTaskTemplate = async (courseTemplateId, taskTemplateId) => {
    try {
      // get single task Template
      const response = await $api.get(`/courses/${courseTemplateId}/tasks/${taskTemplateId}/taskTemplate`);
      if (response.status === 200) {
        const data = await response.data;
        setTaskTemplate(data);
      } else {
        navigate(`/${courseType}/${courseId}`);
        handleError(response?.data?.message);
      }
    } catch (error) {
      navigate(`/${courseType}/${courseId}`);
      handleError(`Error with fetching of taskTemplate. ${error?.response?.data?.message + ((error?.response?.data?.message) ? ". " : "") + error?.response?.data?.errors?.map((error) => error.msg).join(" ")}`);
    }
  }

  const fetchTask = async () => {
      let response;
      if (courseType === 'courseTemplate') {
        await fetchTaskTemplate(courseId, taskId);

        try {
          // get course Template
          response = await $api.get(`/courses/${courseId}`);
          if (response.status === 200) {
            const data = await response.data[0];
            const tasks = data.taskTemplates || [];
            const ids = tasks.map((task) => task._id);
            const taskTypes = tasks.map((task) => task.taskType);
            setTaskIds(ids);
            setIsLastTask(ids[ids.length - 1] === taskId);
            setIsFirstTask(ids[0] === taskId);
            setTaskTypes(taskTypes);
          } else {
            navigate(`/`);
            handleError(response?.data?.message);
          }
        } catch (error) {
          navigate(`/`);
          handleError(`Error with fetching of courseTemplate. ${error?.response?.data?.message}`);
        }
      } else if (courseType === 'courseEnrollment') {
        let taskEnrollmentFromResponse;
        try {
          // get single task Enrollment
          response = await $api.get(`/courses/${courseId}/tasks/${taskId}/taskEnrollment`);
          if (response.status === 200) {
            taskEnrollmentFromResponse = response.data;
            setTaskEnrollment(taskEnrollmentFromResponse);
          } else {
            navigate(`/${courseType}/${courseId}`);
            handleError(response?.data?.message);
          }
        } catch (error) {
          navigate(`/${courseType}/${courseId}`);
          handleError(`Error with fetching of taskEnrollment. ${error?.response?.data?.message}`);
        }

        try {
          // get course Enrollment
          response = await $api.get(`/courses/${courseId}/enrollment`);
          if (response.status === 200) {
            const data = await response.data[0];
            const tasks = data.tasks || [];
            const ids = tasks.map((task) => task._id);
            setIsLastTask(ids[ids.length - 1] === taskId);
            setIsFirstTask(ids[0] === taskId);
            const taskTypes = tasks.map((task) => task.taskType);
            setTaskIds(ids);
            setTaskTypes(taskTypes);
          } else {
            navigate(`/`);
            handleError(response?.data?.message);
          }
        } catch (error) {
          navigate(`/`);
          handleError(`Error with fetching of courseEnrollment. ${error?.response?.data?.message} `);
        }
        
        //get single task Template
        await fetchTaskTemplate(response.data[0].coursePresentationId, taskEnrollmentFromResponse.taskTemplateId);

        setTaskEnrollmentStatus(taskEnrollmentFromResponse?.status);
      }
  }

  let selectedComponent;
  if (courseType === 'courseTemplate' || courseType === 'courseEnrollment') {
    if (taskType === 'test') {
      selectedComponent = <TestTask taskTemplate={taskTemplate} taskEnrollmentStatus={taskEnrollmentStatus} handleSubmit={handleSubmit} isFirstTask={isFirstTask} isLastTask={isLastTask}
       taskEnrollment={taskEnrollment} courseType={courseType} handleComplete={handleComplete} handleChangeTask={handleChangeTask} handleDeleteTask={handleDeleteTask}
        handlePrevTask={handlePrevTask} handleNextTask={handleNextTask} />;
    } else if (taskType === 'fillInGaps') {
      selectedComponent = <FillInGapsTask taskTemplate={taskTemplate} taskEnrollmentStatus={taskEnrollmentStatus} handleSubmit={handleSubmit} isFirstTask={isFirstTask} isLastTask={isLastTask}
       taskEnrollment={taskEnrollment} courseType={courseType} handleComplete={handleComplete} handleChangeTask={handleChangeTask} handleDeleteTask={handleDeleteTask}
        handlePrevTask={handlePrevTask} handleNextTask={handleNextTask} />;
    } else if (taskType === 'theory') {
      selectedComponent = <TheoryTask taskTemplate={taskTemplate} taskEnrollmentStatus={taskEnrollmentStatus} handleSubmit={handleSubmit} isFirstTask={isFirstTask} isLastTask={isLastTask}
       taskEnrollment={taskEnrollment} courseType={courseType} handleComplete={handleComplete} handleChangeTask={handleChangeTask} handleDeleteTask={handleDeleteTask}
        handlePrevTask={handlePrevTask} handleNextTask={handleNextTask} />;
    }
  }

  return <div>{selectedComponent}</div>;
};
