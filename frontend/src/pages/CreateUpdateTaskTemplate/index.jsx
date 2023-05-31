import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import CreateUpdateTestTask from '../../components/CreateUpdateTestTask';
import CreateUpdateTheoryTask from '../../components/CreateUpdateTheoryTask';
import CreateUpdateFillInGapsTask from '../../components/CreateUpdateFillInGapsTask';
import Paper from '@mui/material/Paper';
import Spinner from '../../components/Spinner';
import $api from '../../http';

export const CreateUpdateTaskTemplate = ({action, handleError, handleSuccessfulOperation}) => {
  const { taskType, courseId, taskId } = useParams();
  const [isDataLoaded, setDataLoaded] = useState(true);
  const [taskTemplate, setTaskTemplate] = useState(null);

  useEffect(() => {
    setDataLoaded(false); 

    const fetchData = async () => {
      if (action === 'update') {
        await fetchTask();
      }

      setDataLoaded(true);
    }

    fetchData();
  }, [action, courseId, taskId]);

  const fetchTask = async () => {
    try {
      const response = await $api.get(`/courses/${courseId}/tasks/${taskId}/taskTemplate`);

      if (response.status === 200) {
        setTaskTemplate(response.data);
      } else {
        handleError(response?.data?.message);
      }
    } catch(error) {
        handleError(`Error with fetching task template to update. ${error?.response?.data?.message}`);
    }
  }

  if (!isDataLoaded) {
    return (
      <Spinner />
    );
  }

  let selectedComponent;
  if (taskType === 'test' && (action === 'create' || action === 'update')) {
    selectedComponent = (
    <div>
        <h2>{action.charAt(0).toUpperCase() + action.slice(1)} test task</h2>
        <Paper style={{ padding: 30 }}>
            <CreateUpdateTestTask action={action} courseId={courseId} taskId={taskId} handleError={handleError} handleSuccessfulOperation={handleSuccessfulOperation} taskTemplate={taskTemplate} />
        </Paper>
    </div>);
  } else if (taskType === 'theory' && (action === 'create' || action === 'update')) {
    selectedComponent = (
        <div>
            <h2>{action.charAt(0).toUpperCase() + action.slice(1)} theory task</h2>
            <Paper style={{ padding: 30 }}>
                <CreateUpdateTheoryTask action={action} courseId={courseId} taskId={taskId} handleError={handleError} handleSuccessfulOperation={handleSuccessfulOperation} taskTemplate={taskTemplate} />
            </Paper>
        </div>);
  } else if (taskType === 'fillInGaps' && (action === 'create' || action === 'update')) {
    selectedComponent = (
        <div>
            <h2>{action.charAt(0).toUpperCase() + action.slice(1)} fill in gaps task</h2>
            <Paper style={{ padding: 30 }}>
                <CreateUpdateFillInGapsTask action={action} courseId={courseId} taskId={taskId} handleError={handleError} handleSuccessfulOperation={handleSuccessfulOperation} taskTemplate={taskTemplate} />
            </Paper>
        </div>);
  }

  return <div>{selectedComponent}</div>;
};