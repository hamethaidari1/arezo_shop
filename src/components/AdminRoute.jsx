import React, { useState, useEffect } from 'react';
import { Redirect, Route } from 'react-router-dom';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

const AdminRoute = ({ component: Component, ...rest }) => {
  const [status, setStatus] = useState('checking'); // 'checking' | 'admin' | 'denied'

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
      if (!user) {
        setStatus('denied');
        return;
      }
      try {
        const doc = await firebase.firestore().collection('users').doc(user.uid).get();
        if (doc.exists && doc.data().role === 'admin') {
          setStatus('admin');
        } else {
          await firebase.auth().signOut();
          setStatus('denied');
        }
      } catch (e) {
        setStatus('denied');
      }
    });
    return () => unsubscribe();
  }, []);

  if (status === 'checking') {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0a', color: 'white', fontFamily: 'sans-serif' }}>
        Loading...
      </div>
    );
  }

  if (status === 'denied') {
    return <Redirect to="/admin/login" />;
  }

  return (
    <Route
      {...rest}
      render={(props) => <Component {...props} />}
    />
  );
};

export default AdminRoute;
