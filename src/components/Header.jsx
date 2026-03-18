import React, { useState, useEffect, useRef } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import CartDrawer from './CartDrawer';
import WishlistDrawer from './WishlistDrawer';
import { SignInModal, SignUpModal } from './AuthModals';
import { auth, db } from '../firebase/firebase';
import { getUserRole } from '../firebase/firestore';
import styles from './Header.module.css';

const Header = () => {
  const { totalItems, items: cartItems } = useCart();
  const { wishlist } = useWishlist();
  const history = useHistory();
  const location = useLocation();
  
  const [activePanel, setActivePanel] = useState(null); // 'search', 'account', 'wishlist', 'cart'
  const [isSticky, setIsSticky] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSignInOpen, setSignInOpen] = useState(false);
  const [isSignUpOpen, setSignUpOpen] = useState(false);
  
  // Animation states
  const [wishlistPulse, setWishlistPulse] = useState(false);
  const [cartBounce, setCartBounce] = useState(false);
  
  const accountRef = useRef(null);
  const searchInputRef = useRef(null);

  // Trigger animations on counts changes
  useEffect(() => {
    if (wishlist.length > 0) {
      setWishlistPulse(true);
      const timer = setTimeout(() => setWishlistPulse(false), 300);
      return () => clearTimeout(timer);
    }
  }, [wishlist.length]);

  useEffect(() => {
    if (totalItems > 0) {
      setCartBounce(true);
      const timer = setTimeout(() => setCartBounce(false), 400);
      return () => clearTimeout(timer);
    }
  }, [totalItems]);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Close panels on route change
    setActivePanel(null);
    setSearchQuery('');
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (activePanel === 'account' && accountRef.current && !accountRef.current.contains(event.target)) {
        setActivePanel(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [activePanel]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setActivePanel(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
  
  useEffect(() => {
    if (activePanel === 'search' && searchInputRef.current) {
      setTimeout(() => searchInputRef.current.focus(), 50);
    }
  }, [activePanel]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        // Safely check role
        try {
          const role = await getUserRole(currentUser.uid);
          setIsAdmin(role === 'admin');
        } catch (err) {
          setIsAdmin(false);
        }
      } else {
        setUser(null);
        setIsAdmin(false);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    db.collection('products').get().then(snapshot => {
      setAllProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
  }, []);

  useEffect(() => {
    if (searchQuery.length >= 2) {
      const q = searchQuery.toLowerCase();
      const results = allProducts.filter(p => 
        p.name?.toLowerCase().includes(q) || 
        p.brand?.toLowerCase().includes(q)
      );
      setSearchResults(results.slice(0, 6)); // max 6 results
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, allProducts]);

  const handleSignOut = () => {
    auth.signOut().then(() => {
      setUser(null);
      setIsAdmin(false);
      setActivePanel(null);
    });
  };

  const togglePanel = (panel) => {
    setActivePanel(activePanel === panel ? null : panel);
  };

  return (
    <>
      <div className={styles.announcementBar}>
        <div className={styles.announcementLeft}>
          <div className={styles.topDropdown}>
            <span>English ▾</span>
          </div>
          <span className={styles.separator}>|</span>
          <div className={styles.topDropdown}>
            <span>USD ▾</span>
          </div>
        </div>
        <div className={styles.announcementCenter}>
          Call Us: +1 (800) 000-0000
        </div>
        <div className={styles.announcementRight}>
          Free delivery on order over <span className={styles.goldText}>$200</span>
        </div>
      </div>

      <header className={`${styles.header} ${isSticky ? styles.sticky : ''}`}>
        <div className={styles.logo} onClick={() => history.push('/')}>
          {/* Top line — decorative */}
          <div className={styles.logoTopLine}></div>
          
          {/* Main brand name row */}
          <div className={styles.logoNameRow}>
            <span className={styles.logoMain}>BABONA</span>
            <span className={styles.logoDivider}>✦</span>
            <span className={styles.logoSub}>Collection</span>
          </div>
          
          {/* Bottom tagline */}
          <div className={styles.logoTagline}>EST. 2026 — PREMIUM FASHION</div>
        </div>
        
        <nav className={styles.nav}>
          <div className={styles.navItem}>
            <Link to="/">Home ▾</Link>
            <div className={styles.dropdown}>
              <Link to="/">Home</Link>
              <Link to="/about">About Us</Link>
              <Link to="/contact">Contact</Link>
            </div>
          </div>
          
          <div className={styles.navItem}>
            <Link to="/shop">Shop ▾</Link>
            <div className={styles.dropdown}>
              <Link to="/shop">All Products</Link>
              <Link to="/shop?category=Men">Men</Link>
              <Link to="/shop?category=Women">Women</Link>
              <Link to="/shop?category=Kids">Kids</Link>
              <Link to="/shop?category=Accessories">Accessories</Link>
            </div>
          </div>

          <div className={styles.navItem}>
            <Link to="/featured">Collection</Link>
          </div>

          <div className={styles.navItem}>
            <Link to="#">Pages ▾</Link>
            <div className={styles.dropdown}>
              <Link to="/featured">Featured Products</Link>
              <Link to="/recommended">Recommended Products</Link>
              <Link to="/faq">FAQ</Link>
              <Link to="/size-guide">Size Guide</Link>
            </div>
          </div>

          <div className={styles.navItem}>
            <Link to="/blog">Blog ▾</Link>
            <div className={styles.dropdown}>
              <Link to="/blog">All Posts</Link>
              <Link to="/blog?category=Lifestyle">Lifestyle</Link>
              <Link to="/blog?category=Style">Style</Link>
              <Link to="/blog?category=Guide">Guide</Link>
            </div>
          </div>

          <div className={styles.navItem}>
            <Link to="/about">About</Link>
          </div>
          <div className={styles.navItem}>
            <Link to="/contact">Contact</Link>
          </div>
        </nav>

        <div className={styles.actions}>
          {/* ICON 1: SEARCH */}
          <button 
            className={`${styles.iconBtn} ${styles.hideOnMobile}`} 
            onClick={() => togglePanel('search')}
            title="Search"
          >
            {activePanel === 'search' ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            )}
          </button>
          
          {/* ICON 2: ACCOUNT */}
          <div className={`${styles.accountWrapper} ${styles.hideOnMobile}`} ref={accountRef}>
            <button 
              className={styles.iconBtn} 
              onClick={() => togglePanel('account')}
              title="Account"
            >
              {user ? (
                <div className={styles.avatar}>
                  {user.displayName ? user.displayName.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                </div>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              )}
            </button>
            
            {activePanel === 'account' && (
              <div className={styles.accountDropdown}>
                {user ? (
                  <>
                    <div className={styles.dropdownHeader}>
                      <span className={styles.userName}>Hello, {user.displayName ? user.displayName.split(' ')[0] : 'User'}</span>
                      <span className={styles.userEmail}>{user.email}</span>
                    </div>
                    <Link to="/account" className={styles.dropdownItem} onClick={() => setActivePanel(null)}>👤 My Account</Link>
                    <Link to="/orders" className={styles.dropdownItem} onClick={() => setActivePanel(null)}>📦 My Orders</Link>
                    {isAdmin && <Link to="/admin/dashboard" className={styles.dropdownItem} onClick={() => setActivePanel(null)}>🔒 Admin Panel</Link>}
                    <div className={styles.divider}></div>
                    <button onClick={handleSignOut} className={styles.signOutBtn}>Sign Out</button>
                  </>
                ) : (
                  <>
                    <div className={styles.dropdownHeader}>
                      <span className={styles.welcomeText}>Welcome!</span>
                      <span className={styles.subText}>Sign in to your account</span>
                    </div>
                    <div className={styles.authButtons}>
                      <button onClick={() => { setActivePanel(null); setSignInOpen(true); }} className={styles.signInBtn}>Sign In</button>
                      <button onClick={() => { setActivePanel(null); setSignUpOpen(true); }} className={styles.signUpBtn}>Create Account</button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* ICON 3: WISHLIST */}
          <button 
            className={`${styles.iconBtn} ${wishlistPulse ? styles.pulseAnim : ''}`} 
            onClick={() => togglePanel('wishlist')}
            title="Wishlist"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
            {wishlist.length > 0 && <span className={styles.badge}>{wishlist.length}</span>}
          </button>
          
          {/* ICON 4: CART */}
          <button 
            className={`${styles.iconBtn} ${cartBounce ? styles.bounceAnim : ''}`} 
            onClick={() => togglePanel('cart')}
            title="Cart"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
            {totalItems > 0 && <span className={`${styles.badge} ${cartBounce ? styles.badgeAnim : ''}`}>{totalItems}</span>}
          </button>
        </div>
      </header>

      {/* SEARCH OVERLAY */}
      <div 
        className={`${styles.searchOverlay} ${activePanel === 'search' ? styles.active : ''}`} 
        onClick={() => setActivePanel(null)}
      />
      <div className={`${styles.searchBarWrapper} ${activePanel === 'search' ? styles.searchOpen : ''}`}>
        <div className={styles.searchContainer}>
          <input 
            ref={searchInputRef}
            type="text" 
            placeholder="Search for products, brands..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
          <button className={styles.searchCloseBtn} onClick={() => setActivePanel(null)} title="Close">&times;</button>
        </div>
        
        {/* LIVE SEARCH RESULTS */}
        {searchQuery.length >= 2 && (
          <div className={styles.searchResults}>
            {searchResults.length > 0 ? (
              searchResults.map(p => (
                <div 
                  key={p.id} 
                  className={styles.searchResultItem} 
                  onClick={() => { setActivePanel(null); history.push(`/product/${p.id}`); }}
                >
                  <div className={styles.searchThumbWrapper}>
                    {p.images && p.images.length > 0 ? (
                      <img src={p.images[0]} alt={p.name} className={styles.searchThumb} />
                    ) : (
                      <div className={styles.searchThumbPlaceholder}>
                        {p.name ? p.name.charAt(0).toUpperCase() : '?'}
                      </div>
                    )}
                  </div>
                  <div className={styles.searchResultInfo}>
                    <span className={styles.searchResultName}>{p.name}</span>
                    <span className={styles.searchResultBrand}>{p.brand}</span>
                  </div>
                  <span className={styles.searchResultPrice}>${Number(p.price).toFixed(2)}</span>
                </div>
              ))
            ) : (
              <div className={styles.noResults}>
                No products found for "{searchQuery}"
              </div>
            )}
          </div>
        )}
      </div>
      
      <CartDrawer isOpen={activePanel === 'cart'} onClose={() => setActivePanel(null)} />
      <WishlistDrawer isOpen={activePanel === 'wishlist'} onClose={() => setActivePanel(null)} />
      
      <SignInModal 
        isOpen={isSignInOpen} 
        onClose={() => setSignInOpen(false)} 
        onSwitchToSignUp={() => { setSignInOpen(false); setSignUpOpen(true); }} 
      />
      <SignUpModal 
        isOpen={isSignUpOpen} 
        onClose={() => setSignUpOpen(false)} 
        onSwitchToSignIn={() => { setSignUpOpen(false); setSignInOpen(true); }} 
      />
    </>
  );
};

export default Header;
