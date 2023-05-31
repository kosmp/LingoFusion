import React, { useState, useEffect, useContext } from 'react';
import { Container, Typography, TextField, Button, FormControl, Select, MenuItem } from '@material-ui/core';
import Paper from '@mui/material/Paper';
import { Context } from '../../index';
import $api from "../../http/index";
import Spinner from '../../components/Spinner';
import styles from './Profile.module.scss';

export const Profile = ({handleError, handleSuccessfulOperation}) => {
  const {store} = useContext(Context);
  const [username, setUsername] = useState('');
  const [englishLvl, setEnglishLvl] = useState('');
  const [inputText, setInputText] = useState('');

  const [isUsernameEditMode, setUsernameEditMode] = useState(false);
  const [isEnglishLvlEditMode, setEnglishLvlEditMode] = useState(false);

  const [completedCoursesCount, setCompletedCoursesCount] = useState(0);
  const [inProgressCoursesCount, setInProgressCoursesCount] = useState(0);
  const [createdCoursesCount, setCreatedCoursesCount] = useState(0);

  const [isDataLoaded, setDataLoaded] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setDataLoaded(false);
      const response = await $api.get(`/users/${store.user._id}/profile`); 
      if (response.status === 200) {
        const data = await response.data;
        setUsername(data.username);
        setEnglishLvl(data.englishLvl);
        setCompletedCoursesCount(data.statistics.totalUserCountOfCompletedCourses);
        setInProgressCoursesCount(data.statistics.totalUserCountInProgressCourses);
        setCreatedCoursesCount(data.statistics.totalUserCountOfCreatedCourses);
        setDataLoaded(true);
      } else {
        handleError(response?.data?.message);
        setDataLoaded(true);
      }
    } catch (error) {
      handleError('Error fetching profile data');
      setDataLoaded(true);
    }
  };

  const handleUsernameChange = (event) => {
    setInputText(event.target.value);
  };

  const handleEnglishLvlChange = (event) => {
    setEnglishLvl(event.target.value);
  };

  const handleUsernameEdit = () => {
    setUsernameEditMode(true);
  };
  
  const handleEnglishLvlEdit = () => {
    setEnglishLvlEditMode(true);
  };

  const handleUsernameSave = async () => {
    try {
      setDataLoaded(false);
      const response = await $api.put(`/users/${store.user._id}/profile/username`, {username: inputText});
      setDataLoaded(true);
      if (response.status !== 200) {
        handleError(response.response?.data?.message);
        setDataLoaded(true);
      }
      handleSuccessfulOperation();
      setUsername(inputText);
    } catch (error) {
      handleError(error.response.data.message + ". " + error.response.data.errors.map((error) => error.msg).join(" "));
      setDataLoaded(true);
    } finally {
      setUsernameEditMode(false);
    }
  };

  const handleEnglishLvlSave = async () => {
    try {
      setDataLoaded(false);
      const response = await $api.put(`/users/${store.user._id}/profile/englishlvl`, {englishLvl});
      setDataLoaded(true);
      if (response.status !== 200) {
        handleError(response.response?.data?.message);
        setDataLoaded(true);
      }
      handleSuccessfulOperation();
    } catch (error) {
      handleError(error.response.data.message + ". " + error.response.data.errors.map((error) => error.msg).join(" "));
      setDataLoaded(true);
    } finally {
      setEnglishLvlEditMode(false);
    }
  };

  if (!isDataLoaded) {
    return (
      <Spinner />
    );
  }

  return (
      <Paper style={{ padding: 30 }}>
        <Container className={styles.container}>
          <Typography variant="h4" component="h1" align="center" className={styles.title}>
            Profile
          </Typography>

          <div>
            <Typography variant="h6" component="h2" className={styles.field}>
              Username:
            </Typography>
            {isUsernameEditMode ? (
              <div>
                <TextField
                  value={inputText}
                  onChange={handleUsernameChange}
                  label="Username"
                  variant="outlined"
                />
                <Button variant="contained" color="primary" onClick={handleUsernameSave} className={styles.button} >
                  Save
                </Button>
              </div>
            ) : (
              <div>
                <Typography>{username}</Typography>
                <Button variant="contained" color="primary" onClick={handleUsernameEdit} className={styles.button}>
                  Change
                </Button>
              </div>
           )}
          </div>

          <div>
            <Typography variant="h6" component="h2" className={styles.field} >
              English Level:
            </Typography>
            {isEnglishLvlEditMode ? (
              <div>
                <FormControl>
                  <Select onChange={handleEnglishLvlChange} value={englishLvl} variant="outlined">
                    <MenuItem value="A0">A0</MenuItem>
                    <MenuItem value="A1">A1</MenuItem>
                    <MenuItem value="B1">B1</MenuItem>
                    <MenuItem value="B2">B2</MenuItem>
                    <MenuItem value="C1">C1</MenuItem>
                    <MenuItem value="C2">C2</MenuItem>
                  </Select>
                </FormControl>
                <Button variant="contained" color="primary" onClick={handleEnglishLvlSave} className={styles.button}>
                  Save
                </Button>
              </div>
            ) : (
              <div>
                <Typography>{englishLvl}</Typography>
                <Button variant="contained" color="primary" onClick={handleEnglishLvlEdit} className={styles.button}>
                  Change
                </Button>
              </div>
            )}
          </div>

          <Typography variant="h4" component="h1" align="center" className={styles.field}>
            Statistics:
          </Typography> 
          <div>
            <Typography variant="h6" component="h2" className={styles.courseStatisticsField}>
              Completed Courses:
            </Typography>
            <Typography>{completedCoursesCount}</Typography>
          </div>

          <div>
            <Typography variant="h6" component="h2" className={styles.courseStatisticsField}>
              In Progress Courses:
            </Typography>
            <Typography>{inProgressCoursesCount}</Typography>
          </div>

          <div>
            <Typography variant="h6" component="h2" className={styles.courseStatisticsField}>
              Created Courses:
            </Typography>
            <Typography>{createdCoursesCount}</Typography>
          </div>

        </Container>
      </Paper>
  );
};
