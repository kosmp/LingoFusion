import React from 'react';
import Paper from '@mui/material/Paper';
import CreateUpdateFillInGapsTask from '../../components/CreateUpdateFillInGapsTask';

export const CreateFillInGapsTaskTemplate = () => {
  return (
    <Paper style={{ padding: 30 }}>
      <h2>Create FillInGaps task</h2>
      <CreateUpdateFillInGapsTask />  
    </Paper>
  );
};