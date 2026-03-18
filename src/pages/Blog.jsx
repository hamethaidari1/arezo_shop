import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './Blog.module.css';

export const blogPosts = [
  {
    id: 1,
    category: "Lifestyle",
    categoryColor: "#e91e8c",
    title: "Top 10 Fashion Trends for Summer 2026",
    excerpt: "Discover the hottest styles taking over runways and streets this summer. From bold prints to minimalist elegance.",
    author: "Shop Admin",
    date: "March 15, 2026",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
    bg: "linear-gradient(135deg, #f8d7c4 0%, #f4a989 100%)"
  },
  {
    id: 2,
    category: "Style",
    categoryColor: "#7b2fe8",
    title: "How to Build a Minimalist Wardrobe in 2026",
    excerpt: "Less is more. Learn how to curate a capsule wardrobe that works for every occasion with just 30 key pieces.",
    author: "Shop Admin",
    date: "March 10, 2026",
    readTime: "7 min read",
    image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&q=80",
    bg: "linear-gradient(135deg, #c8e6c9 0%, #81c784 100%)"
  },
  {
    id: 3,
    category: "Guide",
    categoryColor: "#0288d1",
    title: "Accessorizing Like a Pro: The Complete Guide",
    excerpt: "The right accessories can transform any outfit. Here's everything you need to know about styling accessories.",
    author: "Shop Admin",
    date: "March 5, 2026",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&q=80",
    bg: "linear-gradient(135deg, #bbdefb 0%, #64b5f6 100%)"
  },
  { 
    id: 4, 
    category: "Lifestyle", 
    categoryColor: "#e91e8c", 
    title: "The Art of Layering: Master the Look", 
    excerpt: "Layering isn't just for cold weather. Learn how to create depth and texture in your outfits year-round.", 
    author: "Shop Admin", 
    date: "Feb 28, 2026", 
    readTime: "4 min read", 
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80",
    bg: "linear-gradient(135deg, #f8bbd0, #f48fb1)" 
  },
  { 
    id: 5, 
    category: "Guide", 
    categoryColor: "#0288d1", 
    title: "Sustainable Fashion: Shop Responsibly", 
    excerpt: "How to build a stylish wardrobe while making environmentally conscious choices. Your guide to eco fashion.", 
    author: "Shop Admin", 
    date: "Feb 20, 2026", 
    readTime: "8 min read", 
    image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&q=80",
    bg: "linear-gradient(135deg, #dcedc8, #aed581)" 
  },
  { 
    id: 6, 
    category: "Style", 
    categoryColor: "#7b2fe8", 
    title: "Color Blocking: Bold Combinations That Work", 
    excerpt: "Fear color no more. Discover the rules of color blocking and how to break them with confidence.", 
    author: "Shop Admin", 
    date: "Feb 15, 2026", 
    readTime: "5 min read", 
    image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600&q=80",
    bg: "linear-gradient(135deg, #e1bee7, #ce93d8)" 
  }
];


const Blog = () => {
  const [filter, setFilter] = useState('All');
  const [visibleCount, setVisibleCount] = useState(6);

  const categories = ['All', 'Lifestyle', 'Style', 'Guide'];

  const filteredPosts = blogPosts.filter(post => 
    filter === 'All' ? true : post.category === filter
  );

  const displayedPosts = filteredPosts.slice(0, visibleCount);

  return (
    <div className={styles.blogPage}>
      {/* PAGE HERO */}
      <section className={styles.hero}>
        <h1 className={styles.heroTitle}>Our Blog</h1>
        <p className={styles.heroSub}>Style tips, trends, and fashion guides</p>
      </section>

      {/* FILTER TABS */}
      <div className={styles.tabsContainer}>
        {categories.map(cat => (
          <button
            key={cat}
            className={`${styles.tab} ${filter === cat ? styles.activeTab : ''}`}
            onClick={() => { setFilter(cat); setVisibleCount(6); }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* BLOG GRID */}
      <div className={styles.blogWrapper}>
        <div className={styles.blogGrid}>
          {displayedPosts.map(post => (
            <Link key={post.id} to={`/blog/${post.id}`} className={styles.blogCard}>
              <div className={styles.blogImageArea} style={{ background: post.bg }}>
                <span className={styles.blogCategory} style={{ background: post.categoryColor }}>
                  {post.category}
                </span>
                <span className={styles.blogReadTime}>⏱ {post.readTime}</span>
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
                  <span className={styles.readMoreLink}>
                    Read More <span className={styles.readMoreArrow}>→</span>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {visibleCount < filteredPosts.length && (
          <div className={styles.loadMoreContainer}>
            <button className={styles.loadMoreBtn} onClick={() => setVisibleCount(prev => prev + 6)}>
              Load More
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Blog;
