import React, { useState, useRef } from 'react';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import NativeSelect from '@mui/material/NativeSelect';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import { useNavigate } from 'react-router-dom';
import { FormControl, FormHelperText } from '@mui/material';
import 'easymde/dist/easymde.min.css';
import styles from './CreateUpdateCourse.module.scss';

const CreateUpdateCourse = (props) => {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [title, setTitle] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [content, setContent] = useState('');
  const [englishLevel, setEnglishLevel] = useState('');
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const fileInputRef = useRef(null);

  const handleOpenFilePicker = () => {
    fileInputRef.current.click();
  };

  const handleChangeFile = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      const imageUrl = reader.result;
      setImageUrl(imageUrl);
    };

    reader.readAsDataURL(file);
  };

  const onClickRemoveImage = () => {
    setImageUrl('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formErrors = {};

    if (title === '') {
      formErrors.title = 'Please fill in the title field.';
    }

    if (englishLevel === '') {
      formErrors.englishLevel = 'Please select an English level.';
    }

    if (content === '') {
      formErrors.content = 'Description cant be empty.';
    }

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    if (props.action === 'create') {

    } else if (props.action === 'update') {

    }

    navigate('/courseTemplate/:courseId');
  };

  const handleChangeTitle = (event) => {
    setTitle(event.target.value);
  }

  const handleEditorChange = ({ text }) => {
    setContent(text);
  };

  const handleEnglishLevelChange = (event) => {
    setEnglishLevel(event.target.value);
  };

  const handleTagInputChange = (event) => {
    setTagInput(event.target.value);
  };

  const handleAddTag = () => {
    if (tagInput.trim() !== '' && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag) => {
    const updatedTags = tags.filter((t) => t !== tag);
    setTags(updatedTags);
  };

  return (
    <>
      <Paper style={{ padding: 30 }}>
        {imageUrl ? (
          <div className={styles.imageContainer}>
            <img className={styles.image} src={imageUrl} alt="Uploaded" />
            <Button
              variant="contained"
              color="error"
              onClick={onClickRemoveImage}
              className={styles.buttons}
           >
              Remove
            </Button>
          </div>
        ) : (
          <div>
            <Button variant="outlined" size="large" onClick={handleOpenFilePicker}>
              Download preview
            </Button>
            <input
              type="file"
              onChange={handleChangeFile}
              hidden
              ref={fileInputRef}
            />
          </div>
       )}
        <br />
        <br />
        <FormControl error={!!errors.title} fullWidth>
          <TextField
            classes={{ root: styles.title }}
            variant="standard"
            placeholder="Course title..."
            onChange={handleChangeTitle}
            fullWidth
          />
          {errors.title && <FormHelperText>{errors.title}</FormHelperText>}
        </FormControl>
        <FormControl error={!!errors.englishLevel} fullWidth>
          <NativeSelect
            classes={{ root: styles.englishLvl }}
            variant="standard"
            value={englishLevel}
            onChange={handleEnglishLevelChange}
            fullWidth
          >
            <option value="" disabled>Select English Level</option>
            <option value="A0">A0</option>
            <option value="A1">A1</option>
            <option value="B1">B1</option>
            <option value="B2">B2</option>
            <option value="C1">C1</option>
            <option value="C2">C2</option>
          </NativeSelect>
          {errors.englishLevel && <FormHelperText>{errors.englishLevel}</FormHelperText>}
        </FormControl>
       <br />
        <br />
        <div className={`${styles.tagInputContainer} ${styles.buttons}`} >
          <TextField
            classes={{ root: styles.tagInput }}
            variant="standard"
            placeholder="Add tag"
            value={tagInput}
            onChange={handleTagInputChange}
          />
          <Button variant="contained" color="primary" onClick={handleAddTag}>
            Add tag
          </Button>
        </div>
        {tags.length > 0 && (
          <div className={styles.tagList}>
            {tags.map((tag, index) => (
              <span key={index} className={styles.tag} onClick={() => handleRemoveTag(tag)}>
                {tag}
                <button
                  className={styles.removeTagButton}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveTag(tag);
                  }}
                >
                  &#10005;
                </button>
              </span>
            ))}
          </div>
        )}
        <FormControl error={!!errors.content} fullWidth>
          {errors.content && <FormHelperText>{errors.content}</FormHelperText>}
          <MdEditor
            value={content}
            renderHTML={(text) => mdParser.render(text)}
            onChange={handleEditorChange}
            placeholder={content ? undefined : 'Enter description...'}
            className={styles.editor}
          />
        </FormControl>
        <div className={styles.buttons}>
          <Button size="large" variant="contained" onClick={handleSubmit}>
            Submit
          </Button>
          <a href="/">
            <Button size="large" variant="contained">
              Cancel
            </Button>
          </a>
        </div>
      </Paper>
    </>
  );
};

const mdParser = new MarkdownIt();

export default CreateUpdateCourse;
