import { useState } from "react";
import { UserApi } from "../api/UserApi";
import { message } from "react-message-popup";
import {localStorageSetObj, localStorageGetObj} from "../utils/Storage";
import { useNavigate } from "react-router-dom";

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();

  const onChangePassword = async () => {
    try {
      let res = await UserApi.editCurrentUser(
        localStorage.getItem("token"), null, 
        oldPassword, newPassword, confirmPassword, 
        null, null, null
      );
      console.log(res);
      message.info("Đổi mật khẩu thành công!", 4000);
      navigate("/profile");
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
      <h1>Đổi mật khẩu</h1>
      <form className="registerForm">
        <input className="inputText" type="password"
          placeholder="Mật khẩu cũ"
          value={oldPassword} onChange={t => setOldPassword(t.target.value)} /><br />
        <input className="inputText" type="password"
          placeholder="Mật khẩu mới"
          value={newPassword} onChange={t => setNewPassword(t.target.value)} /><br />
        <input className="inputText" type="password"
          placeholder="Xác nhận mật khẩu"
          value={confirmPassword} onChange={t => setConfirmPassword(t.target.value)} /><br />
        <input className="inputBtn" type="button"
          onClick={() => onChangePassword()}
          value="Lưu" style={{ width: "50%" }} />
      </form>
    </div>
  )
}

export default ChangePassword;