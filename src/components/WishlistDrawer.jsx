import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import styles from './WishlistDrawer.module.css';

const WishlistDrawer = ({ isOpen, onClose }) => {
  const { wishlist, dispatch: wishlistDispatch } = useWishlist();
  const { dispatch: cartDispatch } = useCart();
  const [feedbackItem, setFeedbackItem] = useState(null);
  const [moveAllStatus, setMoveAllStatus] = useState(false);

  const handleRemove = (id) => {
    wishlistDispatch({ type: 'REMOVE_FROM_WISHLIST', payload: { id } });
  };

  const handleAddToCart = (product) => {
    cartDispatch({ type: 'ADD_ITEM', payload: { product, quantity: 1 } });
    setFeedbackItem(product.id);
    setTimeout(() => {
      setFeedbackItem(null);
    }, 1500);
  };

  const handleMoveAllToCart = () => {
    wishlist.forEach((product) => {
      cartDispatch({ type: 'ADD_ITEM', payload: { product, quantity: 1 } });
    });
    setMoveAllStatus(true);
    setTimeout(() => {
      wishlistDispatch({ type: 'CLEAR_WISHLIST' });
      setMoveAllStatus(false);
    }, 2000);
  };

  return (
    <>
      <div 
        className={`${styles.overlay} ${isOpen ? styles.open : ''}`} 
        onClick={onClose} 
      />
      <div className={`${styles.drawer} ${isOpen ? styles.open : ''}`}>
        <div className={styles.header}>
          <h2>
            My Wishlist <span className={styles.itemCount}>({wishlist.length} items)</span>
          </h2>
          <button className={styles.closeBtn} onClick={onClose}>&times;</button>
        </div>

        <div className={styles.body}>
          {wishlist.length === 0 ? (
            <div className={styles.emptyState}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ddd" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
              <p className={styles.emptyText}>Your wishlist is empty</p>
              <Link to="/shop" className={styles.discoverBtn} onClick={onClose}>
                Discover Products
              </Link>
            </div>
          ) : (
            <div className={styles.itemsList}>
              {wishlist.map((product) => {
                const isAdded = feedbackItem === product.id;
                return (
                  <div key={product.id} className={styles.itemRow}>
                    <div className={styles.imageContainer}>
                      {product.images && product.images.length > 0 ? (
                        <img src={product.images[0]} alt={product.name} />
                      ) : (
                        <div className={styles.imagePlaceholder}>
                          {product.name ? product.name.charAt(0).toUpperCase() : '?'}
                        </div>
                      )}
                    </div>
                    
                    <div className={styles.itemInfo}>
                      <button className={styles.removeItemBtn} onClick={() => handleRemove(product.id)} title="Remove item">
                        &times;
                      </button>
                      <h4 className={styles.itemName}>{product.name}</h4>
                      <p className={styles.itemBrand}>{product.brand}</p>
                      <p className={styles.itemPrice}>${Number(product.price).toFixed(2)}</p>
                      <button 
                        className={`${styles.addToCartBtn} ${isAdded ? styles.added : ''}`}
                        onClick={() => handleAddToCart(product)}
                      >
                        {isAdded ? 'Added ✓' : 'ADD TO CART'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {wishlist.length > 0 && (
          <div className={styles.footer}>
            <button 
              className={`${styles.moveAllBtn} ${moveAllStatus ? styles.moved : ''}`} 
              onClick={handleMoveAllToCart}
            >
              {moveAllStatus ? '✓ All items added!' : 'Move All to Cart'}
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default WishlistDrawer;
