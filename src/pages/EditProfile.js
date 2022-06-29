import { useState, useEffect } from "react";
import { UserApi } from "../api/UserApi";
import { message } from "react-message-popup";
import { localStorageSetObj, localStorageGetObj } from "../utils/Storage";
import { useNavigate } from "react-router-dom";

const EditProfile = () => {
  const [email, setEmail] = useState(null);
  const [name, setName] = useState(null);
  const [phone, setPhone] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    let user = localStorageGetObj("currentUser");
    setEmail(user.email);
    setName(user.name);
    setPhone(user.phone);
  }, []);

  const onEditProfile = async () => {
    try {
      let res = await UserApi.editCurrentUser(
        localStorage.getItem("token"), email, null, null, null, 
        name, phone, null
      );
      if (res.data){
        localStorageSetObj("currentUser", res.data);
        message.info("Sửa thông tin thành công!", 4000);
        navigate("/profile");
      } else {
        message.error("Sửa thông tin không thành công. Vui lòng thử lại!", 
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
    <div className="registerBox">
      <h1>Sửa thông tin</h1>
      <form className="registerForm">
        <input className="inputText" type="text"
          placeholder="Email"
          value={email} onChange={t => setEmail(t.target.value)} /><br />
        <input className="inputText" type="text"
          placeholder="Họ tên"
          value={name} onChange={t => setName(t.target.value)} /><br />
        <input className="inputText" type="text"
          placeholder="Số điện thoại"
          value={phone} onChange={t => setPhone(t.target.value)} /><br />
        <input className="inputBtn" type="button"
          onClick={() => onEditProfile()}
          value="Lưu" style={{ width: "50%" }} />
      </form>
    </div>
  )
}

export default EditProfile;