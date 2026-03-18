import React, { useState } from 'react';
import styles from './FAQ.module.css';

const faqs = [
  { q: "What is your return policy?", a: "We offer a 30-day return policy for all unworn items with original tags attached. Refunds are processed to the original payment method." },
  { q: "How long does shipping take?", a: "Standard shipping takes 3-5 business days. Express shipping takes 1-2 business days. International shipping can take up to 14 days depending on the destination." },
  { q: "Do you ship internationally?", a: "Yes, we ship to most countries worldwide. International shipping rates are calculated at checkout." },
  { q: "How do I track my order?", a: "Once your order ships, you will receive an email with a tracking number and a link to track your package." },
  { q: "What payment methods do you accept?", a: "We accept Visa, MasterCard, American Express, PayPal, and Apple Pay." },
  { q: "Can I change or cancel my order?", a: "Orders can be modified or canceled within 1 hour of placement. After that, the order is processed and cannot be changed." },
  { q: "How do I care for my garments?", a: "Each item has specific care instructions on its label. Generally, we recommend washing in cold water and air drying to preserve the fabric." },
  { q: "Do you offer gift wrapping?", a: "Yes! You can select the gift wrapping option at checkout for an additional $5 fee." }
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleOpen = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className={styles.faqPage}>
      <div className={styles.hero}>
        <h1>Frequently Asked Questions</h1>
      </div>
      
      <div className={styles.container}>
        <div className={styles.accordion}>
          {faqs.map((faq, index) => (
            <div key={index} className={`${styles.item} ${openIndex === index ? styles.open : ''}`}>
              <button className={styles.question} onClick={() => toggleOpen(index)}>
                {faq.q}
                <span className={styles.icon}>{openIndex === index ? '−' : '+'}</span>
              </button>
              <div className={styles.answerWrapper} style={{ maxHeight: openIndex === index ? '200px' : '0' }}>
                <p className={styles.answer}>{faq.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQ;
