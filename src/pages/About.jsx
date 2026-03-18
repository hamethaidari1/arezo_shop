import React from 'react';
import styles from './About.module.css';

const About = () => {
  return (
    <div className={styles.aboutPage}>
      <div className={styles.hero}>
        <h1>About Clarity.</h1>
        <p>We believe everyone deserves to see the world in style.</p>
      </div>

      <div className={styles.storySection}>
        <div className={styles.storyImage}></div>
        <div className={styles.storyText}>
          <h2>Our Story</h2>
          <p>Founded in 2026, Clarity started with a simple vision: to create premium fashion that doesn't compromise on quality or sustainability. We travel the globe to source the finest materials and work with artisans who share our passion for excellence.</p>
          <p>Every piece in our collection is thoughtfully designed to be both timeless and contemporary. We believe that true style is about confidence and comfort, which is why our garments are made to fit perfectly and last for years to come.</p>
          <p>Join us on our journey to redefine modern fashion.</p>
        </div>
      </div>

      <div className={styles.teamSection}>
        <h2 className={styles.sectionTitle}>Meet Our Team</h2>
        <div className={styles.teamGrid}>
          {[
            { name: "Jane Doe", title: "Founder & CEO" },
            { name: "John Smith", title: "Head of Design" },
            { name: "Sarah Lee", title: "Creative Director" }
          ].map((member, i) => (
            <div key={i} className={styles.teamCard}>
              <div className={styles.avatar}></div>
              <h3>{member.name}</h3>
              <p>{member.title}</p>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.valuesSection}>
        <h2 className={styles.sectionTitle}>Our Values</h2>
        <div className={styles.valuesGrid}>
          {[
            { title: "Quality", desc: "Premium materials and craftsmanship." },
            { title: "Sustainability", desc: "Eco-friendly practices in everything we do." },
            { title: "Style", desc: "Timeless designs for the modern wardrobe." },
            { title: "Service", desc: "Customer satisfaction is our top priority." }
          ].map((value, i) => (
            <div key={i} className={styles.valueCard}>
              <div className={styles.valueIcon}>✨</div>
              <h3>{value.title}</h3>
              <p>{value.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default About;
