import { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock } from '@fortawesome/free-solid-svg-icons';
import * as constants from '../utils/Constants';
import { Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);

  return (
    <div className="loginBox">
      <FontAwesomeIcon icon={faLock} color={constants.darkBlue}/>
      <h1>Online Exam<br /> Anti-cheating</h1>
      <form className="loginForm">
        <input className="inputText" type="text"
          placeholder="Email"
          value={email} onChange={t => setEmail(t.target.value)} /><br />
        <input className="inputText" type="password"
          placeholder="Password"
          value={password} onChange={t => setPassword(t.target.value)} /><br />
        <Link to="/supervisor/classes">
          <input className="inputBtn" type="submit" 
            value="Log in" style={{width: "50%"}}/><br />
          </Link>
        <Link to="/register">
          <input className="inputBtn" type="button" 
            value="Register" style={{width: "50%"}}/>
        </Link>
      </form>
    </div>
  )
}

export default Login;