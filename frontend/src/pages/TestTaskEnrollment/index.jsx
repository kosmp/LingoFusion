import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Button from '@mui/material/Button';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Paper from '@mui/material/Paper';

export const TestTaskEnrollment = () => {
  const { taskId } = useParams();
  const [selectedOptions, setSelectedOptions] = useState([]);

  const data = [
    { id: '1', label: 'Option 1' },
    { id: '2', label: 'Option 2' },
    { id: '3', label: 'Option 3' }
  ];

  const handleOptionChange = (optionId) => {
    const isSelected = selectedOptions.includes(optionId);

    if (isSelected) {
      setSelectedOptions(selectedOptions.filter((id) => id !== optionId));
    } else {
      setSelectedOptions([...selectedOptions, optionId]);
    }
  };

  const handleSubmitAnswer = () => {
    console.log('Selected options:', selectedOptions);
  };

  return (
    <Paper style={{ padding: 30 }}>
      <h2>Test Task {taskId}</h2>
      <p>Question?</p>

      {data.map((option) => (
        <div key={option.id}>
          <FormControlLabel
            control={
              <Checkbox
                checked={selectedOptions.includes(option.id)}
                onChange={() => handleOptionChange(option.id)}
              />
            }
            label={option.label}
          />
        </div>
      ))}

      <Button variant="contained" color="primary" onClick={handleSubmitAnswer}>
        Submit Answer
      </Button>
    </Paper>
  );
};
