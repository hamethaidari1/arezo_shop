import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../layouts/AdminLayout';
import { addProduct } from '../../firebase/products';
import styles from './AddProduct.module.css';

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

const AddProduct = () => {
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    category: '',
    price: '',
    originalPrice: '',
    isFeatured: false,
    isRecommended: false,
    description: ''
  });

  const [images, setImages] = useState([null, null, null, null]);
  const [imagePreviews, setImagePreviews] = useState([null, null, null, null]);
  const fileInputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

  const [errors, setErrors] = useState({});
  const [uploadStatus, setUploadStatus] = useState({ state: 'idle', progress: 0, text: '' }); // idle, uploading, success, error
  const [globalError, setGlobalError] = useState('');

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const handleImageClick = (index) => {
    fileInputRefs[index].current.click();
  };

  const handleImageChange = (index, e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      alert("Invalid file type. Use JPG, PNG, or WEBP.");
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      alert("Image too large. Max 5MB.");
      return;
    }

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

    if (errors.images) setErrors(prev => ({ ...prev, images: null }));
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

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Product Name is required";
    if (!formData.brand.trim()) newErrors.brand = "Brand is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.price || isNaN(formData.price) || Number(formData.price) <= 0) {
      newErrors.price = "Valid price is required";
    }
    if (!images[0]) newErrors.images = "Main image (Slot 1) is required";

    setErrors(newErrors);
    
    // Scroll to first error
    if (Object.keys(newErrors).length > 0) {
      const firstErrorKey = Object.keys(newErrors)[0];
      const element = document.getElementsByName(firstErrorKey)[0] || document.getElementById('images-section');
      if (element) element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setUploadStatus({ state: 'uploading', progress: 0, text: 'Preparing...' });
    setGlobalError('');

    try {
      // Filter out empty slots
      const activeImages = images.filter(img => img !== null);
      
      const productDataToSave = {
        name: formData.name,
        nameLower: formData.name.toLowerCase(),
        brand: formData.brand,
        brandLower: formData.brand.toLowerCase(),
        category: formData.category,
        price: Number(formData.price),
        originalPrice: formData.originalPrice ? Number(formData.originalPrice) : null,
        isFeatured: Boolean(formData.isFeatured),
        isRecommended: Boolean(formData.isRecommended),
        description: formData.description
      };

      await addProduct(productDataToSave, activeImages, (imgIndex, progress) => {
        setUploadStatus({ 
          state: 'uploading', 
          progress, 
          text: `Uploading images... (${imgIndex + 1}/${activeImages.length})` 
        });
      });

      setUploadStatus({ state: 'success', progress: 100, text: 'Done!' });
    } catch (err) {
      console.error(err);
      setGlobalError("Upload failed. Check your internet connection or permissions.");
      setUploadStatus({ state: 'error', progress: 0, text: '' });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '', brand: '', category: '', price: '', originalPrice: '',
      isFeatured: false, isRecommended: false, description: ''
    });
    setImages([null, null, null, null]);
    setImagePreviews([null, null, null, null]);
    setUploadStatus({ state: 'idle', progress: 0, text: '' });
  };

  // Calculate discount
  let discountText = null;
  if (formData.price && formData.originalPrice) {
    const p = Number(formData.price);
    const op = Number(formData.originalPrice);
    if (op > p && p > 0) {
      const discount = Math.round(((op - p) / op) * 100);
      discountText = `Discount: ${discount}%`;
    }
  }

  if (uploadStatus.state === 'success') {
    return (
      <AdminLayout title="Add Product">
        <div className={styles.successCard}>
          <div className={styles.successIcon}>✓</div>
          <h2>Product Added Successfully!</h2>
          <p>{formData.name} - ${formData.price}</p>
          <div className={styles.successActions}>
            <button onClick={resetForm} className={styles.addAnotherBtn}>Add Another Product</button>
            <Link to="/admin/products" className={styles.viewAllBtn}>View All Products</Link>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Add Product">
      <div className={styles.formContainer}>
        <div className={styles.header}>
          <h2>Add New Product</h2>
          <p>Fill in the details below to add a product to your store</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {/* BASIC INFO */}
          <div className={styles.section}>
            <h3>Basic Info</h3>
            
            <div className={styles.fieldRow}>
              <div className={`${styles.fieldGroup} ${styles.fullWidth}`}>
                <label>Product Name *</label>
                <input 
                  type="text" 
                  name="name" 
                  placeholder="e.g. Classic Oxford Shirt" 
                  value={formData.name}
                  onChange={handleInputChange}
                  className={errors.name ? styles.inputError : ''}
                />
                {errors.name && <span className={styles.errorText}>{errors.name}</span>}
              </div>
            </div>

            <div className={styles.fieldRow}>
              <div className={`${styles.fieldGroup} ${styles.halfWidth}`}>
                <label>Brand / Collection *</label>
                <input 
                  type="text" 
                  name="brand" 
                  placeholder="e.g. UrbanThread" 
                  value={formData.brand}
                  onChange={handleInputChange}
                  className={errors.brand ? styles.inputError : ''}
                />
                {errors.brand && <span className={styles.errorText}>{errors.brand}</span>}
              </div>

              <div className={`${styles.fieldGroup} ${styles.halfWidth}`}>
                <label>Category *</label>
                <select 
                  name="category" 
                  value={formData.category} 
                  onChange={handleInputChange}
                  className={errors.category ? styles.inputError : ''}
                >
                  <option value="">Select a category...</option>
                  <option value="Men">Men</option>
                  <option value="Women">Women</option>
                  <option value="Kids">Kids</option>
                  <option value="Accessories">Accessories</option>
                  <option value="Eyewear">Eyewear</option>
                  <option value="Other">Other</option>
                </select>
                {errors.category && <span className={styles.errorText}>{errors.category}</span>}
              </div>
            </div>

            <div className={styles.fieldRow}>
              <div className={`${styles.fieldGroup} ${styles.quarterWidth}`}>
                <label>Price (USD) *</label>
                <input 
                  type="number" 
                  name="price" 
                  placeholder="0.00" 
                  min="0" 
                  step="0.01" 
                  value={formData.price}
                  onChange={handleInputChange}
                  className={errors.price ? styles.inputError : ''}
                />
                {errors.price && <span className={styles.errorText}>{errors.price}</span>}
              </div>

              <div className={`${styles.fieldGroup} ${styles.quarterWidth}`}>
                <label>Original Price (optional)</label>
                <input 
                  type="number" 
                  name="originalPrice" 
                  placeholder="0.00" 
                  min="0" 
                  step="0.01" 
                  value={formData.originalPrice}
                  onChange={handleInputChange}
                />
                <span className={styles.helperText}>Shows strikethrough price if filled.</span>
                {discountText && <span className={styles.discountText}>{discountText}</span>}
              </div>
            </div>

            <div className={styles.fieldRow}>
              <div className={`${styles.fieldGroup} ${styles.halfWidth}`}>
                <label className={styles.toggleWrapper}>
                  <div className={`${styles.toggle} ${formData.isFeatured ? styles.toggleOn : ''}`}>
                    <div className={styles.toggleKnob}></div>
                  </div>
                  <input type="checkbox" name="isFeatured" checked={formData.isFeatured} onChange={handleInputChange} hidden />
                  <span>{formData.isFeatured ? 'Featured ✓' : 'Not Featured'}</span>
                </label>
                <span className={styles.helperText}>Mark as featured</span>
              </div>

              <div className={`${styles.fieldGroup} ${styles.halfWidth}`}>
                <label className={styles.toggleWrapper}>
                  <div className={`${styles.toggle} ${formData.isRecommended ? styles.toggleOn : ''}`}>
                    <div className={styles.toggleKnob}></div>
                  </div>
                  <input type="checkbox" name="isRecommended" checked={formData.isRecommended} onChange={handleInputChange} hidden />
                  <span>{formData.isRecommended ? 'Recommended ✓' : 'Not Recommended'}</span>
                </label>
                <span className={styles.helperText}>Mark as recommended</span>
              </div>
            </div>

            <div className={styles.fieldRow}>
              <div className={`${styles.fieldGroup} ${styles.fullWidth}`}>
                <label>Description</label>
                <textarea 
                  name="description" 
                  placeholder="Describe the product — material, fit, style notes..." 
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="5"
                ></textarea>
                <div className={styles.charCounter}>{formData.description.length} / 500</div>
              </div>
            </div>
          </div>

          {/* PRODUCT IMAGES */}
          <div className={styles.section} id="images-section">
            <div className={styles.sectionHeader}>
              <h3>Product Images</h3>
              <p>Upload up to 4 images. First image is the main display image.</p>
              {errors.images && <div className={styles.errorText}>{errors.images}</div>}
            </div>

            <div className={styles.imageGrid}>
              {[0, 1, 2, 3].map((index) => (
                <div 
                  key={index} 
                  className={`${styles.imageSlot} ${imagePreviews[index] ? styles.filled : styles.empty} ${index === 0 && errors.images ? styles.slotError : ''}`}
                  onClick={() => handleImageClick(index)}
                >
                  <input 
                    type="file" 
                    ref={fileInputRefs[index]} 
                    onChange={(e) => handleImageChange(index, e)} 
                    accept="image/jpeg, image/png, image/webp"
                    hidden 
                  />
                  
                  {imagePreviews[index] ? (
                    <>
                      <img src={imagePreviews[index]} alt={`Upload preview ${index + 1}`} />
                      {index === 0 && <div className={styles.mainBadge}>Main</div>}
                      <button type="button" className={styles.removeImageBtn} onClick={(e) => removeImage(index, e)}>×</button>
                      <div className={styles.changeOverlay}>Change Image</div>
                    </>
                  ) : (
                    <div className={styles.emptyStateContent}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                      <span className={styles.uploadText}>Upload Image</span>
                      <span className={styles.uploadHint}>JPG, PNG, WEBP</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* SUBMIT */}
          {globalError && <div className={styles.globalError}>{globalError}</div>}

          <div className={styles.submitSection}>
            {uploadStatus.state === 'uploading' && (
              <div className={styles.progressContainer}>
                <div className={styles.progressBar} style={{ width: `${uploadStatus.progress}%` }}></div>
              </div>
            )}
            
            <button 
              type="submit" 
              className={styles.submitBtn} 
              disabled={uploadStatus.state === 'uploading'}
            >
              {uploadStatus.state === 'uploading' 
                ? (uploadStatus.progress === 100 ? 'Saving product...' : uploadStatus.text) 
                : 'ADD TO COLLECTION'}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default AddProduct;
