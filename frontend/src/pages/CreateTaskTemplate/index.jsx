import React from 'react';
import { useParams } from 'react-router-dom';
import CreateTestTask from '../../components/CreateTestTask';
import CreateTheoryTask from '../../components/CreateTheoryTask';
import CreateFillInGapsTask from '../../components/CreateFillInGapsTask';
import Paper from '@mui/material/Paper';

export const CreateTaskTemplate = () => {
  const { taskType } = useParams();

  let selectedComponent;
  if (taskType === 'test') {
    selectedComponent = (
    <div>
        <h2>Create test task</h2>
        <Paper style={{ padding: 30 }}>
            <CreateTestTask />
        </Paper>
    </div>);
  } else if (taskType === 'theory') {
    selectedComponent = (
        <div>
            <h2>Create theory task</h2>
            <Paper style={{ padding: 30 }}>
                <CreateTheoryTask />
            </Paper>
        </div>);
  } else if (taskType === 'fillInGaps') {
    selectedComponent = (
        <div>
            <h2>Create fill in gaps task</h2>
            <Paper style={{ padding: 30 }}>
                <CreateFillInGapsTask />
            </Paper>
        </div>);
  }

  return <div>{selectedComponent}</div>;
};