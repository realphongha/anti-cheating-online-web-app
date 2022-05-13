import { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { Link } from "react-router-dom";

const Profile = () => {
  const [avatar, setAvatar] = useState(null);

  const onChangeAvatar = () => {
    console.log("change avatar");
  }

  return (
    <div className="profile">
      <div className="avatarNameCard">
        {avatar?
        <FontAwesomeIcon icon={faUser} />
        :
        <FontAwesomeIcon icon={faUser} />
        }
        <br />
        <button type="button" onClick={() => onChangeAvatar()}>
          Change avatar
        </button>
        <p>Diana Kyle</p>
      </div>
      <div className="profileCard">
        <div className="profileInfo">
          <div className="profileLabel">
            <p>Name</p>
            <p>Email</p>
            <p>Phone</p>
          </div>
          <div className="profileData">
            <p>Diana Kyle</p>
            <p>diana1@example.com</p>
            <p>0964542452</p>
          </div>
        </div>
        <div className="editProfileBtn">
          <Link to="/profile/edit">
            <button type="button">
              Edit profile
            </button>
          </Link>
          <Link to="/profile/changePassword">
            <button type="button">
              Change password
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Profile;