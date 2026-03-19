import { ADMIN_DASHBOARD } from '@/constants/routes';
import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import UserAvatar from '@/views/account/components/UserAvatar';

const AdminNavigation = () => {
  const { isAuthenticating, profile } = useSelector((state) => ({
    isAuthenticating: state.app.isAuthenticating,
    profile: state.profile
  }));

  return (
    <nav className="navigation navigation-admin">
      <div className="logo">
          <span style={{fontFamily:"'Playfair Display',serif", fontSize:"1.1rem", fontWeight:"700", color:"#c9a84c", letterSpacing:"3px"}}>AREZO <span style={{fontStyle:"italic", fontWeight:"400", color:"#fff"}}>Shop</span></span>
      </div>
      <ul className="navigation-menu">
        <li className="navigation-menu-item">
          <UserAvatar
            isAuthenticating={isAuthenticating}
            profile={profile}
          />
        </li>
      </ul>
    </nav>
  );
};

export default AdminNavigation;
