import React from 'react';
import { Typography } from '@material-ui/core';
import { Link } from 'react-router-dom';
import styles from './CoursePreview.module.scss';

const CoursePreview = ({ course }) => {
  const { id, title, englishLvl, rating, image } = course;

  return (
    <Link to={`/courses/${id}`} className={styles.courseLink}>
      <div className={styles.coursePreview}>
        <img src={image} alt={title} className={styles.courseImage} />
        <Typography variant="h6" component="h3" className={styles.courseDetails}>
          {title}
        </Typography>
        <Typography variant="body2" color="textSecondary" className={styles.courseDetails}>
          English Level: {englishLvl}
        </Typography>
        <Typography variant="body2" color="textSecondary" className={styles.courseDetails}>
          Rating: {rating}
        </Typography>
      </div>
    </Link>
  );
};

export default CoursePreview;
