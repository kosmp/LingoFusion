import React, { useState } from 'react';
import { Container, Typography, TextField, Grid, FormControl, NativeSelect, Button } from '@material-ui/core';
import CoursePreview from '../../components/CoursePreview';

import styles from './CourseCatalog.module.scss';

export const CourseCatalog = () => {
  const [rating, setRating] = useState('');
  const [englishLvl, setEnglishLvl] = useState('');
  const [publicVisibleCourseCount, setPublicVisibleCourseCount] = useState(8);
  const [enrollmentVisibleCourseCount, setEnrollmentVisibleCourseCount] = useState(8);
  const [createdVisibleCourseCount, setCreatedVisibleCourseCount] = useState(8);

  const handleRatingChange = (event) => {
    setRating(event.target.value);
  };

  const handleEnglishLvlChange = (event) => {
    setEnglishLvl(event.target.value);
  };

  const handlePublicShowMore = () => {
    setPublicVisibleCourseCount((prevCount) => prevCount + 8);
  };

  const handleEnrollmentShowMore = () => {
    setEnrollmentVisibleCourseCount((prevCount) => prevCount + 8);
  };

  const handleCreatedShowMore = () => {
    setCreatedVisibleCourseCount((prevCount) => prevCount + 8);
  };

  const renderCoursePreviews = (courses, visibleCourseCount) => {
    return courses.slice(0, visibleCourseCount).map((course) => (
      <Grid item xs={12} sm={6} md={4} lg={3} key={course.id}>
        <CoursePreview course={course} />
      </Grid>
    ));
  };

  const publicCourses = [
    { id: 1, title: 'Название курса', englishLvl: 'A2', rating: 4.5, image: 'https://expressenglish.ae/wp-content/uploads/2022/02/tips-improve-english.jpg' },
    { id: 2, title: 'Название курса', englishLvl: 'A2', rating: 4.5, image: 'https://expressenglish.ae/wp-content/uploads/2022/02/tips-improve-english.jpg' },
    { id: 3, title: 'Название курса', englishLvl: 'A2', rating: 4.5, image: 'https://expressenglish.ae/wp-content/uploads/2022/02/tips-improve-english.jpg' },
    { id: 4, title: 'Название курса', englishLvl: 'A2', rating: 4.5, image: 'https://expressenglish.ae/wp-content/uploads/2022/02/tips-improve-english.jpg' },
    { id: 5, title: 'Название курса', englishLvl: 'A2', rating: 4.5, image: 'https://expressenglish.ae/wp-content/uploads/2022/02/tips-improve-english.jpg' },
    { id: 6, title: 'Название курса', englishLvl: 'A2', rating: 4.5, image: 'https://expressenglish.ae/wp-content/uploads/2022/02/tips-improve-english.jpg' },
    { id: 7, title: 'Название курса', englishLvl: 'A2', rating: 4.5, image: 'https://expressenglish.ae/wp-content/uploads/2022/02/tips-improve-english.jpg' },
    { id: 8, title: 'Название курса', englishLvl: 'A2', rating: 4.5, image: 'https://expressenglish.ae/wp-content/uploads/2022/02/tips-improve-english.jpg' },
    { id: 9, title: 'Название курса', englishLvl: 'A2', rating: 4.5, image: 'https://expressenglish.ae/wp-content/uploads/2022/02/tips-improve-english.jpg' },
    { id: 10, title: 'Название курса', englishLvl: 'A2', rating: 4.5, image: 'https://expressenglish.ae/wp-content/uploads/2022/02/tips-improve-english.jpg' },
    { id: 11, title: 'Название курса', englishLvl: 'A2', rating: 4.5, image: 'https://expressenglish.ae/wp-content/uploads/2022/02/tips-improve-english.jpg' },
    { id: 12, title: 'Название курса', englishLvl: 'A2', rating: 4.5, image: 'https://expressenglish.ae/wp-content/uploads/2022/02/tips-improve-english.jpg' },
    { id: 13, title: 'Название курса', englishLvl: 'A2', rating: 4.5, image: 'https://expressenglish.ae/wp-content/uploads/2022/02/tips-improve-english.jpg' },
    { id: 14, title: 'Название курса', englishLvl: 'A2', rating: 4.5, image: 'https://expressenglish.ae/wp-content/uploads/2022/02/tips-improve-english.jpg' },
    { id: 15, title: 'Название курса', englishLvl: 'A2', rating: 4.5, image: 'https://expressenglish.ae/wp-content/uploads/2022/02/tips-improve-english.jpg' },
    { id: 16, title: 'Название курса', englishLvl: 'A2', rating: 4.5, image: 'https://expressenglish.ae/wp-content/uploads/2022/02/tips-improve-english.jpg' },
    { id: 17, title: 'Тестовый курс', englishLvl: 'A2', rating: 4.5, image: 'https://expressenglish.ae/wp-content/uploads/2022/02/tips-improve-english.jpg' }
  ];

  const courseEnrollments = [
    { id: 1, title: 'Название курса', englishLvl: 'B1', rating: 4.2, image: 'https://expressenglish.ae/wp-content/uploads/2022/02/tips-improve-english.jpg' },
    { id: 2, title: 'Название курса', englishLvl: 'B1', rating: 4.2, image: 'https://expressenglish.ae/wp-content/uploads/2022/02/tips-improve-english.jpg' },
    { id: 3, title: 'Название курса', englishLvl: 'B1', rating: 4.2, image: 'https://expressenglish.ae/wp-content/uploads/2022/02/tips-improve-english.jpg' },
    { id: 4, title: 'Название курса', englishLvl: 'B1', rating: 4.2, image: 'https://expressenglish.ae/wp-content/uploads/2022/02/tips-improve-english.jpg' },
    { id: 5, title: 'Название курса', englishLvl: 'B1', rating: 4.2, image: 'https://expressenglish.ae/wp-content/uploads/2022/02/tips-improve-english.jpg' },
  ];

  const createdCourses = [
    { id: 1, title: 'English times', englishLvl: 'B1', rating: 4.2, image: 'https://expressenglish.ae/wp-content/uploads/2022/02/tips-improve-english.jpg' },
    { id: 2, title: 'English times', englishLvl: 'B1', rating: 4.2, image: 'https://expressenglish.ae/wp-content/uploads/2022/02/tips-improve-english.jpg' },
    { id: 3, title: 'English times', englishLvl: 'B1', rating: 4.2, image: 'https://expressenglish.ae/wp-content/uploads/2022/02/tips-improve-english.jpg' },
    { id: 4, title: 'English times', englishLvl: 'B1', rating: 4.2, image: 'https://expressenglish.ae/wp-content/uploads/2022/02/tips-improve-english.jpg' },
    { id: 5, title: 'English times', englishLvl: 'B1', rating: 4.2, image: 'https://expressenglish.ae/wp-content/uploads/2022/02/tips-improve-english.jpg' },
  ];

  return (
    <Container className={styles.root}>
      <Typography variant="h4" component="h1" align="center">
        Catalog of courses
      </Typography>

      <div className={styles.filterContainer}>
        <Typography variant="h5" component="h2" className={styles.typography}>
          Public courses:
        </Typography>
        <div className={styles.filterControls}>
          <TextField label="Find by tag" variant="outlined" size="small" className={styles.filterInput} />
          <FormControl className={styles.filterSelect}>
            <NativeSelect value={englishLvl} onChange={handleEnglishLvlChange}>
              <option value="" disabled>
                EngLvl
              </option>
              <option value="A0">A0</option>
              <option value="A1">A1</option>
              <option value="A2">A2</option>
              <option value="B1">B1</option>
              <option value="B2">B2</option>
              <option value="C1">C1</option>
              <option value="C2">C2</option>
            </NativeSelect>
          </FormControl>
          <FormControl className={styles.filterSelect}>
            <NativeSelect value={rating} onChange={handleRatingChange}>
              <option value="" disabled>
                Rating
              </option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </NativeSelect>
          </FormControl>
        </div>
      </div>

      <Grid container spacing={3} className={styles.courseContainer}>
        {renderCoursePreviews(publicCourses, publicVisibleCourseCount)}
      </Grid>
      {publicVisibleCourseCount < publicCourses.length && (
        <Button variant="contained" color="default" onClick={handlePublicShowMore} className={styles.showMoreButton}>
          Show More
        </Button>
      )}

      <Grid container spacing={3} className={styles.courseContainer}>
        <Grid item xs={12}>
          <Typography variant="h5" component="h2" className={styles.typography}>
            Your course enrollments:
          </Typography>
        </Grid>
        {renderCoursePreviews(courseEnrollments, enrollmentVisibleCourseCount)}
      </Grid>
      {enrollmentVisibleCourseCount < courseEnrollments.length && (
        <Button variant="contained" color="default" onClick={handleEnrollmentShowMore} className={styles.showMoreButton}>
          Show More
        </Button>
      )}

      <Grid container spacing={3} className={styles.courseContainer}>
        <Grid item xs={12}>
          <Typography variant="h5" component="h2" className={styles.typography}>
            Your created courses:
          </Typography>
        </Grid>
        {renderCoursePreviews(createdCourses, createdVisibleCourseCount)}
      </Grid>
      {createdVisibleCourseCount < createdCourses.length && (
        <Button variant="contained" color="default" onClick={handleCreatedShowMore} className={styles.showMoreButton}>
          Show More
        </Button>
      )}
    </Container>
  );
};
