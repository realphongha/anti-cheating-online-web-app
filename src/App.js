import './css/common.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HeaderLayout from './pages/layouts/HeaderLayout';
import Layout from './pages/layouts/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';
import ChangePassword from './pages/ChangePassword';
import ClassesSupervisor from './pages/supervisor/ClassesSupervisor';
import Exam from './pages/supervisor/Exam';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>
        <Route path="/" element={<HeaderLayout />}>
          <Route path="profile" element={<Profile />} />
          <Route path="/profile/edit" element={<EditProfile />} />
          <Route path="/profile/changePassword" element={<ChangePassword />} />
          <Route path="/exam" element={<Exam />} />
        </Route>
        <Route path="/supervisor/classes/*" element={<ClassesSupervisor />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
