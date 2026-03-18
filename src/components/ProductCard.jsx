import React, { useState } from 'react';
import styles from './ProductCard.module.css';

const ProductCard = ({ product, onAddToCart, onWishlistToggle, isWishlisted, onClick }) => {
  const [hovered, setHovered] = useState(false);

  const { name, brand, price, originalPrice, images, isFeatured, isRecommended } = product;

  const mainImage = images && images.length > 0 ? images[0] : null;

  const discountPercent = originalPrice && originalPrice > price
    ? Math.round((1 - price / originalPrice) * 100)
    : null;

  const handleAddToCart = (e) => {
    e.stopPropagation();
    onAddToCart && onAddToCart(product);
  };

  const handleWishlist = (e) => {
    e.stopPropagation();
    onWishlistToggle && onWishlistToggle(product);
  };

  return (
    <div 
      className={`${styles.card} ${hovered ? styles.hovered : ''}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onClick && onClick(product)}
    >
      {/* Image Container */}
      <div className={styles.imageContainer}>

        {mainImage ? (
          <img 
            src={mainImage} 
            alt={name || 'Product'} 
            className={`${styles.image} ${hovered ? styles.imageZoom : ''}`} 
          />
        ) : (
          <div className={styles.placeholder}>
            <span className={styles.placeholderLetter}>
              {name ? name.charAt(0).toUpperCase() : '?'}
            </span>
          </div>
        )}

        {/* Badge */}
        {discountPercent ? (
          <span className={`${styles.badge} ${styles.badgeDiscount}`}>
            -{discountPercent}%
          </span>
        ) : (isFeatured || isRecommended) ? (
          <span className={`${styles.badge} ${styles.badgeNew}`}>New</span>
        ) : null}

        {/* Wishlist Button */}
        <button 
          className={styles.wishlistBtn}
          onClick={handleWishlist}
          style={isWishlisted ? { color: '#e91e8c' } : {}}
        >
          {isWishlisted ? '♥' : '♡'}
        </button>

        {/* Add to Cart on Hover */}
        <button 
          className={`${styles.addToCartBtn} ${hovered ? styles.addToCartVisible : ''}`}
          onClick={handleAddToCart}
        >
          ADD TO CART
        </button>
      </div>

      {/* Card Info */}
      <div className={styles.info}>
        <h3 className={styles.name} title={name}>{name}</h3>
        {brand && <p className={styles.brand}>{brand}</p>}
        <div className={styles.priceRow}>
          <span className={styles.price}>${Number(price).toFixed(2)}</span>
          {originalPrice && originalPrice > price && (
            <span className={styles.originalPrice}>
              ${Number(originalPrice).toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
