import React from 'react';
import styles from './Home.module.scss';

export const Home = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>LingoFusion</h1>
      <main>
        <p className={styles.description}>LingoFusion is a web application for learning English. Our platform offers user-designed, interactive courses to help you improve your skills and achieve your desired language proficiency level.</p>
      </main>
    </div>
  );
};
