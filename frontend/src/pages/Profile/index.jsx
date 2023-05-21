import React, { useState, useEffect } from 'react';
import { Container, Typography, TextField, Button, FormControl, Select, MenuItem, CircularProgress } from '@material-ui/core';
import Paper from '@mui/material/Paper';

export const Profile = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [englishLvl, setEnglishLvl] = useState('');

  const [isUsernameEditMode, setUsernameEditMode] = useState(false);
  const [isEmailEditMode, setEmailEditMode] = useState(false);
  const [isEnglishLvlEditMode, setEnglishLvlEditMode] = useState(false);

  const [completedCoursesCount, setCompletedCoursesCount] = useState(0);
  const [inProgressCoursesCount, setInProgressCoursesCount] = useState(0);
  const [createdCoursesCount, setCreatedCoursesCount] = useState(0);

  const [isDataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(''); 
      if (response.ok) {
        const data = await response.json();
        setUsername(data.username);
        setEmail(data.email);
        setEnglishLvl(data.englishLvl);
        setCompletedCoursesCount(data.totalUserCountOfCompletedCourses);
        setInProgressCoursesCount(data.totalUserCountInProgressCourses);
        setCreatedCoursesCount(data.totalUserCountOfCreatedCourses);
        setDataLoaded(true);
      } else {
        console.error('Failed to fetch profile data');
      }
    } catch (error) {
      console.error('Error fetching profile data:', error);
    }
  };

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleEnglishLvlChange = (event) => {
    setEnglishLvl(event.target.value);
  };

  const handleUsernameEdit = () => {
    setUsernameEditMode(true);
  };

  const handleEmailEdit = () => {
    setEmailEditMode(true);
  };
  
  const handleEnglishLvlEdit = () => {
    setEnglishLvlEditMode(true);
  };

  const handleUsernameSave = () => {
    setUsernameEditMode(false);
  };

  const handleEmailSave = () => {
    if (validateEmail(email)) {
      setEmailEditMode(false);
    }
  };

  const handleEnglishLvlSave = () => {
    setEnglishLvlEditMode(false);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  if (!isDataLoaded) {
    return (
      <Paper style={{ padding: 30 }}>
        <Container>
          <CircularProgress />
        </Container>
      </Paper>
    );
  }

  return (
    <Paper style={{ padding: 30 }}>
      <Container>
        <Typography variant="h4" component="h1" align="center">
          Profile
        </Typography>

        <div>
          <Typography variant="h6" component="h2">
            Username: {username}
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
            Email: {email}
          </Typography>
          {isEmailEditMode ? (
            <div>
              <TextField
                value={email}
                onChange={handleEmailChange}
                label="Email"
                variant="outlined"
                error={!validateEmail(email)}
                helperText={!validateEmail(email) && 'Invalid email'}
              />
              <Button variant="contained" color="primary" onClick={handleEmailSave}>
                Save
              </Button>
            </div>
          ) : (
            <div>
              <Typography>{email}</Typography>
              <Button variant="contained" color="primary" onClick={handleEmailEdit}>
                Change
              </Button>
            </div>
          )}
        </div>

        <div>
          <Typography variant="h6" component="h2">
            English Level: {englishLvl}
          </Typography>
          {isEnglishLvlEditMode ? (
            <div>
              <FormControl>
                <Select value={englishLvl} onChange={handleEnglishLvlChange} variant="outlined">
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
  );
};
