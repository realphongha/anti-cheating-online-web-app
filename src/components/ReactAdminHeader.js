import * as React from 'react';
import { AppBar } from 'react-admin';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { getFirstName } from '../utils/String';
import {localStorageGetObj, localStorageSetObj} from "../utils/Storage";
import Dexie from 'dexie';

const ReactAdminHeader = (props) => {
  const [name, setName] = React.useState(null);
  const [avatar, setAvatar] = React.useState(null);

  React.useEffect(() => {
    let user = localStorageGetObj("currentUser");
    setName(user.name);
    if (user.avatar){
      setAvatar(`data:image/jpeg;base64,${user.avatar["$binary"].base64}`);
    }
  }, [])

  return (
    <AppBar
      position='sticky'
      sx={{
        "& .RaAppBar-title": {
          flex: 1,
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          overflow: "hidden",
        },
      }}
      {...props}
    >
      <div className="logoTextRA">
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
          }}/>
      </Link>
    </AppBar>
  )
};

export default ReactAdminHeader;