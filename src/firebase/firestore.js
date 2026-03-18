import { db } from './firebase';
import firebase from 'firebase/app';

export const getProducts = (callback) => {
  return db.collection('products')
    .orderBy('createdAt', 'desc')
    .onSnapshot(snapshot => {
      const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      callback(products);
    });
};

export const getProduct = async (id) => {
  const doc = await db.collection('products').doc(id).get();
  if (doc.exists) {
    return { id: doc.id, ...doc.data() };
  }
  return null;
};

export const addProduct = async (productData) => {
  return await db.collection('products').add({
    ...productData,
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  });
};

export const updateProduct = async (id, productData) => {
  return await db.collection('products').doc(id).update(productData);
};

export const deleteProduct = async (id) => {
  return await db.collection('products').doc(id).delete();
};

export const getUserRole = async (uid) => {
  const doc = await db.collection('users').doc(uid).get();
  if (doc.exists) {
    return doc.data().role;
  }
  return null;
};
