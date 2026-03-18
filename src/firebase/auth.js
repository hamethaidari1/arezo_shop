import firebase from 'firebase/app';
import { auth, db } from './firebase';

export const signInAdmin = async (email, password) => {
  return await auth.signInWithEmailAndPassword(email, password);
};

export const signOutAdmin = async () => {
  return await auth.signOut();
};

export const getCurrentUser = () => {
  return auth.currentUser;
};

// --- NEW ADMIN FUNCTIONS (Adapted for Firebase v8) ---

export async function createAdminAccount(email, password) {
  const userCredential = await auth.createUserWithEmailAndPassword(email, password);
  const uid = userCredential.user.uid;
  await db.collection("users").doc(uid).set({
    uid,
    email,
    role: "admin",
    displayName: "Admin",
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  });
  return userCredential.user;
}

export async function adminLogin(email, password) {
  const userCredential = await auth.signInWithEmailAndPassword(email, password);
  const userDoc = await db.collection("users").doc(userCredential.user.uid).get();
  
  if (!userDoc.exists || userDoc.data().role !== "admin") {
    await auth.signOut();
    throw new Error("Access denied. Admin privileges required.");
  }
  return userCredential.user;
}

export async function adminLogout() {
  await auth.signOut();
}

export async function checkAdminRole(uid) {
  const userDoc = await db.collection("users").doc(uid).get();
  return userDoc.exists && userDoc.data().role === "admin";
}
