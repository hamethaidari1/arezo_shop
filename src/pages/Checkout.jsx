import React, { useState } from 'react';
import { useCart } from '../hooks/useCart';
import { Link, useHistory } from 'react-router-dom';
import { db, auth } from '../firebase/firebase';
import firebase from 'firebase/app';
import styles from './Checkout.module.css';

const Checkout = () => {
  const { cart, dispatch } = useCart();
  const history = useHistory();
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    country: '',
    zip: '',
    paymentMethod: 'creditCard',
    cardNumber: '',
    expiry: '',
    cvv: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = subtotal > 200 ? 0 : 15;
  const total = subtotal + shipping;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (cart.length === 0) return;

    setLoading(true);
    try {
      const orderData = {
        userId: auth.currentUser ? auth.currentUser.uid : null,
        items: cart,
        subtotal,
        shipping,
        total,
        shippingAddress: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          address: formData.address,
          city: formData.city,
          country: formData.country,
          zip: formData.zip
        },
        paymentMethod: formData.paymentMethod,
        status: 'pending',
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      };

      await db.collection('orders').add(orderData);
      dispatch({ type: 'CLEAR_CART' });
      setSuccess(true);
    } catch (err) {
      console.error(err);
      alert("Error placing order.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className={styles.successPage}>
        <div className={styles.successIcon}>✓</div>
        <h2>Order Placed Successfully!</h2>
        <p>Thank you for your purchase. Your order number is #{Math.floor(Math.random() * 1000000)}.</p>
        <Link to="/shop" className={styles.continueBtn}>Continue Shopping</Link>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className={styles.emptyCart}>
        <h2>Checkout is unavailable</h2>
        <p>Your cart is empty.</p>
        <Link to="/shop" className={styles.continueBtn}>Return To Shop</Link>
      </div>
    );
  }

  return (
    <div className={styles.checkoutPage}>
      <div className={styles.hero}>
        <h1>Checkout</h1>
      </div>

      <div className={styles.container}>
        <div className={styles.formSection}>
          <form id="checkout-form" onSubmit={handlePlaceOrder}>
            <h3>Contact Information</h3>
            <input type="email" name="email" placeholder="Email Address" required value={formData.email} onChange={handleChange} className={styles.input} />

            <h3>Shipping Address</h3>
            <div className={styles.row}>
              <input type="text" name="firstName" placeholder="First Name" required value={formData.firstName} onChange={handleChange} className={styles.input} />
              <input type="text" name="lastName" placeholder="Last Name" required value={formData.lastName} onChange={handleChange} className={styles.input} />
            </div>
            <input type="text" name="address" placeholder="Address" required value={formData.address} onChange={handleChange} className={styles.input} />
            <div className={styles.row}>
              <input type="text" name="city" placeholder="City" required value={formData.city} onChange={handleChange} className={styles.input} />
              <input type="text" name="country" placeholder="Country" required value={formData.country} onChange={handleChange} className={styles.input} />
              <input type="text" name="zip" placeholder="ZIP Code" required value={formData.zip} onChange={handleChange} className={styles.input} />
            </div>

            <h3>Payment Method</h3>
            <div className={styles.paymentMethods}>
              <label className={styles.radioLabel}>
                <input type="radio" name="paymentMethod" value="creditCard" checked={formData.paymentMethod === 'creditCard'} onChange={handleChange} />
                Credit Card
              </label>
              <label className={styles.radioLabel}>
                <input type="radio" name="paymentMethod" value="cod" checked={formData.paymentMethod === 'cod'} onChange={handleChange} />
                Cash on Delivery
              </label>
            </div>

            {formData.paymentMethod === 'creditCard' && (
              <div className={styles.cardDetails}>
                <input type="text" name="cardNumber" placeholder="Card Number" required value={formData.cardNumber} onChange={handleChange} className={styles.input} />
                <div className={styles.row}>
                  <input type="text" name="expiry" placeholder="MM/YY" required value={formData.expiry} onChange={handleChange} className={styles.input} />
                  <input type="text" name="cvv" placeholder="CVV" required value={formData.cvv} onChange={handleChange} className={styles.input} />
                </div>
              </div>
            )}
          </form>
        </div>

        <div className={styles.summarySection}>
          <div className={styles.summaryCard}>
            <h3>Order Summary</h3>
            <div className={styles.itemList}>
              {cart.map(item => (
                <div key={item.id} className={styles.summaryItem}>
                  <div className={styles.itemInfo}>
                    <span className={styles.itemName}>{item.name}</span>
                    <span className={styles.itemQty}>x {item.quantity}</span>
                  </div>
                  <span className={styles.itemPrice}>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className={styles.summaryRow}>
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className={styles.summaryRow}>
              <span>Shipping</span>
              <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
            </div>
            <div className={`${styles.summaryRow} ${styles.totalRow}`}>
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>

            <button type="submit" form="checkout-form" className={styles.placeOrderBtn} disabled={loading}>
              {loading ? 'Processing...' : 'Place Order'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
