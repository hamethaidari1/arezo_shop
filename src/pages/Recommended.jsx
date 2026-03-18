import React, { useEffect, useState } from 'react';
import firebase from 'firebase/app';
import 'firebase/firestore';
import ProductCard from '../components/ProductCard';
import styles from './GridPage.module.css';

const Recommended = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [allProductsCount, setAllProductsCount] = useState(0);

  useEffect(() => {
    const unsubscribe = firebase.firestore()
      .collection('products')
      .orderBy('createdAt', 'desc')
      .onSnapshot((snapshot) => {
        const all = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const recommended = all.filter(p => p.isRecommended === true);
        setProducts(recommended.length > 0 ? recommended : all);
        setAllProductsCount(all.length);
        setLoading(false);
      }, error => {
        console.error('Error fetching recommended products:', error);
        setLoading(false);
      });

    return () => unsubscribe();
  }, []);

  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <h1>Recommended Products</h1>
      </div>
      <div className={styles.container}>
        {loading ? (
          <div className={styles.grid}>
            {[...Array(5)].map((_, i) => (
              <div key={`skel-${i}`} className={styles.skeleton}></div>
            ))}
          </div>
        ) : (!loading && allProductsCount === 0) ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>👗</div>
            <h3 className={styles.emptyTitle}>No products yet</h3>
            <p className={styles.emptyText}>Products added from the Admin Panel will appear here.</p>
          </div>
        ) : (
          <div className={styles.grid}>
            {products.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </div>
  );
};

export default Recommended;
