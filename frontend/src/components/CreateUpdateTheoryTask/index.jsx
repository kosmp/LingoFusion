import React, { useState } from 'react';
import Button from '@mui/material/Button';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import { useNavigate } from 'react-router-dom';

const CreateUpdateTheoryTask = (props) => {
  const navigate = useNavigate();
  const [content, setContent] = useState('');

  const handleEditorChange = ({ text }) => {
    setContent(text);
  };

  const handleSubmit = () => {
    if (props.action === 'create') {


    } else if (props.action === 'update') {


    }

    navigate(`/courseTemplate/:courseId`);
    console.log('Saved:', content);
  };

  return (
    <div>
      <h3>Theory Task Editor</h3>
      <MdEditor
        value={content}
        renderHTML={(text) => mdParser.render(text)}
        onChange={handleEditorChange}
      />
      <Button size="large" variant="contained" onClick={handleSubmit}>
        Submit
      </Button>
    </div>
  );
};

const mdParser = new MarkdownIt();

export default CreateUpdateTheoryTask;
