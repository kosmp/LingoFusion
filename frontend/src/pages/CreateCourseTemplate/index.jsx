import React from 'react';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import SimpleMDE from 'react-simplemde-editor';

import 'easymde/dist/easymde.min.css';
import styles from './CreateCourseTemplate.module.scss';

export const CreateCourseTemplate = () => {
  const imageUrl = '';
  const [value, setValue] = React.useState('');

  const handleChangeFile = () => {};

  const onClickRemoveImage = () => {};

  const onChange = React.useCallback((value) => {
    setValue(value);
  }, []);

  const options = React.useMemo(
    () => ({
      spellChecker: false,
      maxHeight: '400px',
      autofocus: true,
      placeholder: 'Enter description...',
      status: false,
      autosave: {
        enabled: true,
        delay: 1000,
      },
    }),
    [],
  );

  return (
    <Paper style={{ padding: 30 }}>
      <Button variant="outlined" size="large">
          Download preview
      </Button>
      <input type="file" onChange={handleChangeFile} hidden />
      {imageUrl && (
        <Button variant="contained" color="error" onClick={onClickRemoveImage}>
          Remove
        </Button>
      )}
      {imageUrl && (
        <img className={styles.image} src={`http://localhost:4444${imageUrl}`} alt="Uploaded" />
      )}
      <br />
      <br />
      <TextField
        classes={{ root: styles.title }}
        variant="standard"
        placeholder="Course title..."
        fullWidth
      />
      <br />
      <TextField classes={{ root: styles.tags }} variant="standard" placeholder="EnglishLvl" fullWidth />
      <br />
      <br />
      <TextField classes={{ root: styles.tags }} variant="standard" placeholder="Tags" fullWidth />
      <SimpleMDE className={styles.editor} value={value} onChange={onChange} options={options} />
      <div className={styles.buttons}>
        <a href="/courseTemplate/:courseId/taskTemplate/create">
            <Button size="large" variant="contained">
                Create
            </Button>
        </a>
        <a href="/">
            <Button size="large" variant="contained">
                Cancel
            </Button>
        </a>
      </div>
    </Paper>
  );
};