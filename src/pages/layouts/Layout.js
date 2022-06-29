import { Outlet, Link } from "react-router-dom";
import Header from "../../components/Header";

const HeaderLayout = (props) => {
  return (

    <div className="web-app">
      {props.header && localStorage.getItem("currentUser") &&
      <Header avatar={props.avatar}/>
      }
      <div className="body">
        <Outlet />
      </div>
    </div>
  )
}

export default HeaderLayout;