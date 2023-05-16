import React from 'react';
import { Container, Typography, Grid } from '@material-ui/core';
import CoursePreview from '../../components/CoursePreview';

import styles from './CourseCatalog.module.scss';

export const CourseCatalog = () => {
  const renderCoursePreviews = (courses) => {
    return courses.map((course) => (
      <Grid item xs={12} sm={6} md={2} key={course.id} className={styles.courseGridItem}>
        <CoursePreview
          title={course.title}
          englishLvl={course.englishLvl}
          rating={course.rating}
          image={course.image}
        />
      </Grid>
    ));
  };

  const publicCourses = [
    { id: 1, title: 'Название курса', englishLvl: 'A2', rating: 4.5, image: 'https://via.placeholder.com/300' },
    { id: 2, title: 'Название курса', englishLvl: 'A2', rating: 4.5, image: 'https://via.placeholder.com/300' },
    { id: 3, title: 'Название курса', englishLvl: 'A2', rating: 4.5, image: 'https://via.placeholder.com/300' },
    { id: 3, title: 'Название курса', englishLvl: 'A2', rating: 4.5, image: 'https://via.placeholder.com/300' },
    { id: 3, title: 'Название курса', englishLvl: 'A2', rating: 4.5, image: 'https://via.placeholder.com/300' }
  ];

  const courseEnrollments = [
    { id: 1, title: 'Название курса', englishLvl: 'B1', rating: 4.2, image: 'https://expressenglish.ae/wp-content/uploads/2022/02/tips-improve-english.jpg' },
    { id: 1, title: 'Название курса', englishLvl: 'B1', rating: 4.2, image: 'https://via.placeholder.com/300' } 
  ];

  return (
    <Container className={styles.root}>
      <Typography variant="h4" component="h1" align="center">
        Catalog of courses
      </Typography>
      <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h5" component="h2">
              Public courses:
            </Typography>
          </Grid>
          {renderCoursePreviews(publicCourses)}
      </Grid>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h5" component="h2">
            Your course enrollments:
          </Typography>
        </Grid>
          {renderCoursePreviews(courseEnrollments)}
      </Grid>
    </Container>
  );
};
