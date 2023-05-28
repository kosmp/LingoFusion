import React, { useState } from 'react';
import Button from '@mui/material/Button';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import { useNavigate } from 'react-router-dom';
import InputMask from 'react-input-mask';
import TextField from '@mui/material/TextField';
import $api from '../../http';

const CreateUpdateTheoryTask = (props) => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [expForTrueTask, setExpForTrueTask] = useState('');
  const [content, setContent] = useState('');

  const handleEditorChange = ({ text }) => {
    setContent(text);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let response;
      if (props.action === 'create') {
        response = await $api.post(`/courses/${props.courseId}/tasks`, {
          taskType: 'test',
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
          taskType: 'test',
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
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Theory Task Editor</h3>
      <InputMask mask={"*".repeat(50)} maskChar="" value={title} onChange={(e) => setTitle(e.target.value)}>
        {(inputProps) => (
          <TextField
            label="Title"
            fullWidth
            {...inputProps}
          />
        )}
      </InputMask>

      <InputMask mask="99" maskChar="" value={expForTrueTask} onChange={(e) => setExpForTrueTask(e.target.value)}>
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
      />
      <Button type="submit" variant="contained" color="primary">
        Submit
      </Button>
    </form>
  );
};

const mdParser = new MarkdownIt();

export default CreateUpdateTheoryTask;
