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
import AddIngridientsInventory from "./components/Inventory/AddIngridientsInventory";
import Inventory from "./procurement_inventory/Inventory";
import Purchases from "./procurement_inventory/purchases/Purchases";
import NewPurchase from "./procurement_inventory/purchases/NewPurchase";
import ConfirmIng from "./procurement_inventory/current_menu/ConfirmIng";
import PostConfirmOps from "./procurement_inventory/current_menu/PostConfirmOps";
import Vendors from "./procurement_inventory/vendors/Vendors";
import NewVendor from "./procurement_inventory/vendors/NewVendor";
import VendorPurchase from "./procurement_inventory/vendors/VendorPurchase";
import DamagedGoodsList from "./procurement_inventory/damaged_goods/DamagedGoodsList";
function App() {
  return (
    <AuthContextProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/admin/menu" element={<Menu />} />
        <Route path="/admin/account_management" element={<Accounts />} />
        <Route path="/admin/verifyvendor" element={<VerifyVendor />} />
        <Route path="/cooking/ingredients" element={<SetMenu />} />
        <Route path="/cooking/cookfood" element={<Cooking />} />
        {/* <Route path="/inventory/addinventory" element={<AddIngridientsInventory />} /> */}
        <Route path="/cooking/dispatch" element={<Dispatch />} />
        <Route path="/pai/inventory" element={<Inventory />} />
        <Route path="/pai/purchases" element={<Purchases />} />
        <Route path="/pai/purchases/new" element={<NewPurchase />} />
        <Route path="/pai/procurement/" element={<ConfirmIng />} />
        <Route path="/pai/procurement/post" element={<PostConfirmOps />} />
        <Route path="/pai/vendors/" element={<Vendors />} />
        <Route path="/pai/vendors/new" element={<NewVendor />} />
        <Route path="/pai/vendors/purchases" element={<VendorPurchase />} />
        <Route path="/pai/expiries" element={<DamagedGoodsList />} />

      </Routes>
    </AuthContextProvider>
  );
}

export default App;
