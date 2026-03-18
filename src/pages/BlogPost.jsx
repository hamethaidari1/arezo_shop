import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { blogPosts } from './Blog';
import styles from './BlogPost.module.css';

const BlogPost = () => {
  const { id } = useParams();
  const post = blogPosts.find(p => p.id === parseInt(id));

  // scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!post) {
    return (
      <div className={styles.notFound}>
        <h2>Article not found</h2>
        <Link to="/blog">Return to blog</Link>
      </div>
    );
  }

  const relatedPosts = blogPosts.filter(p => p.id !== post.id).slice(0, 2);

  const content = [
    `When it comes to ${post.category.toLowerCase()}, the rules of fashion are continually evolving. What began as a rigid set of guidelines has transformed into a fluid exploration of personal identity and expression. This season, designers are pushing boundaries by combining unexpected textures with classic silhouettes, creating a visual language that speaks simultaneously to nostalgia and the future. Whether you're stepping into an office or walking down the street, your environment is your runway.`,
    `The key to mastering this aesthetic lies in balance. Oversized garments must be paired with structured counterpoints, and monochromatic moments should be punctuated with a single bold accessory. Too often, people equate comfort with sloppiness, but the truest form of contemporary luxury is apparel that moves harmoniously with the human body while maintaining a sharp, confident edge. The architecture of a garment is just as important as the fabric it's cut from.`,
    `Furthermore, the industry's shift towards mindful consumption changes how we interact with our closets. Investing in high-quality, versatile items rather than fleeting micro-trends ensures longevity in wear. A perfectly tailored blazer, a meticulous pair of trousers, or a heritage leather bag serves as a foundational pillar for endless experimentation. Layering becomes an art form when the underlying canvas is flawless.`,
    `As you navigate your own style journey, remember that the most compelling outfits are worn with authentic assurance. You don't just wear clothes; you inhabit them. Experiment with proportions, play with contrast, and never underestimate the power of thoughtful detailing. True elegance is an attitude, and the right wardrobe is simply the medium through which you express it.`
  ];

  return (
    <div className={styles.container}>
      {/* HEADER */}
      <header className={styles.header} style={{ background: post.bg }}>
        <div className={styles.overlay}></div>
        <div className={styles.headerContent}>
          <span className={styles.badge} style={{ background: post.categoryColor }}>{post.category}</span>
          <h1 className={styles.title}>{post.title}</h1>
          <div className={styles.metaRow}>
            <div className={styles.authorAvatar}>{post.author.charAt(0)}</div>
            <span>By {post.author}</span>
            <span className={styles.dot}>•</span>
            <span>{post.date}</span>
          </div>
        </div>
      </header>

      {/* BODY */}
      <article className={styles.article}>
        <div className={styles.articleMetaRow}>
          <span>{post.readTime}</span>
          <span className={styles.dot}>•</span>
          <span>Published {post.date}</span>
        </div>
        
        {content.map((paragraph, index) => (
          <p key={index} className={styles.paragraph}>{paragraph}</p>
        ))}

        <div className={styles.divider}></div>

        {/* SHARE */}
        <div className={styles.socialShare}>
          <span className={styles.shareText}>Share this post:</span>
          <div className={styles.shareBtns}>
            <button className={`${styles.shareBtn} ${styles.fbBtn}`}>Facebook</button>
            <button className={`${styles.shareBtn} ${styles.twBtn}`}>Twitter</button>
            <button className={`${styles.shareBtn} ${styles.piBtn}`}>Pinterest</button>
          </div>
        </div>
      </article>

      {/* RELATED */}
      <section className={styles.relatedSection}>
        <h3 className={styles.relatedHeading}>You Might Also Like</h3>
        <div className={styles.relatedGrid}>
          {relatedPosts.map(rel => (
            <Link key={rel.id} to={`/blog/${rel.id}`} className={styles.blogCard}>
              <div className={styles.blogImageArea} style={{ background: rel.bg }}>
                <span className={styles.blogCategory} style={{ background: rel.categoryColor }}>
                  {rel.category}
                </span>
                <span className={styles.blogReadTime}>⏱ {rel.readTime}</span>
              </div>
              <div className={styles.blogBody}>
                <div className={styles.blogDate}>{rel.date}</div>
                <h3 className={styles.blogTitle}>{rel.title}</h3>
                <p className={styles.blogExcerpt}>{rel.excerpt}</p>
                <div className={styles.blogFooter}>
                  <div className={styles.blogAuthorRow}>
                    <div className={styles.authorAvatar}>{rel.author.charAt(0)}</div>
                    <span className={styles.authorName}>By {rel.author}</span>
                  </div>
                  <span className={styles.readMoreLink}>
                    Read More <span className={styles.readMoreArrow}>→</span>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default BlogPost;
