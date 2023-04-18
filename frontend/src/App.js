import logo from './logo.svg';
import './App.css';

import { Route, Routes } from "react-router-dom"
import Login from './auth/Login';
import Menu from './admin/menu_ui/Menu';
import Accounts from './admin/account_management/Accounts';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/admin/menu" element={<Menu />} />
      <Route path="/admin/accounts" element={<Accounts />} />
    </Routes>
  );
}

export default App;
