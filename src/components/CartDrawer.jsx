import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import styles from './CartDrawer.module.css';

const CartDrawer = ({ isOpen, onClose }) => {
  const { items, dispatch, totalItems, totalPrice } = useCart();
  const history = useHistory();

  const handleRemove = (id) => dispatch({ type: 'REMOVE_ITEM', payload: { id } });
  const handleIncrement = (id) => dispatch({ type: 'INCREMENT', payload: { id } });
  const handleDecrement = (id) => dispatch({ type: 'DECREMENT', payload: { id } });

  return (
    <>
      <div 
        className={`${styles.overlay} ${isOpen ? styles.open : ''}`} 
        onClick={onClose} 
      />
      <div className={`${styles.drawer} ${isOpen ? styles.open : ''}`}>
        <div className={styles.header}>
          <h2>
            Shopping Cart <span className={styles.itemCount}>({totalItems} items)</span>
          </h2>
          <button className={styles.closeBtn} onClick={onClose}>&times;</button>
        </div>

        <div className={styles.body}>
          {items.length === 0 ? (
            <div className={styles.emptyState}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ddd" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <path d="M16 10a4 4 0 0 1-8 0"></path>
              </svg>
              <p className={styles.emptyText}>Your cart is empty</p>
              <Link to="/shop" className={styles.discoverBtn} onClick={onClose}>
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className={styles.itemsList}>
              {items.map(({ product, quantity }) => (
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
                    <p className={styles.itemPriceUnit}>${Number(product.price).toFixed(2)}</p>
                    
                    <div className={styles.controlsRow}>
                      <div className={styles.quantityControls}>
                        <button onClick={() => handleDecrement(product.id)}>&minus;</button>
                        <span>{quantity}</span>
                        <button onClick={() => handleIncrement(product.id)}>&#43;</button>
                      </div>
                      <div className={styles.itemSubtotal}>
                        ${(product.price * quantity).toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className={styles.footer}>
          <div className={styles.subtotalRow}>
            <span>Subtotal:</span>
            <span className={styles.subtotalValue}>${totalPrice.toFixed(2)}</span>
          </div>
          <div className={styles.shippingNotice}>
            {totalPrice < 200 ? (
              <span className={styles.shippingWarning}>Add ${(200 - totalPrice).toFixed(2)} more for free shipping</span>
            ) : (
              <span className={styles.shippingSuccess}>✓ Free shipping applied!</span>
            )}
          </div>
          <div className={styles.buttonRow}>
            <button className={styles.viewCartBtn} onClick={() => { onClose(); history.push('/cart'); }}>
              VIEW CART
            </button>
            <button className={styles.checkoutBtn} onClick={() => { onClose(); history.push('/checkout'); }}>
              CHECKOUT
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CartDrawer;
