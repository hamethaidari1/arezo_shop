import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import styles from './AdminLogin.module.css';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  // If already logged in as admin, redirect
  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const doc = await firebase.firestore().collection('users').doc(user.uid).get();
          if (doc.exists && doc.data().role === 'admin') {
            history.push('/admin/dashboard');
          }
        } catch (e) {}
      }
    });
    return () => unsubscribe();
  }, [history]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Step 1: Sign in with Firebase Auth
      const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
      const user = userCredential.user;

      // Step 2: Check Firestore for admin role
      const userDoc = await firebase.firestore().collection('users').doc(user.uid).get();

      if (!userDoc.exists) {
        await firebase.auth().signOut();
        setError('Access denied. No admin account found for this email.');
        setLoading(false);
        return;
      }

      if (userDoc.data().role !== 'admin') {
        await firebase.auth().signOut();
        setError('Access denied. This account does not have admin privileges.');
        setLoading(false);
        return;
      }

      // Step 3: Success — go to dashboard
      history.push('/admin/dashboard');

    } catch (err) {
      setLoading(false);
      switch (err.code) {
        case 'auth/wrong-password':
          setError('Incorrect password. Please try again.');
          break;
        case 'auth/user-not-found':
          setError('No account found with this email address.');
          break;
        case 'auth/invalid-email':
          setError('Invalid email address format.');
          break;
        case 'auth/too-many-requests':
          setError('Too many failed attempts. Please try again later.');
          break;
        case 'auth/invalid-credential':
          setError('Invalid email or password. Please try again.');
          break;
        default:
          setError('Login failed: ' + err.message);
      }
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.logo}>Clarity.</h1>
        <div className={styles.subtitle}>ADMIN PANEL</div>
        <hr className={styles.divider} />

        <form onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label className={styles.label}>EMAIL ADDRESS</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
              placeholder="admin@clarity.com"
              required
              disabled={loading}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>PASSWORD</label>
            <div className={styles.passwordWrapper}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={styles.input}
                placeholder="Enter your password"
                required
                disabled={loading}
              />
              <button
                type="button"
                className={styles.eyeBtn}
                onClick={() => setShowPassword(!showPassword)}
                tabIndex="-1"
              >
                {showPassword ? '🙈' : '👁'}
              </button>
            </div>
          </div>

          {error && <div className={styles.error}>{error}</div>}

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? 'Signing in...' : 'SIGN IN TO ADMIN'}
          </button>
        </form>

        <a href="/" className={styles.backLink}>← Back to Store</a>
      </div>
    </div>
  );
};

export default AdminLogin;
