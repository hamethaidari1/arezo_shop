import React from 'react';
import { Redirect } from 'react-router-dom';
import { auth } from '../firebase/firebase';

const Orders = () => {
  if (!auth.currentUser) return <Redirect to="/" />;
  
  return (
    <div style={{ padding: '100px 20px', textAlign: 'center', minHeight: '60vh' }}>
      <h1>My Orders</h1>
      <p>You have no recent orders.</p>
    </div>
  );
};

export default Orders;
