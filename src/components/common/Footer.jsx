import * as Route from '@/constants/routes';
import React from 'react';
import { useLocation } from 'react-router-dom';

const Footer = () => {
  const { pathname } = useLocation();

  const visibleOnlyPath = [
    Route.HOME,
    Route.SHOP
  ];

  return !visibleOnlyPath.includes(pathname) ? null : (
    <footer className="footer">
      <div className="footer-col-1">
        <strong>
          <span>
            Developed by
            {' '}
            <a href="https://github.com/jgudo">JULIUS GUEVARRA</a>
          </span>
        </strong>
      </div>
      <div className="footer-col-2">
        <div style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "1.2rem",
          fontWeight: "700",
          color: "#c9a84c",
          letterSpacing: "3px"
        }}>
          AREZO <span style={{fontStyle:"italic", fontWeight:"400", color:"rgba(10,10,10,0.85)"}}>Shop</span>
        </div>
        <h5>
          &copy;&nbsp;
          {new Date().getFullYear()}
        </h5>
      </div>
      <div className="footer-col-3">
        <strong>
          <span>
            Fork this project &nbsp;
            <a href="https://github.com/jgudo/ecommerce-react">HERE</a>
          </span>
        </strong>
      </div>
    </footer>
  );
};

export default Footer;
