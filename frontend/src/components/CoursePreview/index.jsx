import React from 'react';
import { Typography } from '@material-ui/core';
import { Link } from 'react-router-dom';
import styles from './CoursePreview.module.scss';

const CoursePreview = ({ course }) => {
  const { _id, title, englishLvl, rating, imageUrl } = course;

  return (
    <Link to={`/courses/${_id}`} className={styles.courseLink}>
      <div className={styles.coursePreview}>
        <img src={(imageUrl.length !== 0 && imageUrl !== null) ? imageUrl : 'https://expressenglish.ae/wp-content/uploads/2022/02/tips-improve-english.jpg'} alt={"No image"} className={styles.courseImage} />
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
