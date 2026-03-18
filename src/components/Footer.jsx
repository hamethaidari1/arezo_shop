import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerTop}>
        <div className={styles.col}>
          <h2 className={styles.logo}>Babona Collection</h2>
          <p className={styles.copyright}>© 2026 Clarity. All rights reserved.</p>
        </div>
        <div className={styles.col}>
          <h3 className={styles.heading}>ABOUT US</h3>
          <ul className={styles.linkList}>
            <li><Link to="#">About us</Link></li>
            <li><Link to="#">Store location</Link></li>
            <li><Link to="#">Contact</Link></li>
            <li><Link to="#">Orders tracking</Link></li>
          </ul>
        </div>
        <div className={styles.col}>
          <h3 className={styles.heading}>USEFUL LINKS</h3>
          <ul className={styles.linkList}>
            <li><Link to="#">Returns</Link></li>
            <li><Link to="#">Support Policy</Link></li>
            <li><Link to="#">Size guide</Link></li>
            <li><Link to="#">FAQs</Link></li>
          </ul>
        </div>
        <div className={styles.col}>
          <h3 className={styles.heading}>FOLLOW US</h3>
          <ul className={styles.linkList}>
            <li><Link to="#">Facebook</Link></li>
            <li><Link to="#">Twitter</Link></li>
            <li><Link to="#">Instagram</Link></li>
            <li><Link to="#">Youtube</Link></li>
          </ul>
        </div>
        <div className={styles.col}>
          <h3 className={styles.heading}>SUBSCRIBE</h3>
          <p className={styles.subscribeText}>Get email updates about our latest shop and special offers.</p>
          <form className={styles.subscribeForm}>
            <input type="email" placeholder="Enter your email" className={styles.input} />
            <button type="button" className={styles.button}>SUBSCRIBE</button>
          </form>
        </div>
      </div>
      <div className={styles.footerBottom}>
        <p>© 2026 Clarity. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
