import { useState } from "react";

const Register = () => {
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState(null);
  const [name, setName] = useState(null);
  const [phone, setPhone] = useState(null);

  return (
    <div className="registerBox">
      <h1>Register</h1>
      <form className="registerForm">
        <input className="inputText" type="text"
          placeholder="Email"
          value={email} onChange={t => setEmail(t.target.value)} /><br />
        <input className="inputText" type="password"
          placeholder="Password"
          value={password} onChange={t => setPassword(t.target.value)} /><br />
        <input className="inputText" type="pasword"
          placeholder="Confirm password"
          value={confirmPassword} onChange={t => setConfirmPassword(t.target.value)} /><br />
        <input className="inputText" type="text"
          placeholder="Full name"
          value={name} onChange={t => setName(t.target.value)} /><br />
        <input className="inputText" type="text"
          placeholder="Phone number"
          value={phone} onChange={t => setPhone(t.target.value)} /><br />
        <input className="inputBtn" type="submit"
          value="Register" style={{ width: "50%" }} />
      </form>
    </div>
  )
}

export default Register;