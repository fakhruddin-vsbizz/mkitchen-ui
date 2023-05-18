import {
  FileOutlined,
  PieChartOutlined,
  UnorderedListOutlined,
  ShopOutlined,
  TeamOutlined,
  MenuOutlined,
  HistoryOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { Breadcrumb, Layout, Menu, theme, ConfigProvider, Button } from "antd";
import { useState } from "react";
import Logo from "../../res/img/MKWhiteLogo.png";
import LogoMin from "../../res/img/MKWhiteLogoMin.png";
import { Link } from "react-router-dom";

const { Sider } = Layout;
function getItem(label, key, icon, children, link) {
  return {
    key,
    icon,
    children,
    label,
    link,
  };
}

const logoutHandler = () => {
  console.log("In auth Logout");
  localStorage.removeItem("token");

  localStorage.removeItem("type");
  localStorage.removeItem("email");
  localStorage.removeItem("expirationTime");

  localStorage.removeItem("user_id");

  window.location.href = "/login";

  console.log("In auth Logout");
};
const admin = [
  getItem(
    <Link to="/admin/menu">Today's Menu</Link>,
    "1",
    <Link to="/admin/menu">
      <UnorderedListOutlined style={{ fontSize: "20px" }} />
    </Link>
  ),
  getItem(
    <Link to="/admin/menu/history">History</Link>,
    "2",
    <Link to="/admin/menu/history">
      <HistoryOutlined style={{ fontSize: "20px" }} />
    </Link>
  ),
  getItem(
    <Link to="/admin/account_management">Accounts</Link>,
    "3",
    <Link to="/admin/account_management">
      <TeamOutlined style={{ fontSize: "20px" }} />
    </Link>
  ),
  getItem(
    <Link to="/admin/verifyvendor">Vendor</Link>,
    "4",
    <Link to="/admin/verifyvendor">
      <ShopOutlined style={{ fontSize: "20px" }} />
    </Link>
  ),
];
const cooking = [
  getItem(
    <Link to="/cooking/ingredients">Set Ingredient</Link>,
    "1",
    <Link to="/cooking/ingredients">
      <UnorderedListOutlined style={{ fontSize: "20px" }} />
    </Link>
  ),
  getItem(
    <Link to="/cooking/cookfood">Cooking Food</Link>,
    "2",
    <Link to="/cooking/cookfood">
      <HistoryOutlined style={{ fontSize: "20px" }} />
    </Link>
  ),
  getItem(
    <Link to="/cooking/dispatch">Dispatch</Link>,
    "3",
    <Link to="/cooking/dispatch">
      <TeamOutlined style={{ fontSize: "20px" }} />
    </Link>
  ),
];
const pai = [
  getItem(
    <Link to="/pai/inventory">Inventory</Link>,
    "1",
    <Link to="/pai/inventory">
      <UnorderedListOutlined style={{ fontSize: "20px" }} />
    </Link>
  ),
  getItem(
    <Link to="/pai/purchases">Purchases</Link>,
    "2",
    <Link to="/pai/purchases">
      <HistoryOutlined style={{ fontSize: "20px" }} />
    </Link>
  ),
  getItem(
    <Link to="/pai/procurement">Procurement</Link>,
    "3",
    <Link to="/pai/procurement">
      <TeamOutlined style={{ fontSize: "20px" }} />
    </Link>
  ),
  getItem(
    <Link to="/pai/vendors">Vendor</Link>,
    "4",
    <Link to="/pai/vendors">
      <ShopOutlined style={{ fontSize: "20px" }} />
    </Link>
  ),
  getItem(
    <Link to="/pai/expiries">Expiries</Link>,
    "5",
    <Link to="/pai/expiries">
      <ShopOutlined style={{ fontSize: "20px" }} />
    </Link>
  ),
];
const logout = [
  getItem(
    <span onClick={logoutHandler}>Logout</span>,
    "1",
    <Link onClick={logoutHandler}>
      <LogoutOutlined style={{ fontSize: "20px" }} />
    </Link>
  ),
];
const SideNav = ({ k, userType }) => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Layout
      style={{
        minHeight: "100vh",
      }}
    >
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "orange",
            colorSecondary: "red",
          },
        }}
      >
        <Sider
          style={{ backgroundColor: "orange" }}
          collapsible
          collapsed={collapsed}
          onCollapse={(value) => setCollapsed(value)}
        >
          <div
            style={{
              height: 32,
              margin: 16,
              // background: 'red',
            }}
          >
            {collapsed ? (
              <img src={LogoMin} style={{ width: 40 }} />
            ) : (
              <img src={Logo} style={{ width: 140, marginBottom: 10 }} />
            )}
          </div>
          {/* 
          {items.map((item) => (
            <Link to={item.link}>
              <p>{item.label}</p>
            </Link>
          ))} */}

          <Menu
            theme="light "
            defaultSelectedKeys={[k]}
            style={{
              backgroundColor: "transparent",
              marginTop: 32,
              color: "white",
              fontSize: 16,
              fontWeight: 500,
            }}
            mode="inline"
            items={
              userType == "admin"
                ? admin
                : userType == "cooking"
                ? cooking
                : userType == "pai"
                ? pai
                : null
            }
          />
          <Menu
            theme="light "
            defaultSelectedKeys={[k]}
            style={{
              backgroundColor: "transparent",
              // marginTop: 32,
              color: "white",
              fontSize: 16,
              fontWeight: 500,
            }}
            mode="inline"
            items={logout}
          />
        </Sider>
      </ConfigProvider>
      {/* <Menu/> */}
    </Layout>
  );
};
export default SideNav;
