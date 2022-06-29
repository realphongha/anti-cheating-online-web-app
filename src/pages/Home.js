import { useEffect } from "react";
import * as constants from '../utils/Constants';
import { useNavigate } from "react-router-dom";
import {localStorageGetObj} from "../utils/Storage";

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    let currentUser = localStorageGetObj("currentUser");
    if (!currentUser) {
      navigate("/login"); 
    } else if (currentUser.role === constants.USER_ROLE_ADMIN) {
      navigate("/admin");
    } else if (currentUser.role === constants.USER_ROLE_SUPERVISOR) {
      navigate("/supervisor/classes");
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("currentUser");
      navigate("/login");
    }
  }, []);

  return (
    <></>
  )
}

export default Home;