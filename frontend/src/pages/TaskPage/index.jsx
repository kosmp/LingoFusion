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
  const [singleTask, setSingleTask] = useState(null);
  const [taskStatus, setTaskStatus] = useState(null);
  const [isDataLoaded, setDataLoaded] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setDataLoaded(false);
    fetchTask();
  }, []);

  if (!isDataLoaded) {
    return (
      <Spinner />
    );
  }

  const fetchTask = async () => {
      let response;
      if (courseType === 'courseTemplate') {
        try {
          // get single task Template
          response = await $api.get(`/courses/${courseId}/tasks/${taskId}/taskTemplate`);
          if (response.status === 200) {
            const data = await response.data;
            setSingleTask(data);
          } else {
            handleError(response?.data?.message);
          }
        } catch (error) {
          navigate('/');
          handleError(`Error with fetching of taskTemplate. ${error?.response?.data?.message + ((error?.response?.data?.message) ? ". " : "") + error?.response?.data?.errors?.map((error) => error.msg).join(" ")}`);
        }

        try {
          // get course Template
          response = await $api.get(`/courses/${courseId}`);
          if (response.status === 200) {
            const data = await response.data[0];
            const tasks = data.taskTemplates || [];
            const ids = tasks.map((task) => task._id);
            setTaskIds(ids);
          } else {
            handleError(response?.data?.message);
          }
        } catch (error) {
          navigate('/');
          handleError(`Error with fetching of courseTemplate. ${error?.response?.data?.message + ((error?.response?.data?.message) ? ". " : "") + error?.response?.data?.errors?.map((error) => error.msg).join(" ")}`);
        }

        setDataLoaded(true);
      } else if (courseType === 'courseEnrollment') {
        try {
          //get single task Enrollment
          response = await $api.get(`/courses/${courseId}/tasks/${taskId}/taskEnrollment`);
          if (response.status === 200) {
            const data = await response.data;
            setSingleTask(data);
            setTaskStatus(data.status);
          } else {
            handleError(response?.data?.message);
          }
        } catch (error) {
          navigate('/');
          handleError(`Error with fetching of taskEnrollment. ${error?.response?.data?.message + ((error?.response?.data?.message) ? ". " : "") + error?.response?.data?.errors?.map((error) => error.msg).join(" ")}`);
        }

        try {
          // get course Enrollment
          response = await $api.get(`/courses/${courseId}/enrollment`);
          if (response.status === 200) {
            const data = await response.data[0];
            const tasks = data.tasks || [];
            const ids = tasks.map((task) => task._id);
            setTaskIds(ids);
          } else {
            handleError(response?.data?.message);
          }
        } catch (error) {
          navigate('/');
          handleError(`Error with fetching of courseEnrollment. ${error?.response?.data?.message + ((error?.response?.data?.message) ? ". " : "") + error?.response?.data?.errors?.map((error) => error.msg).join(" ")}`);
        }

        setDataLoaded(true);
      }
  }

  let selectedComponent;
  if (courseType === 'courseTemplate' || courseType === 'courseEnrollment') {
    if (taskType === 'test') {
      selectedComponent = <TestTask singleTask={singleTask} taskStatus={taskStatus} taskIds={taskIds} courseType={courseType} />;
    } else if (taskType === 'fillInGaps') {
      selectedComponent = <FillInGapsTask singleTask={singleTask} taskStatus={taskStatus} taskIds={taskIds} courseType={courseType} />;
    } else if (taskType === 'theory') {
      selectedComponent = <TheoryTask singleTask={singleTask} taskStatus={taskStatus} taskIds={taskIds} courseType={courseType} />;
    }
  }

  return <div>{selectedComponent}</div>;
};
