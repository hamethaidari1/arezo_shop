import React from 'react';
import { Link } from 'react-router-dom';
import styles from './NotFound.module.css';

const NotFound = () => {
  return (
    <div className={styles.notFoundPage}>
      <h1 className={styles.title}>404</h1>
      <h2 className={styles.subtitle}>Page Not Found</h2>
      <p className={styles.text}>Sorry, but the page you are looking for does not exist, has been removed, name changed or is temporarily unavailable.</p>
      <Link to="/" className={styles.homeBtn}>Go to Home</Link>
    </div>
  );
};

export default NotFound;
