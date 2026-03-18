import React, { useState } from 'react';
import { auth, db } from '../firebase/firebase';
import styles from './AuthModals.module.css';

export const SignInModal = ({ isOpen, onClose, onSwitchToSignUp }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetMsg, setResetMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await auth.signInWithEmailAndPassword(email, password);
      onClose();
    } catch (err) {
      setError('Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgot = async () => {
    if (!email) {
      setError('Please enter your email first.');
      return;
    }
    try {
      await auth.sendPasswordResetEmail(email);
      setResetMsg('Reset email sent!');
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose}>&times;</button>
        <h2>Sign In</h2>
        {error && <div className={styles.error}>{error}</div>}
        {resetMsg && <div className={styles.success}>{resetMsg}</div>}
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <input type="email" placeholder="Email" required value={email} onChange={e => setEmail(e.target.value)} />
          <input type="password" placeholder="Password" required value={password} onChange={e => setPassword(e.target.value)} />
          
          <div className={styles.options}>
            <label><input type="checkbox" /> Remember me</label>
            <button type="button" onClick={handleForgot} className={styles.linkBtn}>Forgot Password?</button>
          </div>
          
          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        
        <p className={styles.switchText}>
          Don't have an account? <button onClick={onSwitchToSignUp} className={styles.linkBtn}>Create one</button>
        </p>
      </div>
    </div>
  );
};

export const SignUpModal = ({ isOpen, onClose, onSwitchToSignIn }) => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return setError("Passwords do not match.");
    }
    if (formData.password.length < 8) {
      return setError("Password must be at least 8 characters.");
    }

    setLoading(true);
    setError('');
    try {
      const { user } = await auth.createUserWithEmailAndPassword(formData.email, formData.password);
      await user.updateProfile({ displayName: formData.name });
      
      await db.collection('users').doc(user.uid).set({
        uid: user.uid,
        email: formData.email,
        displayName: formData.name,
        role: 'user',
        createdAt: new Date(),
        wishlist: [],
        orders: []
      });

      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose}>&times;</button>
        <h2>Create Account</h2>
        {error && <div className={styles.error}>{error}</div>}
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <input type="text" name="name" placeholder="Full Name" required value={formData.name} onChange={handleChange} />
          <input type="email" name="email" placeholder="Email" required value={formData.email} onChange={handleChange} />
          <input type="password" name="password" placeholder="Password (min 8 chars)" required value={formData.password} onChange={handleChange} />
          <input type="password" name="confirmPassword" placeholder="Confirm Password" required value={formData.confirmPassword} onChange={handleChange} />
          
          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? 'Creating...' : 'Sign Up'}
          </button>
        </form>
        
        <p className={styles.switchText}>
          Already have an account? <button onClick={onSwitchToSignIn} className={styles.linkBtn}>Sign in</button>
        </p>
      </div>
    </div>
  );
};
