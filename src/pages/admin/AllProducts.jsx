import React, { useState, useEffect, useRef } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import { subscribeToProducts, deleteProduct, updateProduct } from '../../firebase/products';
import styles from './AllProducts.module.css';

const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  
  // Filters & Sorting
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const [sortBy, setSortBy] = useState('newest');

  // Edit Modal State
  const [editingProduct, setEditingProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeToProducts((data) => {
      setProducts(data);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    let result = [...products];

    // 1. Tab Filter
    if (activeTab !== 'All') {
      result = result.filter(p => p.category === activeTab);
    }

    // 2. Search Filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(p => 
        (p.name && p.name.toLowerCase().includes(term)) || 
        (p.brand && p.brand.toLowerCase().includes(term))
      );
    }

    // 3. Sort
    result.sort((a, b) => {
      const dateA = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
      const dateB = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
      
      if (sortBy === 'newest') return dateB - dateA;
      if (sortBy === 'oldest') return dateA - dateB;
      if (sortBy === 'price_asc') return Number(a.price) - Number(b.price);
      if (sortBy === 'price_desc') return Number(b.price) - Number(a.price);
      return 0;
    });

    setFilteredProducts(result);
  }, [products, searchTerm, activeTab, sortBy]);

  const handleDelete = async (product) => {
    if (window.confirm(`Delete '${product.name}'? This cannot be undone.`)) {
      try {
        await deleteProduct(product.id, product.images || []);
      } catch (err) {
        alert("Delete failed: " + err.message);
      }
    }
  };

  const openEditModal = (product) => {
    setEditingProduct({ ...product });
    setIsModalOpen(true);
  };

  return (
    <AdminLayout title="All Products">
      <div className={styles.container}>
        {/* Controls Bar */}
        <div className={styles.controlsBar}>
          <div className={styles.searchBox}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <input 
              type="text" 
              placeholder="Search products by name or brand..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className={styles.sortBox}>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className={styles.filterTabs}>
          {['All', 'Men', 'Women', 'Kids', 'Accessories', 'Eyewear'].map(tab => (
            <button 
              key={tab}
              className={`${styles.tabBtn} ${activeTab === tab ? styles.activeTab : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Products Table */}
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Brand</th>
                <th>Category</th>
                <th>Price</th>
                <th>Discount</th>
                <th>Badges</th>
                <th>Date Added</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length > 0 ? (
                filteredProducts.map(product => (
                  <tr key={product.id}>
                    <td>
                      <div className={styles.thumbnail}>
                        {product.images?.[0] ? <img src={product.images[0]} alt="" /> : 'P'}
                      </div>
                    </td>
                    <td className={styles.boldCell}>{product.name}</td>
                    <td className={styles.mutedCell}>{product.brand}</td>
                    <td>{product.category}</td>
                    <td className={styles.priceCell}>${Number(product.price).toFixed(2)}</td>
                    <td className={styles.discountCell}>
                      {product.originalPrice && Number(product.originalPrice) > Number(product.price) 
                        ? `${Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%` 
                        : '-'}
                    </td>
                    <td>
                      <div className={styles.badgesWrapper}>
                        {product.isFeatured && <span className={`${styles.badge} ${styles.badgeFeatured}`}>F</span>}
                        {product.isRecommended && <span className={`${styles.badge} ${styles.badgeRecommended}`}>R</span>}
                      </div>
                    </td>
                    <td className={styles.mutedCell}>
                      {product.createdAt?.toDate ? product.createdAt.toDate().toLocaleDateString() : 'New'}
                    </td>
                    <td>
                      <div className={styles.actionButtons}>
                        <button className={styles.editBtn} onClick={() => openEditModal(product)} title="Edit">✏️</button>
                        <button className={styles.deleteBtn} onClick={() => handleDelete(product)} title="Delete">🗑️</button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className={styles.emptyTable}>No products found matching your criteria.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && editingProduct && (
        <EditProductModal 
          product={editingProduct} 
          onClose={() => setIsModalOpen(false)} 
        />
      )}
    </AdminLayout>
  );
};

// --- EDIT MODAL COMPONENT ---
const EditProductModal = ({ product, onClose }) => {
  const [formData, setFormData] = useState({
    name: product.name || '',
    brand: product.brand || '',
    category: product.category || '',
    price: product.price || '',
    originalPrice: product.originalPrice || '',
    isFeatured: product.isFeatured || false,
    isRecommended: product.isRecommended || false,
    description: product.description || ''
  });

  const existingImages = product.images || [];
  // Slot state can be either a URL string (existing) or a File object (new)
  const [images, setImages] = useState([
    existingImages[0] || null,
    existingImages[1] || null,
    existingImages[2] || null,
    existingImages[3] || null
  ]);
  const [imagePreviews, setImagePreviews] = useState([...images]);
  const fileInputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];
  
  const [uploadStatus, setUploadStatus] = useState({ state: 'idle', progress: 0, text: '' });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleImageChange = (index, e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const newImages = [...images];
    newImages[index] = file;
    setImages(newImages);

    const reader = new FileReader();
    reader.onloadend = () => {
      const newPreviews = [...imagePreviews];
      newPreviews[index] = reader.result;
      setImagePreviews(newPreviews);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = (index, e) => {
    e.stopPropagation();
    const newImages = [...images];
    newImages[index] = null;
    setImages(newImages);

    const newPreviews = [...imagePreviews];
    newPreviews[index] = null;
    setImagePreviews(newPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploadStatus({ state: 'uploading', progress: 0, text: 'Preparing updates...' });

    try {
      // Split images into new (Files) and existing (URLs)
      const newImageFiles = [];
      const updatedExistingUrls = [];
      
      images.forEach(img => {
        if (img instanceof File) newImageFiles.push(img);
        else if (typeof img === 'string') updatedExistingUrls.push(img);
      });

      const productDataToSave = {
        name: formData.name,
        nameLower: formData.name.toLowerCase(),
        brand: formData.brand,
        brandLower: formData.brand.toLowerCase(),
        category: formData.category,
        price: Number(formData.price),
        originalPrice: formData.originalPrice ? Number(formData.originalPrice) : null,
        isFeatured: formData.isFeatured,
        isRecommended: formData.isRecommended,
        description: formData.description
      };

      await updateProduct(product.id, productDataToSave, newImageFiles, updatedExistingUrls, (progress) => {
        setUploadStatus({ state: 'uploading', progress, text: `Uploading new images...` });
      });

      setUploadStatus({ state: 'success', progress: 100, text: 'Product updated!' });
      setTimeout(onClose, 1000);
    } catch (err) {
      alert("Update failed: " + err.message);
      setUploadStatus({ state: 'idle', progress: 0, text: '' });
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>Edit Product</h2>
          <button className={styles.closeBtn} onClick={onClose}>×</button>
        </div>
        
        <form onSubmit={handleSubmit} className={styles.modalForm}>
          <div className={styles.fieldRow}>
            <div className={styles.fieldGroup} style={{ flex: 1 }}>
              <label>Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleInputChange} required />
            </div>
            <div className={styles.fieldGroup} style={{ flex: 1 }}>
              <label>Brand</label>
              <input type="text" name="brand" value={formData.brand} onChange={handleInputChange} required />
            </div>
          </div>
          
          <div className={styles.fieldRow}>
            <div className={styles.fieldGroup} style={{ flex: 1 }}>
              <label>Price</label>
              <input type="number" name="price" value={formData.price} onChange={handleInputChange} step="0.01" required />
            </div>
            <div className={styles.fieldGroup} style={{ flex: 1 }}>
              <label>Category</label>
              <select name="category" value={formData.category} onChange={handleInputChange} required>
                <option value="Men">Men</option>
                <option value="Women">Women</option>
                <option value="Kids">Kids</option>
                <option value="Accessories">Accessories</option>
                <option value="Eyewear">Eyewear</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className={styles.imageGrid}>
            {[0, 1, 2, 3].map((index) => (
              <div 
                key={index} 
                className={`${styles.imageSlot} ${imagePreviews[index] ? styles.filled : styles.empty}`}
                onClick={() => fileInputRefs[index].current.click()}
              >
                <input type="file" ref={fileInputRefs[index]} onChange={(e) => handleImageChange(index, e)} accept="image/jpeg, image/png, image/webp" hidden />
                {imagePreviews[index] ? (
                  <>
                    <img src={imagePreviews[index]} alt="" />
                    <button type="button" className={styles.removeImageBtn} onClick={(e) => removeImage(index, e)}>×</button>
                  </>
                ) : (
                  <span style={{color: '#999', fontSize: '12px'}}>Slot {index + 1}</span>
                )}
              </div>
            ))}
          </div>

          <div className={styles.modalFooter}>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>Cancel</button>
            <button type="submit" className={styles.updateBtn} disabled={uploadStatus.state === 'uploading'}>
              {uploadStatus.state === 'uploading' ? uploadStatus.text : 'Update Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AllProducts;
