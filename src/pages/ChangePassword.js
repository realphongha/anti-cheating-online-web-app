import { useState } from "react";

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState(null);
  const [newPassword, setNewPassword] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState(null);

  return (
    <div className="registerBox">
      <h1>Change password</h1>
      <form className="registerForm">
        <input className="inputText" type="password"
          placeholder="Old password"
          value={oldPassword} onChange={t => setOldPassword(t.target.value)} /><br />
        <input className="inputText" type="password"
          placeholder="New password"
          value={newPassword} onChange={t => setNewPassword(t.target.value)} /><br />
        <input className="inputText" type="password"
          placeholder="Confirm password"
          value={confirmPassword} onChange={t => setConfirmPassword(t.target.value)} /><br />
        <input className="inputBtn" type="submit"
          value="Save" style={{ width: "50%" }} />
      </form>
    </div>
  )
}

export default ChangePassword;