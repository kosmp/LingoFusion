import React from 'react';
import { useParams } from 'react-router-dom';
import CreateUpdateTestTask from '../../components/CreateUpdateTestTask';
import CreateUpdateTheoryTask from '../../components/CreateUpdateTheoryTask';
import CreateUpdateFillInGapsTask from '../../components/CreateUpdateFillInGapsTask';
import Paper from '@mui/material/Paper';

export const CreateUpdateTaskTemplate = ({action, handleError}) => {
  const { taskType } = useParams();

  let selectedComponent;
  if (taskType === 'test' && (action === 'create' || action === 'update')) {
    selectedComponent = (
    <div>
        <h2>{action.charAt(0).toUpperCase() + action.slice(1)} test task</h2>
        <Paper style={{ padding: 30 }}>
            <CreateUpdateTestTask action={action} />
        </Paper>
    </div>);
  } else if (taskType === 'theory' && (action === 'create' || action === 'update')) {
    selectedComponent = (
        <div>
            <h2>{action.charAt(0).toUpperCase() + action.slice(1)} theory task</h2>
            <Paper style={{ padding: 30 }}>
                <CreateUpdateTheoryTask action={action} />
            </Paper>
        </div>);
  } else if (taskType === 'fillInGaps' && (action === 'create' || action === 'update')) {
    selectedComponent = (
        <div>
            <h2>{action.charAt(0).toUpperCase() + action.slice(1)} fill in gaps task</h2>
            <Paper style={{ padding: 30 }}>
                <CreateUpdateFillInGapsTask action={action} />
            </Paper>
        </div>);
  }

  return <div>{selectedComponent}</div>;
};