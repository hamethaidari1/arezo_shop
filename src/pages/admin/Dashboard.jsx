import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { subscribeToProducts, deleteProduct } from '../../firebase/products';
import AdminLayout from '../../layouts/AdminLayout';
import styles from './Dashboard.module.css';

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    featured: 0,
    recommended: 0,
    collections: 0
  });

  useEffect(() => {
    const unsubscribe = subscribeToProducts((productsData) => {
      setProducts(productsData);
      
      const brands = new Set();
      let featured = 0;
      let recommended = 0;
      
      productsData.forEach(p => {
        if (p.brand) brands.add(p.brand);
        if (p.isFeatured) featured++;
        if (p.isRecommended) recommended++;
      });
      
      setStats({
        total: productsData.length,
        featured,
        recommended,
        collections: brands.size
      });
    });

    return () => unsubscribe();
  }, []);

  const handleDelete = async (product) => {
    if (window.confirm(`Delete '${product.name}'? This cannot be undone.`)) {
      try {
        await deleteProduct(product.id, product.images || []);
      } catch (err) {
        alert("Failed to delete product: " + err.message);
      }
    }
  };

  const recentProducts = products.slice(0, 5);

  return (
    <AdminLayout title="Dashboard">
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{stats.total}</div>
          <div className={styles.statLabel}>TOTAL PRODUCTS</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{stats.featured}</div>
          <div className={styles.statLabel}>FEATURED</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{stats.recommended}</div>
          <div className={styles.statLabel}>RECOMMENDED</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{stats.collections}</div>
          <div className={styles.statLabel}>COLLECTIONS</div>
        </div>
      </div>

      <div className={styles.actionsRow}>
        <Link to="/admin/add-product" className={styles.addBtn}>Add New Product</Link>
        <Link to="/admin/products" className={styles.viewBtn}>View All Products</Link>
      </div>

      <div className={styles.tableContainer}>
        <h2 className={styles.tableHeading}>Recently Added Products</h2>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Brand</th>
                <th>Category</th>
                <th>Price</th>
                <th>Badges</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {recentProducts.length > 0 ? (
                recentProducts.map(product => (
                  <tr key={product.id}>
                    <td>
                      <div className={styles.thumbnail}>
                        {product.images?.[0] ? (
                          <img src={product.images[0]} alt={product.name} />
                        ) : (
                          <span>{product.name?.charAt(0) || 'P'}</span>
                        )}
                      </div>
                    </td>
                    <td className={styles.boldCell}>{product.name}</td>
                    <td className={styles.mutedCell}>{product.brand}</td>
                    <td>{product.category}</td>
                    <td className={styles.priceCell}>${Number(product.price).toFixed(2)}</td>
                    <td>
                      <div className={styles.badgesWrapper}>
                        {product.isFeatured && <span className={`${styles.badge} ${styles.badgeFeatured}`}>Featured</span>}
                        {product.isRecommended && <span className={`${styles.badge} ${styles.badgeRecommended}`}>Recommended</span>}
                      </div>
                    </td>
                    <td>
                      <div className={styles.actionButtons}>
                        <Link to={`/admin/edit/${product.id}`} className={styles.editBtn} title="Edit">
                          ✏️
                        </Link>
                        <button className={styles.deleteBtn} onClick={() => handleDelete(product)} title="Delete">
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className={styles.emptyTable}>No products found. Start by adding one!</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
