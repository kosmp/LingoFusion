import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import { useNavigate } from 'react-router-dom';
import $api from '../../http';
import InputMask from 'react-input-mask';
import Spinner from '../../components/Spinner';
import styles from './CreateUpdateTest.module.scss';

const CreateUpdateTestTask = (props) => {
  const navigate = useNavigate();
  const [isDataLoaded, setDataLoaded] = useState(true);
  const [title, setTitle] = useState(props.taskTemplate?.title ?? '');
  const [expForTrueTask, setExpForTrueTask] = useState(props.taskTemplate?.expForTrueTask ?? '');
  const [question, setQuestion] = useState(props.taskTemplate?.question ?? '');
  const [options, setOptions] = useState(props.taskTemplate?.options ?? ['', '']);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (correctAnswers.length === 0) {
      props.handleError('Must be at least 1 true answer!');
      return;
    }

    try {
      setDataLoaded(false);

      let response;
      if (props.action === 'create') {
        response = await $api.post(`/courses/${props.courseId}/tasks`, {
          taskType: 'test',
          title: (title) ? title : 'Test task :)',
          description: 'No description',
          expForTrueTask: expForTrueTask,
          question: question,
          trueAnswers: correctAnswers.map((answer) => String(answer)),
          options: options
        });
      } else if (props.action === 'update') {
        response = await $api.put(`/courses/${props.courseId}/tasks/${props.taskId}/edit`, {
          _id: props.taskId,
          taskType: 'test',
          title: (title) ? title : 'Test task :)',
          description: 'No description',
          expForTrueTask: expForTrueTask,
          question: question,
          trueAnswers: correctAnswers.map((answer) => String(answer)),
          options: options
        });
      }

      if (response.status === 200) {
        props.handleSuccessfulOperation();
      } else {
        props.handleError(response?.data?.message);
      }

      navigate(`/courseTemplate/${props.courseId}`);
    } catch (error) {
      props.handleError(`Error with submitting taskTemplate. ${error?.response?.data?.message + ((error?.response?.data?.message) ? ". " : "") + error?.response?.data?.errors?.map((error) => error.msg).join(" ")}`);
    } finally {
      setDataLoaded(true);
    }
  };

  if (!isDataLoaded) {
    return (
      <Spinner />
    );
  }

  return (
    <form onSubmit={handleSubmit} className={styles.container}>
      <h3 className={styles.editorTitle}>Test task editor</h3>
      <TextField
        label="Title"
        fullWidth
        required
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        inputProps={{ maxLength: 50 }}
        className={styles.field}
      />

      <InputMask mask="99" maskChar="" value={expForTrueTask} onChange={(e) => setExpForTrueTask(e.target.value)} className={styles.field} >
        {(inputProps) => (
          <TextField
            label="Experience for true task"
            fullWidth
            required
            value={expForTrueTask}
            {...inputProps}
          />
        )}
      </InputMask>
      
      <TextField
        label="Question"
        fullWidth
        required
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        inputProps={{ maxLength: 120 }}
        className={styles.field}
      />

      {options.map((option, index) => (
        <div key={index}>
          <TextField
            label={`Option ${index + 1}`}
            fullWidth
            required
            value={option}
            onChange={(e) => handleOptionChange(index, e.target.value)}
            inputProps={{ maxLength: 50 }}
            className={styles.field}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={correctAnswers.includes(index)}
                onChange={() => handleToggleCorrectAnswer(index)}
              />
            }
            label={`True answer ${index + 1}`}
            className={styles.checkBoxLine}
          />
          {options.length > 2 && (
            <Button type="button" variant="outlined" onClick={() => handleRemoveOption(index)} className={styles.deleteButton} >
              Delete
            </Button>
          )}
        </div>
      ))}

      <Button type="button" variant="contained" onClick={handleAddOption} className={styles.buttons} >
        Add option
      </Button>

      <Button type="submit" variant="contained" color="primary" className={styles.buttons} >
        Submit
      </Button>
    </form>
  );
};

export default CreateUpdateTestTask;
