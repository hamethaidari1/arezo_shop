import firebase from 'firebase/app';
import { db, storage } from './firebase';

export async function uploadProductImage(file, productId, index, onProgress) {
  const storageRef = storage.ref(`products/${productId}/${index}.jpg`);
  return new Promise((resolve, reject) => {
    const uploadTask = storageRef.put(file);
    uploadTask.on('state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        if (onProgress) onProgress(progress);
      },
      reject,
      async () => {
        const url = await uploadTask.snapshot.ref.getDownloadURL();
        resolve(url);
      }
    );
  });
}

export async function addProduct(productData, imageFiles, onProgress) {
  // 1. Create Firestore doc first to get ID
  const docRef = await db.collection("products").add({
    ...productData,
    images: [],
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  });
  
  // 2. Upload all images using the doc ID
  const imageUrls = [];
  for (let i = 0; i < imageFiles.length; i++) {
    const url = await uploadProductImage(imageFiles[i], docRef.id, i + 1, (p) => {
      if (onProgress) onProgress(i, p);
    });
    imageUrls.push(url);
  }
  
  // 3. Update the doc with image URLs
  await docRef.update({ images: imageUrls });
  return docRef.id;
}

export async function updateProduct(productId, productData, newImageFiles, existingImageUrls, onProgress) {
  const imageUrls = [...existingImageUrls];
  
  for (let i = 0; i < newImageFiles.length; i++) {
    const url = await uploadProductImage(newImageFiles[i], productId, Date.now() + i, (p) => {
      if (onProgress) onProgress(p);
    });
    imageUrls.push(url);
  }
  
  await db.collection("products").doc(productId).update({ 
    ...productData, 
    images: imageUrls,
    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
  });
}

export async function deleteProduct(productId, imageUrls) {
  // Delete all storage files
  for (const url of imageUrls) {
    try {
      const imageRef = storage.refFromURL(url);
      await imageRef.delete();
    } catch (e) { 
      console.warn("Could not delete image, might already be removed.", e);
    }
  }
  // Delete doc
  await db.collection("products").doc(productId).delete();
}

export function subscribeToProducts(callback) {
  return db.collection("products").orderBy("createdAt", "desc").onSnapshot((snapshot) => {
    const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(products);
  });
}
