import React, { useState, useEffect, useRef } from 'react';
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';

const Header = (props) => {
  return (
    <header className="header">
      <div className="logoText">
        <Link to="/" style={{
          textDecoration: 'none',
          color: 'inherit'
        }}>
          <p>Online Exam Anti-cheating</p>
        </Link>
      </div>
      <div className="avatar">
        <Link to="/profile" style={{
          textDecoration: 'none',
          color: 'inherit'
        }}>
          {props.avatar ?
            <FontAwesomeIcon icon={faUser} className="avatarImg" />
            :
            <FontAwesomeIcon icon={faUser} className="avatarImg" />
          }
        </Link>
      </div>
      <p className="welcomeText">Welcome, Diana!</p>
      <Link to="/" style={{
        textDecoration: 'none',
        color: 'inherit'
      }}>
        <FontAwesomeIcon icon={faRightFromBracket} className="logoutImg" />
      </Link>
    </header>
  )
}

export default Header;