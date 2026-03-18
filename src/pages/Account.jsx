import React from 'react';
import { Redirect } from 'react-router-dom';
import { auth } from '../firebase/firebase';

const Account = () => {
  if (!auth.currentUser) return <Redirect to="/" />;
  
  return (
    <div style={{ padding: '100px 20px', textAlign: 'center', minHeight: '60vh' }}>
      <h1>My Account</h1>
      <p>Welcome, {auth.currentUser.displayName || auth.currentUser.email}</p>
    </div>
  );
};

export default Account;
