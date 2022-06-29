import { useContext, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock } from '@fortawesome/free-solid-svg-icons';
import * as constants from '../utils/Constants';
import { Link, useNavigate } from "react-router-dom";
import { UserApi } from "../api/UserApi";
import { message } from "react-message-popup";
import {localStorageGetObj, localStorageSetObj} from "../utils/Storage";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const onLogin = async () => {
    try {
      let res = await UserApi.login(email, password);
      let data = res.data;
      let role = data.user.role;
      if (role === constants.USER_ROLE_ADMIN) {
        localStorage.setItem("token", data.token);
        localStorageSetObj("currentUser", data.user);
        navigate("/admin");
      } else if (role === constants.USER_ROLE_SUPERVISOR) {
        localStorage.setItem("token", data.token);
        localStorageSetObj("currentUser", data.user);
        navigate("/supervisor/classes");
      } else {
        message.error("Vui lòng đăng nhập bằng tài khoản giám thị hoặc quản trị viên!", 4000);
      }
    } catch (err) {
      console.log(err);
      if (err.response && (err.response.status === 400 || err.response.status === 401)) {
        message.error(err.response.data.message, 4000);
        console.log(err.response.data.message);
      } else {
        message.error("Lỗi server", 4000);
        console.log("Internal error");
      }
    }
  }

  return (
    <div className="loginBox">
      <FontAwesomeIcon icon={faLock} color={constants.darkBlue} />
      <h1>Online Exam<br /> Anti-cheating</h1>
      <form className="loginForm">
        <input className="inputText" type="text"
          placeholder="Email" required
          value={email} onChange={t => setEmail(t.target.value)} /><br />
        <input className="inputText" type="password"
          placeholder="Password" required
          value={password} onChange={t => setPassword(t.target.value)} /><br />
        <input className="inputBtn" type="button" onClick={() => onLogin()}
          value="Đăng nhập" style={{ width: "50%" }} /><br />
        <Link to="/register">
          <input className="inputBtn" type="button"
            value="Đăng ký" style={{ width: "50%" }} />
        </Link>
      </form>
    </div>
  )
}

export default Login;