import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../firebase/firebase';
import { useCart } from '../hooks/useCart';
import { useWishlist } from '../hooks/useWishlist';
import styles from './ProductPage.module.css';

const ProductPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [mainImage, setMainImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [showAdded, setShowAdded] = useState(false);
  
  const { dispatch: cartDispatch } = useCart();
  const { wishlist, dispatch: wishlistDispatch } = useWishlist();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const doc = await db.collection('products').doc(id).get();
        if (doc.exists) {
          const data = { id: doc.id, ...doc.data() };
          setProduct(data);
          if (data.images && data.images.length > 0) {
            setMainImage(data.images[0]);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <div className={styles.loading}>Loading product...</div>;
  if (!product) return <div className={styles.notFound}>Product not found.</div>;

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
    <div className={styles.productPage}>
      <div className={styles.container}>
        <div className={styles.grid}>
          <div className={styles.imageGallery}>
            {hasImage ? (
              <img src={mainImage} alt={product.name} className={styles.mainImage} />
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
            <h1 className={styles.name}>{product.name}</h1>
            
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

            <div className={styles.metaInfo}>
              <p><strong>Brand:</strong> {product.brand}</p>
              <p><strong>Tags:</strong> {product.category}, Fashion</p>
            </div>

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

export default ProductPage;
