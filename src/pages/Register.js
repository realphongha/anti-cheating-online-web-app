import { useState } from "react";
import { UserApi } from "../api/UserApi";
import { useNavigate } from "react-router-dom";
import { message } from "react-message-popup";

const Register = () => {
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState(null);
  const [name, setName] = useState(null);
  const [phone, setPhone] = useState(null);
  const navigate = useNavigate();

  const onRegister = async () => {
    try {
      let res = await UserApi.register(
        email, password, confirmPassword, name, phone
      );
      message.info("Đăng ký thành công. Vui lòng đăng nhập!", 
        4000);
        navigate("/login");
    } catch (err) {
      console.log(err);
      if (err.response && err.response.status === 400) {
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
      <h1>Đăng ký</h1>
      <form className="registerForm">
        <input className="inputText" type="text"
          placeholder="Email"
          value={email} onChange={t => setEmail(t.target.value)} /><br />
        <input className="inputText" type="password"
          placeholder="Mật khẩu"
          value={password} onChange={t => setPassword(t.target.value)} /><br />
        <input className="inputText" type="password"
          placeholder="Xác nhận mật khẩu"
          value={confirmPassword} onChange={t => setConfirmPassword(t.target.value)} /><br />
        <input className="inputText" type="text"
          placeholder="Họ tên"
          value={name} onChange={t => setName(t.target.value)} /><br />
        <input className="inputText" type="text"
          placeholder="Số điện thoại"
          value={phone} onChange={t => setPhone(t.target.value)} /><br />
        <input className="inputBtn" type="button"
          onClick={() => onRegister()}
          value="Đăng ký" style={{ width: "50%" }} />
      </form>
    </div>
  )
}

export default Register;