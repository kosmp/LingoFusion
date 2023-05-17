import React from 'react';
import Button from '@material-ui/core/Button';
import ReactMarkdown from 'react-markdown';
import styles from './CourseTemplate.module.scss';

export const CourseTemplate = () => {
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
      <Button variant="contained" color="primary" className={styles.enrollButton}>Enroll in course</Button>
    </div>
  );
};
