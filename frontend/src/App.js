import logo from "./logo.svg";
import "./App.css";

import { Route, Routes } from "react-router-dom";
import Login from './auth/Login';
import Menu from './admin/menu_ui/Menu';
import Accounts from './admin/account_management/Accounts';
import VerifyVendor from './admin/vendor_management/VerifyVendor';
import SetMenu from './cooking/SetMenu';

import { AuthContextProvider } from "./components/context/auth-context";
import Cooking from "./cooking/Cooking";
import Dispatch from "./cooking/Dispatch";
function App() {
  return (
    <AuthContextProvider>
      {" "}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/admin/menu" element={<Menu />} />
        <Route path="/admin/account_management" element={<Accounts />} />
        <Route path="/admin/verifyvendor" element={<VerifyVendor />} />
        <Route path="/cooking/ingredients" element={<SetMenu />} />
        <Route path="/cooking/cookfood" element={<Cooking />} />
        <Route path="/cooking/dispatch" element={<Dispatch />} />
      </Routes>
    </AuthContextProvider>
  );
}

export default App;
