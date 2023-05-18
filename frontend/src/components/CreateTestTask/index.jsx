import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';

const CreateTestTask = () => {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [correctAnswers, setCorrectAnswers] = useState([]);

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...options];
    updatedOptions[index] = value;
    setOptions(updatedOptions);
  };

  const handleAddOption = () => {
    setOptions([...options, '']);
  };

  const handleRemoveOption = (index) => {
    if (options.length > 2) {
      const updatedOptions = options.filter((_, i) => i !== index);
      setOptions(updatedOptions);
      // Remove correct answer if associated option is removed
      setCorrectAnswers(correctAnswers.filter((answer) => answer !== index));
    }
  };

  const handleToggleCorrectAnswer = (index) => {
    if (correctAnswers.includes(index)) {
      setCorrectAnswers(correctAnswers.filter((answer) => answer !== index));
    } else {
      setCorrectAnswers([...correctAnswers, index]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (correctAnswers.length === 0) {
      alert('Must be at least 1 true answer!');
      return;
    }
    console.log('Submitted', question, options, correctAnswers);
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        label="Question"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        fullWidth
        required
      />

      {options.map((option, index) => (
        <div key={index}>
          <TextField
            label={`Option ${index + 1}`}
            value={option}
            onChange={(e) => handleOptionChange(index, e.target.value)}
            fullWidth
            required
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={correctAnswers.includes(index)}
                onChange={() => handleToggleCorrectAnswer(index)}
              />
            }
            label={`True answer ${index + 1}`}
          />
          {options.length > 2 && (
            <Button type="button" variant="outlined" onClick={() => handleRemoveOption(index)}>
              Delete
            </Button>
          )}
        </div>
      ))}

      <Button type="button" variant="contained" onClick={handleAddOption}>
        Add option
      </Button>

      <Button type="submit" variant="contained" color="primary">
        Submit
      </Button>
    </form>
  );
};

export default CreateTestTask;
