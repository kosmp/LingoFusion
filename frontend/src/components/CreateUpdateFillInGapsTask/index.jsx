import React, { useState } from 'react';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import InputMask from 'react-input-mask';
import TextField from '@mui/material/TextField';
import $api from '../../http';
import Spinner from '../../components/Spinner';
import styles from './CreateUpdateFillInGaps.module.scss';

const CreateUpdateFillInGapsTask = (props) => {
  const navigate = useNavigate();
  const [isDataLoaded, setDataLoaded] = useState(true);
  const [title, setTitle] = useState('');
  const [expForTrueTask, setExpForTrueTask] = useState('');
  const [content, setContent] = useState('');
  const [answers, setAnswers] = useState([]);
  const gapMarker = '{{gap}}';
  const gaps = content.match(new RegExp(gapMarker, 'g')) || [];

  const handleContentChange = (event) => {
    setContent(event.target.value);
  };

  const handleAnswerChange = (index, event) => {
    const newAnswers = [...answers];
    newAnswers[index] = event.target.value;
    setAnswers(newAnswers);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (gaps.length === 0) {
      props.handleError('Add at least 1 gap!');
      return;
    }

    try {
      setDataLoaded(false);

      if (answers.length === gaps.length && answers.every(answer => answer.trim() !== '')) {
        let response;
        if (props.action === 'create') {
          response = await $api.post(`/courses/${props.courseId}/tasks`, {
            taskType: 'fillInGaps',
            title: (title) ? title : 'Fill in gaps task :)',
            description: 'No description',
            expForTrueTask: expForTrueTask,
            text: content,
            blanks: answers.map((answer) => ({ answer: answer}))
          });
        } else if (props.action === 'update') {
          response = await $api.put(`/courses/${props.courseId}/tasks/${props.taskId}/edit`, {
            taskType: 'fillInGaps',
            title: (title) ? title : 'Fill in gaps task :)',
            description: 'No description',
            expForTrueTask: expForTrueTask,
            text: content,
            blanks: answers.map((answer) => ({ answer: answer}))
          });
        }
  
        if (response.status === 200) {
          props.handleSuccessfulOperation();
        } else {
          props.handleError(response?.data?.message);
        }
  
        navigate(`/courseTemplate/${props.courseId}`);
      } else {
        props.handleError('Fill in all gaps!');
      }
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
    <div>
      <form onSubmit={handleSubmit} className={styles.container}>
        <h3 className={styles.editorTitle}>Fill in gaps task editor</h3>
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
              label="Experience for submitting task"
              fullWidth
              required
              value={expForTrueTask}
              {...inputProps}
            />
          )}
        </InputMask>

        <TextField
            multiline
            rows={4}
            value={content}
            onChange={handleContentChange}
            placeholder={`Enter task content with markers ${gapMarker} as a gaps...`}
            required
            fullWidth
            className={styles.field}
        />

        {gaps.map((gap, index) => (
          <div key={index}>
            <TextField
              label={`Enter answer for gap ${index + 1}`}
              fullWidth
              required
              value={answers[index] || ''}
              onChange={(event) => handleAnswerChange(index, event)}
              inputProps={{ maxLength: 50 }}
              className={styles.field}
            />
          </div>
        ))}

        <Button variant="contained" color="primary" type="submit" disabled={gaps.length === 0} className={styles.submitButton}>
          Submit
        </Button>
      </form>
    </div>
  );
};

export default CreateUpdateFillInGapsTask;
