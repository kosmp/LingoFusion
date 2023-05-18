import ReactMarkdown from 'react-markdown';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import styles from './CourseTemplate.module.scss';

export const CourseTemplate = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedTask, setSelectedTask] = useState('');

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleSelectTask = (task) => {
    setSelectedTask(task);
    setAnchorEl(null);
  };

  const isAuthor = true;
  const isPublic = false;

  const title = 'Course Title';
  const englishLevel = 'A1';
  const tags = ['English', 'Education'];
  const description = `
# Course Description

This course is designed for students who want to improve their English language skills. 
It covers various topics such as grammar, vocabulary, speaking, and listening.

![Course Image](https://cdn-bkikh.nitrocdn.com/vOtJCTyFwWHsZwlSReXcDKCRbYmMlljF/assets/static/optimized/wp-content/uploads/2017/05/f42dd7af890b67f4ac8c5ea8a600117d.url-web-address-300x300.png)

### Key Features:

- Interactive lessons
- Engaging exercises
- Real-life examples

Start your language learning journey with us today!
`;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{title}</h1>
      <p className={styles.englishLevel}>English Level: {englishLevel}</p>
      <div className={styles.tags}>
        {"Tags: "}
        {tags.map((tag) => (
          <span key={tag}>{`#${tag} `}</span>
        ))}
      </div>
      <ReactMarkdown>{description}</ReactMarkdown>
      {isPublic ? (
        <Button variant="contained" color="primary" className={styles.button}>
          Enroll in course
        </Button>
      ) : (
        <>
          {isAuthor ? (
            <>
              <Button variant="contained" color="primary" className={styles.button}>
                Change course
              </Button>
              <Button variant="contained" color="primary" className={styles.button}>
                Delete course
              </Button>
              <Button variant="contained" color="primary" className={styles.button}>
                Open first task
              </Button>
              <Button variant="contained" color="primary" className={styles.button} onClick={handleOpenMenu}>
                Add task to course
              </Button>
              <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleCloseMenu}>
                <MenuItem component={Link} to={`/courseTemplate/:courseId/taskTemplate/createTheory`} onClick={() => handleSelectTask('Theory')}>
                  Theory
                </MenuItem>
                <MenuItem component={Link} to={`/courseTemplate/:courseId/taskTemplate/createTest`} onClick={() => handleSelectTask('Test')}>
                  Test
                </MenuItem>
                <MenuItem component={Link} to={`/courseTemplate/:courseId/taskTemplate/createFillInGaps`} onClick={() => handleSelectTask('FillInGaps')}>
                  Fill in Gaps
                </MenuItem>
              </Menu>
            </>
          ) : (
            <>
            </>
          )}
        </>
      )}
    </div>
  );
};
