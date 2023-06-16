import React, { useContext, useEffect, useState } from "react";
import './login.css'
import {
  Row,
  Col,
  Image,
  // Divider,
  // Radio,
  Card,
  Input,
  Button,
  Alert,
  ConfigProvider,
  Modal,
} from "antd";

import logo from "../res/img/logo.png";
import axios from "axios";
import AuthContext from "../components/context/auth-context";
import { Link, useNavigate } from "react-router-dom";
// import DeshboardBg from "../res/img/DeshboardBg.png";
// import whiteLogo from "../res/img/MKWhiteLogo.png";
import { CheckCircleFilled } from "@ant-design/icons";
import { colorBlack, colorGreen } from "../colors";
import { baseURL } from "../constants";

const Login = () => {
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const [email, setUserEmail] = useState("");

  const [passwordResetEmail, setPasswordResetEmail] = useState("");
  const [passwordResetEmailError, setPasswordResetEmailError] = useState(false);
  const [linkSent, setLinkSent] = useState(false);
  const [userNotRegisteredError, setUserNotRegisteredError] = useState(false);

  const [password, setUserPassword] = useState("");
  const [error, setError] = useState(false);

  const authCtx = useContext(AuthContext);
  const navigate = useNavigate();

  const options = [
    {
      label: "Admin",
      value: 0,
    },
    {
      label: "P&I",
      value: 1,
    },
    {
      label: "Cooking",
      value: 2,
    },
    {
      label: "superadmin",
      value: 4,
    },
  ];

  useEffect(()=>{
    const unset = setTimeout(() => {
      setError(false)
    }, 3000);

    return () => clearTimeout(unset)

  },[error])

  /**************Restricting Admin Route************************* */

  useEffect(() => {
    const type = localStorage.getItem("type");

    if (!type) {
      navigate("/");
    }

    const typeAdmin = type === "mk admin" ? true : false;
    const typeSuperAdmin = type === "mk superadmin" ? true : false;

    if (typeSuperAdmin) {
      navigate("/admin/menu");
    }
    if (typeAdmin) {
      navigate("/admin/menu");
    }
    if (!typeAdmin && type && type === "Cooking") {
      navigate("/cooking/ingredients");
    }
    if (!typeAdmin && type && type === "Procurement Inventory") {
      navigate("/pai/inventory");
    }
  }, [navigate]);

  /**************Restricting Admin Route************************* */

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/login", {
        email,
        password,
      });
      setUserEmail("");
      setUserPassword("");

      const userType = response.data.user.usertype;
      const userEmail = response.data.user.email;
      const userId = response.data.user._id;

      // convert expiration time to a Date object

      const expirationTime = new Date(
        new Date().getTime() + response.data.expiresIn * 1000
      );

      authCtx.login(response.data.accessToken, expirationTime.toISOString());

      //setting the user type using context
      authCtx.setUserRoleType(userType, userEmail, userId);

      navigate("/admin/account_management");
      if (userType === "Cooking") {
        navigate("/cooking/ingredients");
      }
      if (userType === "Procurement Inventory") {
        navigate("/pai/inventory");
      }
      if (userType === "mk admin") {
        navigate("/admin/menu");
      }
      if (userType === "mk superadmin") {
        navigate("/admin/menu");
      }
    } catch (error) {
      console.error(error);
      setUserEmail("");
      setUserPassword("");
      setError(true);
    }
  };

  const handlePasswordReset = async () => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    let testEmail = emailRegex.test(passwordResetEmail);

    if (passwordResetEmail === "" || testEmail !== true) {
      setPasswordResetEmailError(true);
      return;
    }

    const data = await fetch("/api/admin/reset_password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: passwordResetEmail,
      }),
    });
    if (data) {
      const res = await data.json();
      if (res.error) {
        setUserNotRegisteredError(true);
        setPasswordResetEmailError(false);
      } else {
        setPasswordResetEmailError(false);
        setUserNotRegisteredError(false);
        setLinkSent(true);
        setOpen(false);
      }
    }
  };

  return (
    <div
      style={{
        margin: 0,
        padding: 0,
        height: "100vh",
        backgroundRepeat: "no-repeat",
        backgroundSize: "100%",
      }}
    >
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: colorGreen,
            colorDanger: "",
          },
        }}
      >
        <Modal
          title={<h3>
            <CheckCircleFilled
              style={{ color: "green", fontSize: 28, marginRight: 10 }}
            />
            Reset Password
          </h3>}
          open={open}
          okText="Reset Password"
          onOk={handlePasswordReset}
          confirmLoading={confirmLoading}
          onCancel={(e) => setOpen(false)}
        >
          <Input
            value={passwordResetEmail}
            style={{ width: "24vw" }}
            onChange={(e) => setPasswordResetEmail(e.target.value)}
            placeholder="your email here...."
            allowClear
          />
          <p>Enter your email and click on reset password</p>
          {passwordResetEmailError && (
            <tr>
              <td colSpan={2}>
                <br />
                <Alert
                  style={{ margin: "0.5rem" }}
                  message="Validation Error"
                  description="Invalid Email Or Password"
                  type="error"
                  closable
                  onClose={() => setError(false)}
                />
              </td>
            </tr>
          )}
          {userNotRegisteredError && (
            <tr>
              <td colSpan={2}>
                <br />
                <Alert
                  style={{ margin: "0.5rem" }}
                  message="Validation Error"
                  description="Email dont exists"
                  onClose={() => setError(false)}
                  type="error"
                  closable
                />
              </td>
            </tr>
          )}
        </Modal>
        <Row style={{ height: "100vh", flexDirection: 'column' }}>
          {/* <Col xs={24} xl={6}>
              <Image width="40%" preview={false} src={logo} />
              <Divider
                plain
                style={{
                  backgroundColor: "orange",
                  height: 5,
                  borderRadius: 20,
                }}
              ></Divider>
             <Radio.Group
              defaultValue={0}
              // size="small"
              style={{ marginTop: 16 }}
            >
              <Radio.Button value={0} className="ubuntu-font-class">
                Admin
              </Radio.Button>
              <Radio.Button value={1} className="ubuntu-font-class">
                P&I
              </Radio.Button>
              <Radio.Button value={2} className="ubuntu-font-class">
                Cooking
              </Radio.Button>
            </Radio.Group> 

          </Col> */}
          <Col xs={24} xl={24} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            {linkSent && (
              <h3>
                <CheckCircleFilled
                  style={{ color: "green", fontSize: 28, marginRight: 10 }}
                />
                Password Reset Link Shared To your Email
              </h3>
            )}
            <Card
              bordered={true}
              bodyStyle={{padding: "0 0 24px"}}
              style={{
                width: "50%",
                maxWidth: '650px',
                // border: "2px solid darkred",
                boxShadow: '1px 1px 4px 4px lightgray',
                backgroundColor: '#fff',
                // marginTop: 50,
              }}
              className="dongle-font-class"
            >
              {/* <label style={{ fontSize: "200%" }}>
              Login using respective credentials:
            </label>
            <Divider style={{ backgroundColor: "#000" }}></Divider> */}
              <table
                style={{ width: "100%", minHeight: "38vh", fontSize: "150%" }}
                className="dongle-font-class"
              >
                {/* <Image width={"50%"} preview={false} src={logo} /> */}
                <center>
                  <Image
                    width="35%"
                    preview={false}
                    src={logo}
                    style={{ margin: "0" }}
                  />
                </center>
                <center style={{ width: "100%", marginBottom: -10 }}>
                  <tr
                    style={{
                      textAlign: "left",
                      height: "6vh"
                    }}
                  >
                    <td style={{ width: "65px",fontSize: '2rem', verticalAlign: 'bottom' }}>Email:</td>
                    <td>
                      <Input
                        value={email}
                        style={{ width: "24vw", height: '2.4rem', border: `1px solid ${colorBlack}`, borderRadius: '5px' }}
                        onChange={(e) => setUserEmail(e.target.value)}
                        placeholder="your email here...."
                        allowClear
                      />
                    </td>
                  </tr>
                  <tr
                    style={{
                      textAlign: "left",
                      height: "6vh",
                      marginBottom: 10,
                    }}
                  >
                    <td style={{fontSize: '2rem', paddingRight: '1rem', verticalAlign: 'bottom'}}>Password:</td>
                    <td style={{ width: "8vw" }}>
                      <Input.Password
                        value={password}
                        style={{ width: "24vw", height: '2.4rem', border: `1px solid ${colorBlack}`, borderRadius: '5px' }}
                        onChange={(e) => setUserPassword(e.target.value)}
                        placeholder="input password"
                      />
                    </td>
                  </tr>
                  <tr
                    style={{
                      textAlign: "left",
                      height: "3vh",
                      paddingTop: 30,
                    }}
                  >
                    <td colSpan={2}>
                      <Button
                        onClick={handleLogin}
                        type="primary"
                        className="dongle-font-class"
                        style={{
                          marginTop: "2%",
                          // backgroundColor: "#801801",
                          fontSize: "1.8rem",
                          height: '45px'
                        }}
                        block
                      >
                        Authenticate
                      </Button>
                    </td>
                  </tr>
                  <Link style={{color: colorGreen, fontSize: '1.5rem'}} onClick={(e) => setOpen(true)}>
                    Forget Password
                  </Link>
                </center>
              </table>
            </Card>
            {error && (
              <div style={{width: '100%', display: "flex", alignItems: 'center', justifyContent: "center"}}>
                <Alert
                  onClose={() => setError(false)}
                  style={{ margin: "1rem 0.5rem 0.5rem", width: '16%' }}
                  message="Validation Error"
                  description="Invalid Email Or Password"
                  type="error"
                  closable
                />
              </div>
              )}
          </Col>
        </Row>
      </ConfigProvider>
    </div>
  );
};

export default Login;
