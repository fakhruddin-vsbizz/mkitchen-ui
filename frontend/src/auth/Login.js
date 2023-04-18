import React, { useState } from "react";
import { Row, Col, Image, Divider, Radio, Card, Input, Button } from "antd";

import logo from "../res/img/logo.png";
import axios from "axios";

const Login = () => {
  const [email, setUserEmail] = useState("");
  const [password, setUserPassword] = useState("");
  const [error, setError] = useState(false);

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
      console.log(response.data.accessToken);
    } catch (error) {
      console.error(error);
      console.log(error.message);
      setError(true);
    }
  };

  return (
    <div>
      <Row>
        <Col xs={24} xl={12} style={{ padding: "5%" }}>
          <center>
            <Image width={250} preview={false} src={logo} />
            <Divider plain style={{ backgroundColor: "#000" }}></Divider>
            <Radio.Group
              defaultValue={0}
              size="small"
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
          </center>
        </Col>
        <Col xs={24} xl={12} style={{ padding: "5%" }}>
          <Card
            bordered={true}
            style={{ width: "100%", border: "2px solid #FF3003" }}
            className="dongle-font-class"
          >
            <label style={{ fontSize: "200%" }}>
              Login using respective credentials:
            </label>
            <Divider style={{ backgroundColor: "#000" }}></Divider>
            <table
              style={{ width: "100%", fontSize: "150%" }}
              className="dongle-font-class"
            >
              <tr>
                <td>Email:</td>
                <td>
                  <Input
                    onChange={(e) => setUserEmail(e.target.value)}
                    placeholder="your email here...."
                    allowClear
                  />
                </td>
              </tr>
              <tr>
                <td>Password:</td>
                <td>
                  <Input.Password
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
              <tr>
                <td colSpan={2}>
                  <Button
                    onClick={handleLogin}
                    type="primary"
                    className="dongle-font-class"
                    style={{
                      marginTop: "2%",
                      backgroundColor: "#801801",
                      fontSize: "100%",
                    }}
                    block
                  >
                    Authenticate
                  </Button>
                </td>
              </tr>
            </table>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Login;
