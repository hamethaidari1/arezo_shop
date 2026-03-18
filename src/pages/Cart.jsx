import React from 'react';
import { useCart } from '../hooks/useCart';
import { Link } from 'react-router-dom';
import styles from './Cart.module.css';

const Cart = () => {
  const { cart, dispatch } = useCart();

  const handleRemove = (id) => dispatch({ type: 'REMOVE_ITEM', payload: { id } });
  const handleIncrement = (id) => dispatch({ type: 'INCREMENT', payload: { id } });
  const handleDecrement = (id) => dispatch({ type: 'DECREMENT', payload: { id } });

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = subtotal > 200 ? 0 : 15;
  const total = subtotal + shipping;

  if (cart.length === 0) {
    return (
      <div className={styles.emptyCart}>
        <div className={styles.emptyIcon}>🛒</div>
        <h2>Your cart is currently empty.</h2>
        <p>Before proceed to checkout you must add some products to your shopping cart.</p>
        <Link to="/shop" className={styles.returnBtn}>Return To Shop</Link>
      </div>
    );
  }

  return (
    <div className={styles.cartPage}>
      <div className={styles.hero}>
        <h1>Shopping Cart</h1>
      </div>

      <div className={styles.container}>
        <div className={styles.tableSection}>
          <table className={styles.cartTable}>
            <thead>
              <tr>
                <th>Image</th>
                <th>Product Name</th>
                <th>Price</th>
                <th>Qty</th>
                <th>Subtotal</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {cart.map(item => (
                <tr key={item.id}>
                  <td>
                    {item.images && item.images.length > 0 ? (
                      <img src={item.images[0]} alt={item.name} className={styles.thumb} />
                    ) : (
                      <div className={styles.thumbPlaceholder}>{item.name.charAt(0)}</div>
                    )}
                  </td>
                  <td>
                    <Link to={`/product/${item.id}`} className={styles.productLink}>{item.name}</Link>
                  </td>
                  <td>${Number(item.price).toFixed(2)}</td>
                  <td>
                    <div className={styles.qtyControls}>
                      <button onClick={() => handleDecrement(item.id)}>-</button>
                      <input type="text" value={item.quantity} readOnly />
                      <button onClick={() => handleIncrement(item.id)}>+</button>
                    </div>
                  </td>
                  <td>${(item.price * item.quantity).toFixed(2)}</td>
                  <td>
                    <button className={styles.removeBtn} onClick={() => handleRemove(item.id)}>×</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          <div className={styles.cartActions}>
            <Link to="/shop" className={styles.continueBtn}>Continue Shopping</Link>
            <button className={styles.clearBtn} onClick={() => dispatch({ type: 'CLEAR_CART' })}>Clear Cart</button>
          </div>
        </div>

        <div className={styles.summarySection}>
          <div className={styles.summaryCard}>
            <h3>Cart Total</h3>
            <div className={styles.summaryRow}>
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className={styles.summaryRow}>
              <span>Shipping</span>
              <span>{shipping === 0 ? 'Free Shipping' : `$${shipping.toFixed(2)}`}</span>
            </div>
            <div className={`${styles.summaryRow} ${styles.totalRow}`}>
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <Link to="/checkout" className={styles.checkoutBtn}>Proceed to Checkout</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
