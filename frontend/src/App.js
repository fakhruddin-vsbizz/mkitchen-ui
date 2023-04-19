import logo from './logo.svg';
import './App.css';

import { Route, Routes } from "react-router-dom"
import Login from './auth/Login';
import Menu from './admin/menu_ui/Menu';
import Accounts from './admin/account_management/Accounts';
import VerifyVendor from './admin/vendor_management/VerifyVendor';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/admin/menu" element={<Menu />} />
      <Route path="/adduser" element={<Accounts />} />
      <Route path="/admin/verifyvendor" element={<VerifyVendor />} />
    </Routes>
  );
}

export default App;
