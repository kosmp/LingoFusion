import React from 'react';
import Paper from '@mui/material/Paper';
import CreateUpdateTheoryTask from '../../components/CreateUpdateTheoryTask';

export const CreateTheoryTaskTemplate = () => {
  return (
    <Paper style={{ padding: 30 }}>
      <h2>Create theory task</h2>
      <CreateUpdateTheoryTask />  
    </Paper>
  );
};

