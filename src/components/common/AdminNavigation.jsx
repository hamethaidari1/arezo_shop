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
          <div style={{display:'flex',alignItems:'center',gap:'4px'}}>
            <span style={{fontFamily:"'Playfair Display',serif",fontSize:"1.1rem",fontWeight:"700",color:"#c9a84c",letterSpacing:"3px"}}>AREZO</span>
            <span style={{fontFamily:"'Playfair Display',serif",fontSize:"1.1rem",fontWeight:"400",fontStyle:"italic",color:"rgba(255,255,255,0.9)",letterSpacing:"2px"}}>Shop</span>
          </div>
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
