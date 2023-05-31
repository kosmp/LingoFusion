import React, { useState } from 'react';
import Button from '@mui/material/Button';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import { useNavigate } from 'react-router-dom';
import InputMask from 'react-input-mask';
import TextField from '@mui/material/TextField';
import $api from '../../http';
import Spinner from '../../components/Spinner';
import styles from './CreateUpdateTheory.module.scss';

const CreateUpdateTheoryTask = (props) => {
  const navigate = useNavigate();
  const [isDataLoaded, setDataLoaded] = useState(true);
  const [title, setTitle] = useState('');
  const [expForTrueTask, setExpForTrueTask] = useState('');
  const [content, setContent] = useState('');

  const handleEditorChange = ({ text }) => {
    setContent(text);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setDataLoaded(false);

      let response;
      if (props.action === 'create') {
        response = await $api.post(`/courses/${props.courseId}/tasks`, {
          taskType: 'theory',
          title: (title) ? title : 'Theory task :)',
          description: 'No description',
          expForTrueTask: expForTrueTask,
          content: content,
          references: [''],
          images: ['']
        });
      } else if (props.action === 'update') {
        response = await $api.put(`/courses/${props.courseId}/tasks/${props.taskId}/edit`, {
          _id: props.taskId,
          taskType: 'theory',
          title: (title) ? title : 'Theory task :)',
          description: 'No description',
          expForTrueTask: expForTrueTask,
          content: content,
          references: [''],
          images: ['']
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
      <h3 className={styles.editorTitle}>Theory Task Editor</h3>
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

      <MdEditor
        value={content}
        renderHTML={(text) => mdParser.render(text)}
        onChange={handleEditorChange}
        className={styles.field}
      />
      <Button type="submit" variant="contained" color="primary" className={styles.submitButton} >
        Submit
      </Button>
    </form>
  );
};

const mdParser = new MarkdownIt();

export default CreateUpdateTheoryTask;
