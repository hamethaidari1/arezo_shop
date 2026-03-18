import React, { useState } from 'react';
import { useCart } from '../hooks/useCart';
import { useWishlist } from '../hooks/useWishlist';
import styles from './ProductModal.module.css';

const ProductModal = ({ product, onClose }) => {
  const [mainImage, setMainImage] = useState(product.images?.[0]);
  const [quantity, setQuantity] = useState(1);
  const [showAdded, setShowAdded] = useState(false);
  const { dispatch: cartDispatch } = useCart();
  const { wishlist, dispatch: wishlistDispatch } = useWishlist();

  const isWishlisted = wishlist.some(item => item.id === product.id);

  const handleAddToCart = () => {
    cartDispatch({ type: 'ADD_ITEM', payload: { ...product, quantity } });
    setShowAdded(true);
    setTimeout(() => {
      setShowAdded(false);
    }, 1500);
  };

  const handleWishlist = () => {
    wishlistDispatch({ type: 'TOGGLE_ITEM', payload: product });
  };

  const handleQuantityChange = (val) => {
    const newQty = quantity + val;
    if (newQty >= 1 && newQty <= 99) {
      setQuantity(newQty);
    }
  };

  const shareUrl = window.location.href;

  const hasImage = product.images && product.images.length > 0;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose}>&times;</button>
        <div className={styles.modalGrid}>
          <div className={styles.imageGallery}>
            {hasImage ? (
              <img src={mainImage || product.images[0]} alt={product.name} className={styles.mainImage} />
            ) : (
              <div className={styles.placeholderMain}>
                {product.name ? product.name.charAt(0).toUpperCase() : 'P'}
              </div>
            )}
            
            {hasImage && product.images.length > 1 && (
              <div className={styles.thumbnailList}>
                {product.images.map((img, idx) => (
                  <img 
                    key={idx} 
                    src={img} 
                    alt="thumb" 
                    className={`${styles.thumb} ${mainImage === img ? styles.thumbActive : ''}`} 
                    onClick={() => setMainImage(img)} 
                  />
                ))}
              </div>
            )}
          </div>
          
          <div className={styles.details}>
            <p className={styles.category}>{product.category}</p>
            <h2 className={styles.name}>{product.name}</h2>
            
            <div className={styles.priceRow}>
              {product.originalPrice && product.originalPrice > product.price ? (
                <>
                  <span className={styles.originalPrice}>${Number(product.originalPrice).toFixed(2)}</span>
                  <span className={styles.currentPrice}>${Number(product.price).toFixed(2)}</span>
                  <span className={styles.saveBadge}>Save {Math.round((1 - product.price / product.originalPrice) * 100)}%</span>
                </>
              ) : (
                <span className={styles.currentPrice}>${Number(product.price).toFixed(2)}</span>
              )}
            </div>

            <div className={styles.ratingRow}>
              <span className={styles.stars}>★★★★★</span>
              <span className={styles.reviews}>(24 reviews)</span>
            </div>

            <p className={styles.description}>{product.description}</p>
            
            <div className={styles.actionRow}>
              <div className={styles.quantityControls}>
                <button onClick={() => handleQuantityChange(-1)}>−</button>
                <input type="number" value={quantity} readOnly />
                <button onClick={() => handleQuantityChange(1)}>+</button>
              </div>
              
              <button 
                className={`${styles.addToCartBtn} ${showAdded ? styles.added : ''}`} 
                onClick={handleAddToCart}
              >
                {showAdded ? '✓ Added!' : 'ADD TO CART'}
              </button>
            </div>

            <button className={styles.wishlistBtn} onClick={handleWishlist}>
              {isWishlisted ? '♥ Added to Wishlist' : '♡ Add to Wishlist'}
            </button>

            <div className={styles.shareRow}>
              <span>Share:</span>
              <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noreferrer">Facebook</a>
              <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noreferrer">Twitter</a>
              <a href={`https://pinterest.com/pin/create/button/?url=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noreferrer">Pinterest</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
