import React from 'react';
import Paper from '@mui/material/Paper';
import CreateUpdateTestTask from '../../components/CreateUpdateTestTask';

export const CreateTestTaskTemplate = () => {
  return (  
    <Paper style={{ padding: 30 }}>
      <h2>Create Test task</h2>
      <CreateUpdateTestTask />  
    </Paper>
  );
};

