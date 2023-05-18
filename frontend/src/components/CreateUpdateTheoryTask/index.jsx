import React, { useState } from 'react';
import Button from '@mui/material/Button';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';

const CreateUpdateTheoryTask = () => {
  const [content, setContent] = useState('');

  const handleEditorChange = ({ text }) => {
    setContent(text);
  };

  const handleSubmit = () => {
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
      <Button size="large" variant="contained">
        Submit
      </Button>
    </div>
  );
};

const mdParser = new MarkdownIt();

export default CreateUpdateTheoryTask;
