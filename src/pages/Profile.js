import { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { Link } from "react-router-dom";
import {localStorageGetObj, localStorageSetObj} from "../utils/Storage";
import ImageUploading from 'react-images-uploading';
import { UserApi } from "../api/UserApi";
import * as constants from "../utils/Constants";
import { message } from "react-message-popup";

const Profile = (props) => {
  const [avatar, setAvatar] = useState(null);
  const [email, setEmail] = useState(null);
  const [name, setName] = useState(null);
  const [phone, setPhone] = useState(null);
  const [newAvatar, setNewAvatar] = useState(false);

  useEffect(() => {
    let user = localStorageGetObj("currentUser");
    setEmail(user.email);
    setName(user.name);
    setPhone(user.phone);
    if (user.avatar) {
      setAvatar([{data_url: `data:image/jpeg;base64,${user.avatar["$binary"].base64}`}]);
    }
  }, [])

  const onChangeAvatar = (image, addUpdateList) => {
    console.log(image, addUpdateList);
    setAvatar(image);
    setNewAvatar(true);
  }

  const onSaveAvatar = async () => {
    try{
      let res = await UserApi.changeAvatar(
        localStorage.getItem("token"), avatar[0].file
      );
      if (res.data){
        localStorageSetObj("currentUser", res.data);
        message.info("Đổi ảnh đại diện thành công!", 4000);
        setNewAvatar(false);
      } else {
        message.error("Đổi ảnh đại diện không thành công. Vui lòng thử lại!", 
          4000);
      }
    } catch (err) {
      console.log(err);
      if (err.response && (err.response.status === 400)) {
        message.error(err.response.data.message, 4000);
        console.log(err.response.data.message);
      } else {
        message.error("Lỗi server", 4000);
        console.log("Internal error");
      }
    }
  }

  return (
    <div className="profile">
      <div className="avatarNameCard">
      <ImageUploading
        value={avatar}
        onChange={onChangeAvatar}
        dataURLKey="data_url"
        maxFileSize={constants.MAX_SIZE_AVATAR}
      >
        {({
          imageList,
          onImageUpload,
          onImageRemoveAll,
          onImageUpdate,
          onImageRemove,
          isDragging,
          dragProps,
          errors
        }) => (
          // write your building UI
          <div className="upload__image-wrapper">
            {avatar?
            <img className="newAvatar" src={avatar[0]['data_url']}/>
            :
            <FontAwesomeIcon icon={faUser} />
            }
            <br/>
            <button
              style={isDragging ? { color: 'red' } : undefined}
              onClick={onImageUpload}
              {...dragProps}
            >
              Đổi ảnh đại diện
            </button>
            {
            newAvatar &&
            <button onClick={() => {
              onImageRemove(0);
              setAvatar(null);
              setNewAvatar(false);
            }}>
              Hủy
            </button>
            }
            {
            newAvatar && 
            <button onClick={() => onSaveAvatar()}>
              Lưu
            </button>
            }
            {
            errors && <div>
              {errors.maxFileSize && 
              <span style={{color: "red"}}>Kích thước file vượt quá 1MB</span>
              }  
            </div>
            }
          </div>
        )}
      </ImageUploading>
        <br />
        <p>{name}</p>
      </div>
      <div className="profileCard">
        <div className="profileInfo">
          <div className="profileLabel">
            <p>Họ tên</p>
            <p>Email</p>
            <p>Số điện thoại</p>
          </div>
          <div className="profileData">
            <p>{name}</p>
            <p>{email}</p>
            <p>{phone}</p>
          </div>
        </div>
        <div className="editProfileBtn">
          <Link to="/profile/edit">
            <button type="button">
              Sửa thông tin
            </button>
          </Link>
          <Link to="/profile/changePassword">
            <button type="button">
              Đổi mật khẩu
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Profile;