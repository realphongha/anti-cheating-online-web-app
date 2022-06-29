import { useState, useEffect } from "react";
import './css/common.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './pages/layouts/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';
import ChangePassword from './pages/ChangePassword';
import ClassesSupervisor from './pages/supervisor/ClassesSupervisor';
import Home from "./pages/Home";
import AdminManagement from './pages/AdminManagement';
import Exam from './pages/supervisor/Exam';
import { UserApi } from "./api/UserApi";
import * as constants from "./utils/Constants";
import {localStorageGetObj, localStorageSetObj} from "./utils/Storage";

const ProtectedRoute = ({element, allow, redirect}) => {
  if (allow.includes("all") && localStorageGetObj("currentUser")) {
    return element;
  } else if (allow.includes("admin") && 
    localStorageGetObj("currentUser")?.role === constants.USER_ROLE_ADMIN){
    return element;
  } else if (allow.includes("supervisor") &&
    localStorageGetObj("currentUser")?.role === constants.USER_ROLE_SUPERVISOR){
    return element;
  }
  return <Navigate to={redirect} replace />;
} 

const App = () => {

  useEffect(() => {
    let token = localStorage.getItem("token");
    if (token) {
      getCurrentUser(token);
    }
  }, []);

  const getCurrentUser = async (token) => {
    try {
      let res = await UserApi.getCurrentUser(token);
      if (res.data) {
        localStorageSetObj("currentUser", res.data);
      }
    } catch {
      localStorage.removeItem("token");
      localStorage.removeItem("currentUser");
    }
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout header={false} />}>
          <Route index element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Route>
        <Route path="/" element={<Layout header={true} />}>
          <Route path="/profile" element={
            <ProtectedRoute element={<Profile />} redirect={"/login"}
              allow={["all"]} />
          } />
          <Route path="/profile/edit" element={
            <ProtectedRoute element={<EditProfile />} redirect={"/login"}
              allow={["all"]} />
          } />
          <Route path="/profile/changePassword" element={
            <ProtectedRoute element={<ChangePassword />} redirect={"/login"} 
              allow={["all"]} />
          } />
          <Route path="/supervisor/exam" element={
            <ProtectedRoute element={<Exam />} 
              allow={["supervisor"]} 
              redirect={"/login"}/>
          } />
        </Route>
        <Route path="/supervisor/classes/*" element={
          <ProtectedRoute element={<ClassesSupervisor />} 
            allow={["supervisor"]} 
            redirect={"/"}/>
        } />
        <Route path="/admin/*" element={
          // loi o day
          <ProtectedRoute element={<AdminManagement />} 
            allow={["admin"]} 
            redirect={"/"}/>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
