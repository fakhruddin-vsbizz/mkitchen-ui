import React, { useContext, useEffect, useState } from "react";
import {
  Row,
  Col,
  Image,
  Divider,
  Radio,
  Card,
  Input,
  Button,
  Alert,
  ConfigProvider,
  Modal,
} from "antd";
import axios from "axios";
import AuthContext from "../components/context/auth-context";
import { useNavigate, useParams } from "react-router-dom";
import DeshboardBg from "../res/img/DeshboardBg.png";
import whiteLogo from "../res/img/MKWhiteLogo.png";
import logo from "../res/img/logo.png";
import { CheckCircleFilled, CheckOutlined } from "@ant-design/icons";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalText, setModalText] = useState("Content of the modal");
  const [error, setError] = useState(false);

  const [validationError, setValidationError] = useState(false);
  const [emailError, setEmailError] = useState(false);

  const { id } = useParams();

  const handleOk = () => {
    setModalText("The modal will be closed after two seconds");
    setConfirmLoading(true);
    // setTimeout(() => {
    //   setOpen(false);
    //   setConfirmLoading(false);
    // }, 2000);
    authCtx.logout();
    navigate("/");
  };
  const handleCancel = () => {
    setOpen(false);
  };

  const authCtx = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (confirmPassword !== newPassword) {
      setError(true);
    }
    if (confirmPassword === newPassword) {
      setError(false);
    }
  }, [confirmPassword, newPassword]);

  const handleResetSubmit = async (e) => {
    e.preventDefault();

    if (confirmPassword === "" || newPassword === "" || id === "") {
      setValidationError(true);
      return;
    }
    if (error === false) {
      try {
        const data = await fetch(
          "/api/admin/account_management/update_password",
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              password: confirmPassword,
              email: id,
            }),
          }
        );
        if (data) {
          setError(false);
          setOpen(true);

          // authCtx.logout();
          // navigate("/");
        }
      } catch (error) {
        console.error(error);
        alert("Password reset email failed to send.");
      }
    }
  };

  return (
    // <form onSubmit={handleResetSubmit}>
    //   <label>
    //     New Password:
    //     <input
    //       type="password"
    //       value={newPassword}
    //       onChange={(e) => setNewPassword(e.target.value)}
    //     />
    //   </label>
    //   <button type="submit">Reset Password</button>
    // </form>
    <div
      style={{
        margin: 0,
        padding: 0,
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
        <form onSubmit={handleResetSubmit}>
          <Row style={{ height: "100% " }}>
            <Col xs={24} xl={12} style={{ padding: "5%" }}>
              <center>
                <Image width={"100%"} preview={false} src={logo} />
                <Divider
                  plain
                  style={{
                    backgroundColor: "orange",
                    height: 5,
                    borderRadius: 20,
                  }}
                ></Divider>
              </center>
            </Col>
            <Col xs={24} xl={12} style={{ padding: "5%" }}>
              <label style={{ height: 150, textAlign: "center" }}></label>
              <Card
                bordered={true}
                style={{
                  width: "100%",
                  border: "2px solid #e08003",
                  marginTop: 20,
                }}
                className="dongle-font-class"
              >
                <table
                  style={{ width: "100%", height: "50vh", fontSize: "150%" }}
                  className="dongle-font-class"
                >
                  <center>
                    <Image
                      width={"40%"}
                      preview={false}
                      src={whiteLogo}
                      style={{ filter: "invert(3)", margin: "50px 30px" }}
                    />
                  </center>
                  <center style={{ width: "100%", marginBottom: -50 }}>
                    <tr
                      style={{
                        textAlign: "left",
                        height: "6vh",
                        marginBottom: 10,
                      }}
                    >
                      <td>Password:</td>
                      <td style={{ width: "8vw" }}>
                        <Input.Password
                          value={newPassword}
                          style={{ width: "24vw" }}
                          type="password"
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="input password"
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
                      <td>Confirm Password:</td>
                      <td style={{ width: "8vw" }}>
                        <Input.Password
                          value={confirmPassword}
                          style={{ width: "24vw" }}
                          type="password"
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="input password"
                        />
                      </td>
                    </tr>
                    {error && (
                      <tr>
                        <td colSpan={2}>
                          <br />
                          <Alert
                            style={{ margin: "0.5rem" }}
                            message="Validation Error"
                            description=" password do not match. Please try again"
                            type="error"
                            closable
                          />
                        </td>
                      </tr>
                    )}
                    {validationError && (
                      <tr>
                        <td colSpan={2}>
                          <br />
                          <Alert
                            style={{ margin: "0.5rem" }}
                            message="Validation Error"
                            description="All the fields are required"
                            type="error"
                            closable
                          />
                        </td>
                      </tr>
                    )}
                    <tr
                      style={{
                        textAlign: "left",
                        height: "10vh",
                        paddingTop: 30,
                      }}
                    >
                      <td colSpan={2}>
                        <center>
                          <button
                            type="submit"
                            style={{
                              marginTop: "2%",
                              backgroundColor: "orange",
                              fontSize: "90%",
                              borderWidth: 0,
                              borderRadius: 5,
                              padding: "5px 15px",
                              color: "white",
                            }}
                          >
                            Reset Password
                          </button>
                        </center>
                      </td>
                    </tr>
                  </center>
                </table>
              </Card>
            </Col>
          </Row>
        </form>
        <Modal
          title=<h3>
            <CheckCircleFilled
              style={{ color: "green", fontSize: 28, marginRight: 10 }}
            />
            Password Reset Successfully
          </h3>
          open={open}
          okText="Login"
          onOk={handleOk}
          confirmLoading={confirmLoading}
          onCancel={handleCancel}
        >
          <p>Go to login page and login with new password</p>
        </Modal>
      </ConfigProvider>
    </div>
  );
};

export default ResetPassword;
