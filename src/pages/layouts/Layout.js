import { Outlet, Link } from "react-router-dom";

const Layout = () => {
  return (
    <div className="web-app">
      <div className="body">
        <Outlet />
      </div>
    </div>
  )
}

export default Layout;