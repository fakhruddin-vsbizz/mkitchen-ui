import React, { useContext, useState } from "react";
import { Row, Col, Image, Divider, Radio, Card, Input, Button, ConfigProvider } from "antd";

import logo from "../res/img/logo.png";
import axios from "axios";
import AuthContext from "../components/context/auth-context";
import { useNavigate } from "react-router-dom";
import DeshboardBg from "../res/img/DeshboardBg.png";
import whiteLogo from "../res/img/MKWhiteLogo.png";

const Login = () => {
  const [email, setUserEmail] = useState("");
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
  ];

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5001/login", {
        email,
        password,
      });
      setUserEmail("");
      setUserPassword("");

      console.log(response);

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

      console.log(expirationTime);
      console.log(authCtx.userEmail);
      console.log(authCtx.userType);

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
    } catch (error) {
      console.error(error);
      console.log(error.message);

      setUserEmail("");
      setUserPassword("");
      setError(true);
    }
  };

  return (
    <div
      style={{
        margin: 0,
        padding: 0,
        backgroundImage: `url(${DeshboardBg})`,
        height: "100vh ",
        backgroundRepeat: "no-repeat",
        backgroundSize: "100%",
      }}
    >
      <ConfigProvider
              theme={{
                token: {
                  colorPrimary: "orange",
                  colorDanger: "",
                },
              }}
            >

      <Row style={{ height: "100% " }}>
        <Col xs={24} xl={12} style={{ padding: "5%" }}>
          <center>
            <Image width={"100%"} preview={false} src={logo} />
            <Divider plain style={{ backgroundColor: "orange", height: 5, borderRadius: 20 }}></Divider>
            {/* <Radio.Group
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
            </Radio.Group> */}
          </center>
        </Col>
        <Col xs={24} xl={12} style={{ padding: "5%" }}>
          <label style={{height: 150, textAlign: 'center' }}>
          </label>
          <Card
            bordered={true}
            style={{
              width: "100%",
              border: "2px solid #e08003",
              marginTop: 20,
            }}
            className="dongle-font-class"
          >
            {/* <label style={{ fontSize: "200%" }}>
              Login using respective credentials:
            </label>
            <Divider style={{ backgroundColor: "#000" }}></Divider> */}
            <table
              style={{ width: "100%", height: "50vh", fontSize: "150%" }}
              className="dongle-font-class"
            >
              {/* <Image width={"50%"} preview={false} src={logo} /> */}
              <center>
                <Image
                  width={"40%"}
                  preview={false}
                  src={whiteLogo}
                  style={{ filter: "invert(3)", margin: "50px 30px" }}
                />
              </center>
              <center style={{ width: "100%",  marginBottom: -50 }}>
                <tr style={{ textAlign: "left",height: '6vh', marginBottom: 10 }}>
                  <td style={{ width: "8vw" }}>Email:</td>
                  <td>
                    <Input
                      value={email}
                      style={{ width: "24vw" }}
                      onChange={(e) => setUserEmail(e.target.value)}
                      placeholder="your email here...."
                      allowClear
                    />
                  </td>
                </tr>
                <tr style={{ textAlign: "left",height: '6vh', marginBottom: 10 }}>
                  <td>Password:</td>
                  <td style={{ width: "8vw" }}>
                    <Input.Password
                      value={password}
                      style={{ width: "24vw" }}
                      onChange={(e) => setUserPassword(e.target.value)}
                      placeholder="input password"
                    />
                  </td>
                </tr>
       
                {error && (
                  <tr>
                    <h2
                      style={{
                        color: "red",
                      }}
                    >
                      Invalid Email Or Password
                    </h2>
                  </tr>
                )}
                <tr style={{ textAlign: "left",height: '10vh', paddingTop: 30 }}>
                  <td colSpan={2}>
                    <Button
                      onClick={handleLogin}
                      type="primary"
                      className="dongle-font-class"
                      style={{
                        marginTop: "2%",
                        // backgroundColor: "#801801",
                        fontSize: "100%",
                      }}
                      block
                    >
                      Authenticate
                    </Button>
                  </td>
                </tr>
              </center>
            </table>
          </Card>
        </Col>
      </Row>
      </ConfigProvider>
    </div>
  );
};

export default Login;
