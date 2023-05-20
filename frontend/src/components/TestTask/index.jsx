import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Paper from '@mui/material/Paper';
import TaskButtons from '../TaskButtons';

const TestTask = (props) => {
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

  const handleSubmit = (event) => {
    event.preventDefault();
    
  };

  const handlePrevTask = () => {

  };

  const handleNextTask = () => {

  };

  const handleChangeTask = () => {;

  };

  const handleDeleteTask = () => {

  };

  const { taskIds } = props;
  const isLastTask = taskIds[taskIds.length - 1] === taskId;
  const isFirstTask = taskIds[0] === taskId;

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

      <TaskButtons
        isFirstTask={isFirstTask}
        isLastTask={isLastTask}
        handleSubmit={handleSubmit}
        handleChangeTask={handleChangeTask}
        handleDeleteTask={handleDeleteTask}
        handleNextTask={handleNextTask}
        handlePrevTask={handlePrevTask}
        courseType={props.courseType}
      />
    </Paper>
  );
};

export default TestTask;
