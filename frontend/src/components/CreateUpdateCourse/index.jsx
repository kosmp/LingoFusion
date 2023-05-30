import React, { useState, useRef, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import NativeSelect from '@mui/material/NativeSelect';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import { useNavigate, useParams } from 'react-router-dom';
import { FormControl, FormHelperText } from '@mui/material';
import 'easymde/dist/easymde.min.css';
import styles from './CreateUpdateCourse.module.scss';
import $api from "../../http/index";
import Spinner from '../../components/Spinner';

const CreateUpdateCourse = ({action, handleError, handleSuccessfulOperation}) => {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [title, setTitle] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [description, setDescription] = useState('');
  const [englishLvl, setEnglishLvl] = useState('');
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [showTags, setShowTags] = useState(false);
  const [validTags, setValidTags] = useState([]);
  const [isDataLoaded, setDataLoaded] = useState(true);
  const { courseId } = useParams();
  const fileInputRef = useRef(null);

  const fetchTags = async () => {
    try {
      const response = await $api.get(`/courses/templates/tags`); 
      if (response.status === 200) {
        setValidTags(response.data);
      } else {
        handleError(response?.data?.message);
      }
    } catch (error) {
      handleError(`Error related to fetching tags. ${error?.response?.data?.message}`);
    }
  }

  useEffect(() => {
    setDataLoaded(false); 
      
    const fetchData = async () => {
      await fetchTags();

      setDataLoaded(true);
    }

    fetchData();
  }, []);

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formErrors = {};

    if (title === '') {
      formErrors.title = 'Please fill in the title field.';
    }

    if (englishLvl === '') {
      formErrors.englishLvl = 'Please select an English level.';
    }

    if (description === '') {
      formErrors.description = 'Description cant be empty.';
    }

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setDataLoaded(false);

    if (action === 'create') {
      try {
        const response = await $api.post(`/courses`, {title, description, englishLvl, imageUrl, tags});

        if (response.status !== 200) {
          navigate(`/courseTemplate/create`);
          handleError(response.response?.data?.message);
        } else {
          navigate(`/courseTemplate/${response.data._id}`);
          handleSuccessfulOperation();
        }
      } catch (error) {
        navigate(`/courseTemplate/create`);
        handleError(`${error?.response?.data?.message + ((error?.response?.data?.message) ? ". " : "") + error?.response?.data?.errors?.map((error) => error.msg).join(" ")}`);
      } finally {
        setDataLoaded(true);
      }
    } else if (action === 'update') {
      try {
        const rating = 0;
        const response = await $api.put(`/courses/${courseId}`, {title, description, englishLvl, imageUrl, tags, rating});

        if (response.status !== 200) {
          navigate(`/courseTemplate/${courseId}`);
          handleError(response.response?.data?.message);
        } else {
          navigate(`/courseTemplate/${courseId}`);
          handleSuccessfulOperation();
        }
      } catch (error) {
        navigate(`/courseTemplate/${courseId}`);
        handleError(`${error?.response?.data?.message + ((error?.response?.data?.message) ? ". " : "") + error?.response?.data?.errors?.map((error) => error.msg).join(" ")}`);
      } finally {
        setDataLoaded(true);
      }
    }
  };

  const handleChangeTitle = (event) => {
    setTitle(event.target.value);
  }

  const handleEditorChange = ({ text }) => {
    setDescription(text);
  };

  const handleEnglishLvlChange = (event) => {
    setEnglishLvl(event.target.value);
  };

  const handleTagInputChange = (event) => {
    setTagInput(event.target.value);
  };

  const handleAddTag = () => {
    if (tagInput.trim() !== '' && !tags.includes(tagInput.trim())) {
      if (validTags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]); 
      } else {
        handleError('Tag is not valid.');
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag) => {
    const updatedTags = tags.filter((t) => t !== tag);
    setTags(updatedTags);
  };

  const toggleTags = () => {
    setShowTags(!showTags);
  };

  if (!isDataLoaded) {
    return (
      <Spinner />
    );
  }

  return (
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
        <FormControl error={!!errors.englishLvl} fullWidth>
          <NativeSelect
            classes={{ root: styles.englishLvl }}
            variant="standard"
            value={englishLvl}
            onChange={handleEnglishLvlChange}
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
          {errors.englishLvl && <FormHelperText>{errors.englishLvl}</FormHelperText>}
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
          <Button onClick={toggleTags} variant="contained">
            {showTags ? 'Hide Valid Tags' : 'Show Valid Tags'}
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
        {showTags && (
          <div className={showTags ? styles.showTags : styles.hideTagList}>
            <List style={{ display: 'flex', flexDirection: 'column' }}>
              {validTags.map((tag, index) => (
                <ListItem key={index}>{tag}</ListItem>
              ))}
            </List>
          </div>
        )}
        <FormControl error={!!errors.description} fullWidth>
          {errors.description && <FormHelperText>{errors.description}</FormHelperText>}
          <MdEditor
            value={description}
            renderHTML={(text) => mdParser.render(text)}
            onChange={handleEditorChange}
            placeholder={description ? undefined : 'Enter description...'}
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
  );
};

const mdParser = new MarkdownIt();

export default CreateUpdateCourse;
