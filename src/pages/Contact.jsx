import React, { useState } from 'react';
import { db } from '../firebase/firebase';
import firebase from 'firebase/app';
import styles from './Contact.module.css';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Sending...');
    try {
      await db.collection('messages').add({
        ...formData,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      setStatus('Message sent successfully! We will get back to you soon.');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      console.error(error);
      setStatus('Error sending message. Please try again.');
    }
  };

  return (
    <div className={styles.contactPage}>
      <div className={styles.hero}>
        <h1>Get in Touch</h1>
      </div>

      <div className={styles.container}>
        <div className={styles.formCol}>
          <h2>Send us a message</h2>
          {status && <p className={styles.statusMsg}>{status}</p>}
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formRow}>
              <input type="text" name="name" placeholder="Name" required value={formData.name} onChange={handleChange} />
              <input type="email" name="email" placeholder="Email" required value={formData.email} onChange={handleChange} />
            </div>
            <input type="text" name="subject" placeholder="Subject" required value={formData.subject} onChange={handleChange} />
            <textarea name="message" placeholder="Your Message" rows="6" required value={formData.message} onChange={handleChange}></textarea>
            <button type="submit" className={styles.submitBtn}>SEND MESSAGE</button>
          </form>
        </div>

        <div className={styles.infoCol}>
          <h2>Contact Info</h2>
          <div className={styles.infoItem}>
            <strong>Address:</strong>
            <p>123 Fashion Street, New York, NY 10001</p>
          </div>
          <div className={styles.infoItem}>
            <strong>Phone:</strong>
            <p>+1 (800) 000-0000</p>
          </div>
          <div className={styles.infoItem}>
            <strong>Email:</strong>
            <p>support@clarity.com</p>
          </div>
          <div className={styles.infoItem}>
            <strong>Hours:</strong>
            <p>Mon-Fri: 9am - 6pm</p>
          </div>

          <div className={styles.mapPlaceholder}>
            Find us here
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
