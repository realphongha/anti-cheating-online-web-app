import React, { useState, useEffect, useRef } from 'react';
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { getFirstName } from '../utils/String';
import {localStorageGetObj, localStorageSetObj} from "../utils/Storage";
import Dexie from 'dexie';

const Header = (props) => {
  const [name, setName] = useState(null);
  const [avatar, setAvatar] = useState(null);

  useEffect(() => {
    let user = localStorageGetObj("currentUser");
    setName(user.name);
    if (user.avatar) {
      setAvatar(`data:image/jpeg;base64,${user.avatar["$binary"].base64}`);
    }
  }, [])

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
          {avatar ?
            <img className="avatar" src={avatar}/>
            :
            <FontAwesomeIcon icon={faUser} className="avatarImg" />
          }
        </Link>
      </div>
      <p className="welcomeText">Xin chào, {getFirstName(name, "vn")}!</p>
      <Link to="/" style={{
        textDecoration: 'none',
        color: 'inherit'
      }}>
        <FontAwesomeIcon icon={faRightFromBracket} className="logoutImg" 
          onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("currentUser");
            Dexie.delete("db");
          }} />
      </Link>
    </header>
  )
}

export default Header;