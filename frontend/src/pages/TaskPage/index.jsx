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
  const [taskTemplate, setTaskTemplate] = useState(null);
  const [taskEnrollment, setTaskEnrollment] = useState(null);
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
            setTaskIds(ids);
          } else {
            navigate(`/`);
            handleError(response?.data?.message);
          }
        } catch (error) {
          navigate(`/`);
          handleError(`Error with fetching of courseTemplate. ${error?.response?.data?.message + ((error?.response?.data?.message) ? ". " : "") + error?.response?.data?.errors?.map((error) => error.msg).join(" ")}`);
        }

        setDataLoaded(true);
      } else if (courseType === 'courseEnrollment') {
        let taskEnrollmentFromResponse;
        try {
          // get single task Enrollment
          response = await $api.get(`/courses/${courseId}/tasks/${taskId}/taskEnrollment`);
          if (response.status === 200) {
            taskEnrollmentFromResponse = await response.data;
            setTaskEnrollment(taskEnrollmentFromResponse);
          } else {
            navigate(`/${courseType}/${courseId}`);
            handleError(response?.data?.message);
          }
        } catch (error) {
          navigate(`/${courseType}/${courseId}`);
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
            navigate(`/`);
            handleError(response?.data?.message);
          }
        } catch (error) {
          navigate(`/`);
          handleError(`Error with fetching of courseEnrollment. ${error?.response?.data?.message + ((error?.response?.data?.message) ? ". " : "") + error?.response?.data?.errors?.map((error) => error.msg).join(" ")}`);
        }

        //get single task Template
        await fetchTaskTemplate(response.data[0].coursePresentationId, taskEnrollmentFromResponse.taskTemplateId);

        setDataLoaded(true);
      }
  }

  let selectedComponent;
  if (courseType === 'courseTemplate' || courseType === 'courseEnrollment') {
    if (taskType === 'test') {
      selectedComponent = <TestTask taskTemplate={taskTemplate}
       taskEnrollment={taskEnrollment} taskIds={taskIds} courseType={courseType}
        handleError={handleError} handleSuccessfulOperation={handleSuccessfulOperation} />;
    } else if (taskType === 'fillInGaps') {
      selectedComponent = <FillInGapsTask taskTemplate={taskTemplate}
       taskEnrollment={taskEnrollment} taskIds={taskIds} courseType={courseType}
        handleError={handleError} handleSuccessfulOperation={handleSuccessfulOperation} />;
    } else if (taskType === 'theory') {
      selectedComponent = <TheoryTask taskTemplate={taskTemplate}
       taskEnrollment={taskEnrollment} taskIds={taskIds} courseType={courseType}
        handleError={handleError} handleSuccessfulOperation={handleSuccessfulOperation} />;
    }
  }

  return <div>{selectedComponent}</div>;
};
