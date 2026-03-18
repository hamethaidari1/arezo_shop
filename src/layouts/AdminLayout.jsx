import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { auth } from '../firebase/firebase';
import { adminLogout } from '../firebase/auth';
import styles from './AdminLayout.module.css';

const AdminLayout = ({ children, title }) => {
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currUser) => {
      setUser(currUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  const handleSignOut = () => {
    adminLogout().then(() => {
      window.location.href = '/admin/login';
    });
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg> },
    { name: 'Add Product', path: '/admin/add-product', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg> },
    { name: 'All Products', path: '/admin/products', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg> },
    { name: 'Messages', path: '/admin/messages', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg> }
  ];

  return (
    <div className={styles.adminLayout}>
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && <div className={styles.sidebarOverlay} onClick={() => setSidebarOpen(false)}></div>}
      
      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.open : ''}`}>
        <div className={styles.sidebarLogo}>
          {/* Decorative top line */}
          <div className={styles.sidebarLogoLine}></div>
          
          {/* Brand name */}
          <div className={styles.sidebarLogoName}>
            <span className={styles.sidebarLogoMain}>BABONA</span>
            <span className={styles.sidebarLogoDivider}>✦</span>
            <span className={styles.sidebarLogoSub}>Collection</span>
          </div>
          
          {/* Admin panel label */}
          <div className={styles.sidebarAdminLabel}>ADMIN PANEL</div>
        </div>
        
        <nav className={styles.sidebarNav}>
          {navItems.map(item => (
            <Link 
              key={item.path} 
              to={item.path} 
              className={`${styles.navItem} ${location.pathname === item.path ? styles.active : ''}`}
            >
              <span className={styles.navIcon}>{item.icon}</span>
              {item.name}
            </Link>
          ))}
          
          <div className={styles.navDivider}></div>
          
          <Link to="/" className={styles.navItem} target="_blank">
            <span className={styles.navIcon}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
            </span>
            View Store
          </Link>
          
          <button className={styles.signOutItem} onClick={handleSignOut}>
            <span className={styles.navIcon}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
            </span>
            Sign Out
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className={styles.mainContent}>
        <header className={styles.topBar}>
          <div className={styles.topBarLeft}>
            <button className={styles.hamburgerBtn} onClick={() => setSidebarOpen(true)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
            </button>
            <h1 className={styles.pageTitle}>{title}</h1>
          </div>
          
          <div className={styles.adminProfile}>
            <div className={styles.adminInfo}>
              <span className={styles.adminName}>{user?.displayName || 'Admin'}</span>
              <span className={styles.adminEmail}>{user?.email}</span>
            </div>
            <div className={styles.adminAvatar}>
              {user?.displayName ? user.displayName.charAt(0).toUpperCase() : 'A'}
            </div>
          </div>
        </header>

        <div className={styles.contentArea}>
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
