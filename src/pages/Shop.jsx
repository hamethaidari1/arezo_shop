import React, { useState, useEffect } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import firebase from 'firebase/app';
import 'firebase/firestore';
import ProductCard from '../components/ProductCard';
import styles from './Shop.module.css';

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const Shop = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('Newest First');
  const [visibleCount, setVisibleCount] = useState(12);

  const query = useQuery();
  const categoryParam = query.get('category') || 'All';
  const history = useHistory();

  const categories = ['All', 'Men', 'Women', 'Kids', 'Accessories', 'Eyewear'];
  const sortOptions = ['Newest First', 'Price: Low to High', 'Price: High to Low', 'Name: A-Z'];

  useEffect(() => {
    const unsubscribe = firebase.firestore()
      .collection('products')
      .orderBy('createdAt', 'desc')
      .onSnapshot(
        (snapshot) => {
          const data = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          console.log('Shop products:', data.length);
          setAllProducts(data);
          setLoading(false);
        },
        (error) => {
          console.error('Shop fetch error:', error);
          setLoading(false);
        }
      );
    return () => unsubscribe();
  }, []);

  const handleCategoryChange = (cat) => {
    setVisibleCount(12);
    if (cat === 'All') {
      history.push('/shop');
    } else {
      history.push(`/shop?category=${cat}`);
    }
  };

  const filteredProducts = allProducts.filter(p => {
    const matchCategory = categoryParam === 'All' || p.category === categoryParam;
    const matchSearch = !search || 
                        (p.name && p.name.toLowerCase().includes(search.toLowerCase())) || 
                        (p.brand && p.brand.toLowerCase().includes(search.toLowerCase()));
    return matchCategory && matchSearch;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sort === 'Price: Low to High') return Number(a.price) - Number(b.price);
    if (sort === 'Price: High to Low') return Number(b.price) - Number(a.price);
    if (sort === 'Name: A-Z') return (a.name || '').localeCompare(b.name || '');
    // Newest First
    const tA = a.createdAt?.toMillis ? a.createdAt.toMillis() : (a.createdAt || 0);
    const tB = b.createdAt?.toMillis ? b.createdAt.toMillis() : (b.createdAt || 0);
    return tB - tA;
  });

  const displayedProducts = sortedProducts.slice(0, visibleCount);

  return (
    <div className={styles.shop}>
      <div className={styles.header}>
        <div className={styles.filters}>
          {categories.map(cat => (
            <button 
              key={cat} 
              className={`${styles.chip} ${categoryParam === cat ? styles.activeChip : ''}`}
              onClick={() => handleCategoryChange(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className={styles.controls}>
          <input 
            type="text" 
            placeholder="Search products..." 
            value={search}
            onChange={e => { setSearch(e.target.value); setVisibleCount(12); }}
            className={styles.search}
          />
          <select 
            value={sort} 
            onChange={(e) => setSort(e.target.value)} 
            className={styles.sortSelect}
          >
            {sortOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        </div>
      </div>

      <div className={styles.productCount}>
        {loading ? 'Loading products...' : `Showing ${displayedProducts.length} of ${filteredProducts.length} products`}
      </div>

      {loading ? (
        <div className={styles.productsGrid}>
          {[...Array(5)].map((_, i) => (
            <div key={`skel-${i}`} className={styles.skeleton}></div>
          ))}
        </div>
      ) : allProducts.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>👗</div>
          <h3 className={styles.emptyTitle}>No products yet</h3>
          <p className={styles.emptyText}>Products added from the Admin Panel will appear here.</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className={styles.noProducts}>No products found for "{search}".</div>
      ) : (
        <div className={styles.productsGrid}>
          {displayedProducts.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      )}

      {!loading && visibleCount < filteredProducts.length && (
        <div className={styles.loadMoreContainer}>
          <button 
            className={styles.loadMoreBtn} 
            onClick={() => setVisibleCount(prev => prev + 12)}
          >
            Show More
          </button>
        </div>
      )}

      {!loading && visibleCount >= filteredProducts.length && filteredProducts.length > 0 && (
        <div className={styles.allShown}>
          Showing all {filteredProducts.length} products
        </div>
      )}
    </div>
  );
};

export default Shop;
