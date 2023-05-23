import React, { useState, useEffect, useContext } from 'react';
import { Container, Typography, TextField, Button, FormControl, Select, MenuItem } from '@material-ui/core';
import Paper from '@mui/material/Paper';
import { Context } from '../../index';
import $api from "../../http/index";
import Spinner from '../../components/Spinner';
import PopUpWindow from '../../components/PopUpWindow';

export const Profile = () => {
  const {store} = useContext(Context);
  const [username, setUsername] = useState('');
  const [englishLvl, setEnglishLvl] = useState('');
  const [inputText, setInputText] = useState('');

  const [isUsernameEditMode, setUsernameEditMode] = useState(false);
  const [isEnglishLvlEditMode, setEnglishLvlEditMode] = useState(false);

  const [completedCoursesCount, setCompletedCoursesCount] = useState(0);
  const [inProgressCoursesCount, setInProgressCoursesCount] = useState(0);
  const [createdCoursesCount, setCreatedCoursesCount] = useState(0);

  const [error, setError] = useState(null);
  const [isDataLoaded, setDataLoaded] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const handleError = (errorMessage) => {
    setError(errorMessage);
  };

  const handleCloseError = () => {
    setError(null);
  };

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
        console.error('Failed to fetch profile data');
      }
    } catch (error) {
      handleError('Error fetching profile data');
      console.error('Error fetching profile data:', error);
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
    let response;
    try {
      setDataLoaded(false);
      response = await $api.put(`/users/${store.user._id}/profile/username`, {inputText});
      setDataLoaded(true);
      if (response.status !== 200) {
        handleError(response.response?.data?.message);
      }

      setUsername(inputText);
    } catch (error) {
      handleError(error.response.data.message + ". " + error.response.data.errors[0].msg);
      setDataLoaded(true);
    } 

    setUsernameEditMode(false);
  };

  const handleEnglishLvlSave = async () => {
    try {
      setDataLoaded(false);
      const response = await $api.put(`/users/${store.user._id}/profile/englishlvl`, {englishLvl});
      setDataLoaded(true);
      if (response.status !== 200) {
        handleError(response.response?.data?.message);
      }
    } catch (error) {
      handleError(error.response.data.message + ". " + error.response.data.errors[0].msg);
      setDataLoaded(true);
    } 

    setEnglishLvlEditMode(false);
  };

  if (!isDataLoaded) {
    return (
      <Spinner />
    );
  }

  return (
    <>
      <Paper style={{ padding: 30 }}>
        <Container>
          <Typography variant="h4" component="h1" align="center">
            Profile
          </Typography>

          <div>
            <Typography variant="h6" component="h2">
              Username:
            </Typography>
            {isUsernameEditMode ? (
              <div>
                <TextField
                  value={username}
                  onChange={handleUsernameChange}
                  label="Username"
                  variant="outlined"
                />
                <Button variant="contained" color="primary" onClick={handleUsernameSave}>
                  Save
                </Button>
              </div>
            ) : (
              <div>
                <Typography>{username}</Typography>
                <Button variant="contained" color="primary" onClick={handleUsernameEdit}>
                  Change
                </Button>
              </div>
           )}
          </div>

          <div>
            <Typography variant="h6" component="h2">
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
                <Button variant="contained" color="primary" onClick={handleEnglishLvlSave}>
                  Save
                </Button>
              </div>
            ) : (
              <div>
                <Typography>{englishLvl}</Typography>
                <Button variant="contained" color="primary" onClick={handleEnglishLvlEdit}>
                  Change
                </Button>
              </div>
            )}
          </div>

          <Typography variant="h4" component="h1" align="center">
            Statistics:
          </Typography> 
          <div>
            <Typography variant="h6" component="h2">
              Completed Courses:
            </Typography>
            <Typography>{completedCoursesCount}</Typography>
          </div>

          <div>
            <Typography variant="h6" component="h2">
              In Progress Courses:
            </Typography>
            <Typography>{inProgressCoursesCount}</Typography>
          </div>

          <div>
            <Typography variant="h6" component="h2">
              Created Courses:
            </Typography>
            <Typography>{createdCoursesCount}</Typography>
          </div>

        </Container>
      </Paper>
      <PopUpWindow error={error} handleCloseError={handleCloseError} />
    </>
  );
};
