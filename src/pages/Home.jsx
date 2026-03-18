import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import firebase from 'firebase/app';
import 'firebase/firestore';
import ProductCard from '../components/ProductCard';
import styles from './Home.module.css';
import { blogPosts } from './Blog';

const Home = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const unsubscribe = firebase.firestore()
      .collection('products')
      .orderBy('createdAt', 'desc')
      .onSnapshot(
        (snapshot) => {
          const data = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setAllProducts(data);
          setLoading(false);
        },
        (error) => {
          console.error('Error:', error);
          setLoading(false);
        }
      );
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide(prev => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => setActiveSlide(prev => (prev + 1) % 3);
  const prevSlide = () => setActiveSlide(prev => (prev === 0 ? 2 : prev - 1));

  // Try to get featured products
  const strictFeatured = allProducts.filter(p => p.isFeatured === true);
  const featuredIds = new Set(strictFeatured.map(p => p.id));

  // Try to get recommended (not already in featured)
  const strictRecommended = allProducts.filter(
    p => p.isRecommended === true && !featuredIds.has(p.id)
  );
  const recommendedIds = new Set(strictRecommended.map(p => p.id));

  // Regular products (neither featured nor recommended)
  const regularProducts = allProducts.filter(
    p => !featuredIds.has(p.id) && !recommendedIds.has(p.id)
  );

  const renderSkeletons = () => (
    <div className={styles.productsGrid}>
      {[...Array(5)].map((_, i) => (
        <div key={i} className={styles.skeleton}></div>
      ))}
    </div>
  );

  return (
    <div className={styles.home}>
      {/* HERO SECTION */}
      <section className={styles.hero}>
        {/* BIG BACKGROUND TEXT */}
        <div className={styles.bgYear}>2026</div>

        {/* SLIDE 1 */}
        <div className={`${styles.slide} ${activeSlide === 0 ? styles.active : ''}`} style={{ background: '#0a0a0a' }}>
          <div className={styles.slideLeft}>
            <div className={styles.heroImageWrapper}>
              {/* Decorative gold border frame behind the photo */}
              <div className={styles.heroFrameBorder}></div>
              
              {/* Main model photo */}
              <div className={styles.heroImageContainer}>
                <img src="/modelpic.jpg" alt="Fashion Model" className={styles.heroModelImage} />
                
                {/* Gold overlay gradient at bottom */}
                <div className={styles.heroImageOverlay}></div>

                {/* Season badge */}
                <div className={styles.heroSeasonBadge}>SS 2026</div>

                {/* New badge circle */}
                <div className={styles.heroNewBadge}>NEW</div>
              </div>
            </div>
          </div>
          <div className={styles.slideRight}>
            <div className={styles.heroTag} style={{ color: '#c9a84c' }}>— NEW ARRIVAL —</div>
            <h1 className={`${styles.heroTitle} ${styles.slide1Title}`}>
              <span className={styles.s1Italic}>Discover</span>
              <span className={styles.s1Bold}>Your Style<div className={styles.s1Underline}></div></span>
            </h1>
            <p className={styles.heroSub} style={{ color: 'rgba(255,255,255,0.6)' }}>
              Premium fashion crafted for those who dare to be different.
            </p>
            <div className={styles.heroButtons}>
              <Link to="/shop" className={styles.s1BtnGold}>SHOP NOW <span className={styles.btnArrow}>→</span></Link>
              <Link to="/shop" className={styles.s1BtnGhost}>VIEW LOOKBOOK</Link>
            </div>
            <div className={styles.heroStats}>
              <span>500+ Products</span>
              <span className={styles.statDivider}></span>
              <span>50+ Brands</span>
              <span className={styles.statDivider}></span>
              <span>Free Shipping</span>
            </div>
          </div>
        </div>

        {/* SLIDE 2 */}
        <div className={`${styles.slide} ${activeSlide === 1 ? styles.active : ''}`} style={{ background: '#f5f0e8' }}>
          <div className={styles.slideLeft}>
            <div className={styles.slider2Art}>
              <div className={styles.s2CircleLg}></div>
              <div className={styles.s2Rect}>
                <div className={styles.s2CircleSm}></div>
              </div>
              <div className={styles.s2Line}></div>
              <div className={styles.s2FloatText}>COLLECTION 2026</div>
            </div>
          </div>
          <div className={styles.slideRight}>
            <div className={styles.heroTag} style={{ color: '#000' }}>— WOMEN'S COLLECTION —</div>
            <h1 className={`${styles.heroTitle} ${styles.slide2Title}`}>
              <span className={styles.s2Italic}>Female</span>
              <span className={styles.s2Bold}>Fashion</span>
            </h1>
            <p className={styles.heroSub} style={{ color: '#555' }}>
              Elegance redefined. Shop the latest women's arrivals.
            </p>
            <div className={styles.heroButtons}>
              <Link to="/shop" className={styles.s2BtnDark}>EXPLORE NOW →</Link>
              <div className={styles.s2Badge}>30% OFF Summer Vacation</div>
            </div>
          </div>
        </div>

        {/* SLIDE 3 */}
        <div className={`${styles.slide} ${activeSlide === 2 ? styles.active : ''}`} style={{ background: '#0d0d1a' }}>
          <div className={styles.slideLeft}>
            <div className={styles.slider3Art}>
              <div className={styles.s3Card1}></div>
              <div className={styles.s3Card2}></div>
              <div className={styles.s3Card3}>
                <div className={styles.s3Stars}>
                  <div className={`${styles.s3Star} ${styles.st1}`}></div>
                  <div className={`${styles.s3Star} ${styles.st2}`}></div>
                  <div className={`${styles.s3Star} ${styles.st3}`}></div>
                  <div className={`${styles.s3Star} ${styles.st4}`}></div>
                  <div className={`${styles.s3Star} ${styles.st5}`}></div>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.slideRight}>
            <div className={styles.heroTag} style={{ color: '#e74c3c' }}><span className={styles.dotRed}></span> LIMITED <span className={styles.dotRed}></span></div>
            <h1 className={`${styles.heroTitle} ${styles.slide3Title}`}>
              <span className={styles.s3Italic} style={{ color: '#c9a84c' }}>Exclusive</span>
              <span className={styles.s3Bold}>Drops</span>
            </h1>
            <div className={styles.countdown}>
              <span className={styles.cdLabel}>ENDS IN:</span>
              <span className={styles.cdBox}>02</span><span className={styles.cdSep}>:</span>
              <span className={styles.cdBox}>14</span><span className={styles.cdSep}>:</span>
              <span className={styles.cdBox}>38</span><span className={styles.cdSep}>:</span>
              <span className={styles.cdBox}>55</span>
            </div>
            <div className={styles.heroButtons}>
              <Link to="/shop" className={styles.s3BtnGold}><span className={styles.flame}>🔥</span> GET IT NOW</Link>
            </div>
          </div>
        </div>

        {/* ARROWS */}
        <button className={`${styles.arrowBtn} ${styles.arrowLeft}`} onClick={prevSlide}>‹</button>
        <button className={`${styles.arrowBtn} ${styles.arrowRight}`} onClick={nextSlide}>›</button>

        {/* DOTS */}
        <div className={styles.dots}>
          {[0, 1, 2].map(idx => (
            <button 
              key={idx}
              className={`${styles.navDot} ${activeSlide === idx ? styles.navDotActive : ''}`} 
              onClick={() => setActiveSlide(idx)}
              style={{
                borderColor: activeSlide === 1 ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.4)',
                backgroundColor: activeSlide === idx ? (activeSlide === 1 ? '#000' : '#c9a84c') : 'transparent'
              }}
            ></button>
          ))}
        </div>
      </section>

      {/* FEATURES BAR */}
      <section className={styles.featuresBar}>
        <div className={styles.featureItem}>
          <div className={styles.featureIcon}>🚚</div>
          <h4 className={styles.featureTitle}>Free Shipping</h4>
          <p className={styles.featureDesc}>On all orders over $200. Fast and reliable delivery.</p>
        </div>
        <div className={styles.featureItem}>
          <div className={styles.featureIcon}>🕐</div>
          <h4 className={styles.featureTitle}>Support 24/7</h4>
          <p className={styles.featureDesc}>Contact us anytime. Our team is always ready to help.</p>
        </div>
        <div className={styles.featureItem}>
          <div className={styles.featureIcon}>💰</div>
          <h4 className={styles.featureTitle}>Money Return</h4>
          <p className={styles.featureDesc}>30-day return policy. No questions asked.</p>
        </div>
      </section>

      {/* DYNAMIC PRODUCTS */}
      <section className={styles.newArrivals}>
        {/* Loading state */}
        {loading && (
          <>
            <div className={styles.sectionHeader}>
              <h2>Loading products...</h2>
              <div className={styles.underline}></div>
            </div>
            {renderSkeletons()}
          </>
        )}

        {/* Featured Section */}
        {!loading && strictFeatured.length > 0 && (
          <div style={{ marginBottom: '60px' }}>
            <div className={styles.sectionHeader}>
              <h2>Featured Products</h2>
              <Link to="/shop" className={styles.seeAllLink}>See All →</Link>
            </div>
            <div className={styles.underline} style={{margin: '0 auto 16px', width: '40px', height: '2px', background: '#222'}}></div>
            <p style={{textAlign: 'center', marginBottom: '40px', color: '#888'}}>Discover our latest collection of premium fashion items.</p>
            
            <div className={styles.productsGrid}>
              {strictFeatured.map(product => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                />
              ))}
            </div>
          </div>
        )}

        {/* Recommended Section */}
        {!loading && strictRecommended.length > 0 && (
          <div style={{ marginBottom: '60px' }}>
            <div className={styles.sectionHeader}>
              <h2>Recommended for You</h2>
              <Link to="/shop" className={styles.seeAllLink}>See All →</Link>
            </div>
            <div className={styles.underline} style={{margin: '0 auto 16px', width: '40px', height: '2px', background: '#222'}}></div>
            <p style={{textAlign: 'center', marginBottom: '40px', color: '#888'}}>Handpicked selections based on current trends.</p>

            <div className={styles.productsGrid}>
              {strictRecommended.map(product => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                />
              ))}
            </div>
          </div>
        )}

        {/* New Arrivals (Regular) Section */}
        {!loading && regularProducts.length > 0 && (
          <div>
            <div className={styles.sectionHeader}>
              <h2>New Arrivals</h2>
              <Link to="/shop" className={styles.seeAllLink}>See All →</Link>
            </div>
            <div className={styles.underline} style={{margin: '0 auto 16px', width: '40px', height: '2px', background: '#222'}}></div>
            <p style={{textAlign: 'center', marginBottom: '40px', color: '#888'}}>Explore our newest additions to the store.</p>
            
            <div className={styles.productsGrid}>
              {regularProducts.map(product => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                />
              ))}
            </div>
          </div>
        )}

        {/* Empty state — only if truly no products in Firestore */}
        {!loading && allProducts.length === 0 && (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>👗</div>
            <h3 className={styles.emptyTitle}>No products yet</h3>
            <p className={styles.emptyText}>Products added from the Admin Panel will appear here.</p>
          </div>
        )}
      </section>

      {/* OUR BLOG */}
      <section className={styles.blogSection}>
        <div className={styles.blogHeader}>
          <div className={styles.blogLabel}>— OUR BLOG —</div>
          <Link to="/blog" className={styles.viewAllBlog}>View All Posts →</Link>
        </div>
        <div className={styles.blogGrid}>
          {blogPosts.slice(0, 3).map(post => (
            <Link key={post.id} to={`/blog/${post.id}`} className={styles.blogCard}>
              <div className={styles.blogImageArea}>
                <img 
                  src={post.image} 
                  alt={post.title} 
                  className={styles.blogCardImage}
                  loading="lazy"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.style.background = post.bg || 'linear-gradient(135deg, #f0f0f0, #e0e0e0)';
                  }}
                />
                {/* Keep category badge on top of image */}
                <span className={styles.blogCategoryBadge} style={{ background: post.categoryColor }}>
                  {post.category}
                </span>
                {/* Keep read time badge on top of image */}
                <span className={styles.blogReadTimeBadge}>
                  ⏱ {post.readTime}
                </span>
              </div>
              <div className={styles.blogBody}>
                <div className={styles.blogDate}>{post.date}</div>
                <h3 className={styles.blogTitle}>{post.title}</h3>
                <p className={styles.blogExcerpt}>{post.excerpt}</p>
                <div className={styles.blogFooter}>
                  <div className={styles.blogAuthorRow}>
                    <div className={styles.authorAvatar}>{post.author.charAt(0)}</div>
                    <span className={styles.authorName}>By {post.author}</span>
                  </div>
                  <span className={styles.readMoreLink}>Read More <span className={styles.readMoreArrow}>→</span></span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
