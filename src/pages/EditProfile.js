import { useState } from "react";

const EditProfile = () => {
  const [email, setEmail] = useState(null);
  const [name, setName] = useState(null);
  const [phone, setPhone] = useState(null);

  return (
    <div className="registerBox">
      <h1>Edit profile</h1>
      <form className="registerForm">
        <input className="inputText" type="text"
          placeholder="Email"
          value={email} onChange={t => setEmail(t.target.value)} /><br />
        <input className="inputText" type="text"
          placeholder="Full name"
          value={name} onChange={t => setName(t.target.value)} /><br />
        <input className="inputText" type="text"
          placeholder="Phone number"
          value={phone} onChange={t => setPhone(t.target.value)} /><br />
        <input className="inputBtn" type="submit"
          value="Save" style={{ width: "50%" }} />
      </form>
    </div>
  )
}

export default EditProfile;