import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createAdminAccount } from '../../firebase/auth';
import styles from './AdminSetup.module.css';

const AdminSetup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus({ type: '', message: '' });
    
    try {
      await createAdminAccount(email, password);
      setStatus({ 
        type: 'success', 
        message: `Admin account created! Email: ${email}` 
      });
      setEmail('');
      setPassword('');
    } catch (err) {
      setStatus({ 
        type: 'error', 
        message: err.message || 'An error occurred creating the admin account.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.setupContainer}>
      <div className={styles.setupCard}>
        <h1 className={styles.title}>Create Admin Account</h1>
        
        {status.message && (
          <div className={`${styles.alert} ${styles[status.type]}`}>
            {status.message}
            {status.type === 'success' && (
              <div className={styles.loginLink}>
                <Link to="/admin/login">Go to Login &rarr;</Link>
              </div>
            )}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label>Email Address</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>
          
          <div className={styles.inputGroup}>
            <label>Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              minLength="6"
            />
          </div>
          
          <button type="submit" className={styles.submitBtn} disabled={isLoading}>
            {isLoading ? 'Creating...' : 'Create Admin'}
          </button>
        </form>
        
        <div className={styles.warning}>
          ⚠️ IMPORTANT: Delete or protect this page (AdminSetup.jsx) in production!
        </div>
      </div>
    </div>
  );
};

export default AdminSetup;
