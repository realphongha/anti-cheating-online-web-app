import * as React from 'react';
import { AppBar } from 'react-admin';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';

const ReactAdminHeader = (props) => (
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
  </AppBar>
);

export default ReactAdminHeader;