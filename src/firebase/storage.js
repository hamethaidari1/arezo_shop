import { storage } from './firebase';

export const uploadProductImage = async (productId, index, file) => {
  const ref = storage.ref(`products/${productId}/${index}.jpg`);
  const snapshot = await ref.put(file);
  return await snapshot.ref.getDownloadURL();
};

export const deleteProductImages = async (productId) => {
  try {
    const listRef = storage.ref(`products/${productId}`);
    const res = await listRef.listAll();
    const deletePromises = res.items.map(itemRef => itemRef.delete());
    await Promise.all(deletePromises);
  } catch (err) {
    console.error("Error deleting images", err);
  }
};
