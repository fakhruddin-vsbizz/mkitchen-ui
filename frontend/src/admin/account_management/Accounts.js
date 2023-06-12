import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import "./accounts.css";

import {
  Row,
  Col,
  List,
  Tag,
  Divider,
  Calendar,
  Card,
  Button,
  AutoComplete,
  Modal,
  Tooltip,
  Input,
  Select,
  Alert,
  Tabs,
  ConfigProvider,
} from "antd";
import { InfoCircleOutlined, PlusCircleOutlined } from "@ant-design/icons";
import DeshboardBg from "../../res/img/DeshboardBg.png";
import SideNav from "../../components/navigation/SideNav";
import Header from "../../components/navigation/Header";
import AuthContext from "../../components/context/auth-context";
import { useNavigate } from "react-router-dom";
import { colorBlack, colorGreen } from "../../colors";

const Accounts = () => {
  const [usertype, setUserType] = useState(0);
  const [username, setUserName] = useState("");

  const [email, setUserEmail] = useState("");
  const [password, setUserPassword] = useState("");

  const [error, setError] = useState(false);

  const data = ["Menu", "Process History", "Vendor Management", "Reports"];
  const [visible, setVisible] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newMohallaPopup, setNewMohallaPopup] = useState(false);
  const [mohallaUsers, setMohallaUsers] = useState();
  const [cookingDepartmentUser, setcCookingDepartmentUser] = useState();
  const [pandiDepartmentUser, setpandiDepartmentUser] = useState();

  //resetting new email and passwords state
  const [selectedCookingUser, setSelectedCookingUser] = useState();
  const [selectedPandIUser, setSelectedPandIUser] = useState();
  const [selectedMohallaUser, setSelectedMohallaUser] = useState();

  //update cooking/pandi/mohalla email state
  const [newEmailCooking, setNewEmailCooking] = useState();
  const [newEmailPandI, setNewEmailPandI] = useState();
  const [newEmailMohalla, setNewEmailMohalla] = useState();

  //update mohalla passwords state
  const [newPasswordMohalla, setNewpasswordMohalla] = useState("");
  const [newConfirmpasswordMohalla, setNewConfirmpasswordMohalla] =
    useState("");

  //update cooking passwords state
  const [newpassword, setNewpassword] = useState("");
  const [newconfirmpassword, setNewConfirmpassword] = useState("");

  //update p and i passwords state
  const [newpasswordPandI, setNewpasswordPandI] = useState("");
  const [newconfirmpasswordPandI, setNewConfirmpasswordPandI] = useState("");
  const [oldAdminPassword, setOldAdminPassword] = useState("");

  const [validationError, setValidationError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [emailErrorPI, setEmailErrorPI] = useState(false);
  const [emailErrorPandIPassword, setEmailErrorPandIPassword] = useState(false);
  const [fieldError, setFieldError] = useState(false);
  const [oldPasswordError, setOldPasswordError] = useState(false);

  const authCtx = useContext(AuthContext);
  const userId = authCtx.userEmail;
  const navigate = useNavigate();

  /**************Restricting Admin Route************************* */

  useEffect(() => {
    const type = localStorage.getItem("type");

    if (!type) {
      navigate("/");
    }

    const typeAdmin = type === "mk admin" ? true : false;

    if (typeAdmin) {
      navigate("/admin/account_management");
    }
    if (!typeAdmin && type && type === "Cooking") {
      navigate("/cooking/ingredients");
    }
    if (!typeAdmin && type && type === "Procurement Inventory") {
      navigate("/pai/inventory");
    }
  }, [navigate]);

  /**************Restricting Admin Route************************* */

  const handlepandIUser = (data, email) => {
    setSelectedPandIUser(data);
    setNewEmailPandI(email.id);
  };
  const handleCookingUser = (data, email) => {
    setSelectedCookingUser(data);
    setNewEmailCooking(email.id);
  };
  const handleUserTypeChange = (value) => {
    setUserType(value);
  };
  const showModal = (data, email) => {
    setSelectedMohallaUser(data);
    setNewEmailMohalla(email);
    setIsModalOpen(true);
  };

  const showNMModal = () => {
    setNewMohallaPopup(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
    setVisible(false); // show the popup
  };

  const handleNMOk = () => {
    setNewMohallaPopup(false);
    setUserEmail("");
    setUserPassword("");
    setUserName("");
    setError(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setVisible(false); // show the popup

    setUserEmail("");
    setUserPassword("");
    setUserName("");
    setError(false);
  };

  const handleNMCancel = () => {
    setNewMohallaPopup(false);
  };

  /*
        REFERENCE FOR BACKEND ENGINEERING
        -----------------------------------
        The variable 'options' below must come from the database and if the option isn't present must be added in automatic format'
    */
  /*******************update email****************************** */

  const updateMohallAdminEmail = async () => {
    try {
      const data = await fetch("/api/admin/account_management", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: selectedMohallaUser,
          email: newEmailMohalla,
          usertype: "Mohalla Admin",
          action: "update_email",
        }),
      });
      if (data) {
        const res = await data.json();
        if (res.message) {
          setNewEmailMohalla("");
          setIsModalOpen(false);
          setVisible(true);
          setEmailError(false);
          setValidationError(false);
        } else {
          setEmailError(true);
          setValidationError(false);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  const updateCookingDepartmentEmail = async () => {
    try {
      const data = await fetch("/api/admin/account_management", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: selectedCookingUser,
          email: newEmailCooking,
          usertype: "Cooking",
          action: "update_email",
        }),
      });
      if (data) {
        const res = await data.json();
        if (res.message) {
          setNewEmailCooking("");
          setVisible(true);
          setEmailError(false);
          setValidationError(false);
        } else {
          setEmailError(true);
          setValidationError(false);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updatePandIEmail = async () => {
    try {
      const data = await fetch("/api/admin/account_management", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: selectedPandIUser,
          email: newEmailPandI,
          usertype: "Procurement Inventory",
          action: "update_email",
        }),
      });
      if (data) {
        const res = await data.json();
        if (res.message) {
          setNewEmailPandI("");
          setVisible(true);
          setEmailErrorPI(false);
        } else {
          setEmailErrorPI(true);
          setValidationError(false);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  //////////////////////update password//////////////////////////////

  useEffect(() => {
    if (newconfirmpassword !== newpassword) {
      setError(true);
    }
    if (newconfirmpassword === newpassword) {
      setError(false);
    }
  }, [newconfirmpassword, newpassword]);

  useEffect(() => {
    if (newPasswordMohalla !== newConfirmpasswordMohalla) {
      setError(true);
    }
    if (newPasswordMohalla === newConfirmpasswordMohalla) {
      setError(false);
    }
  }, [newPasswordMohalla, newConfirmpasswordMohalla]);

  useEffect(() => {
    if (newpasswordPandI !== newconfirmpasswordPandI) {
      setEmailErrorPandIPassword(true);
    }
    if (newpasswordPandI === newconfirmpasswordPandI) {
      setEmailErrorPandIPassword(false);
    }
  }, [newpasswordPandI, newconfirmpasswordPandI]);

  const updateUserPasswordMohalla = async (usertype) => {
    console.log("updating 1");

    try {
      if (selectedMohallaUser && newConfirmpasswordMohalla) {
        console.log("updating 2");
        const data = await fetch("/api/admin/account_management", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: selectedMohallaUser,
            usertype: usertype,
            password: newConfirmpasswordMohalla,
            action: "update_password",
          }),
        });
        if (data) {
          console.log(data);
          setNewpasswordMohalla("");
          setNewConfirmpasswordMohalla("");
          setIsModalOpen(false);
          setVisible(true);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updateUserPassword = async (usertype) => {
    try {
      if (
        (selectedCookingUser || selectedPandIUser) &&
        (newconfirmpassword || newconfirmpasswordPandI) &&
        !error
      ) {
        let demoPass =
          usertype === "Cooking" ? newconfirmpassword : newconfirmpasswordPandI;
        let demoName =
          usertype === "Cooking" ? selectedCookingUser : selectedPandIUser;

        const data = await fetch("/api/admin/account_management", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: demoName,
            usertype: usertype,
            password: demoPass,
            action: "update_password",
          }),
        });
        if (data) {
          setNewConfirmpassword("");
          setNewpassword("");
          setNewpasswordPandI("");
          setNewConfirmpasswordPandI("");
          setVisible(true);
          setError(false);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const getMohallas = async () => {
      const data = await fetch("/api/admin/account_management", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          usertype: "Mohalla Admin",
          action: "get_user",
        }),
      });
      if (data) {
        console.log(data.json().then((data) => setMohallaUsers(data)));
      }
    };
    getMohallas();
  }, [newMohallaPopup]);

  useEffect(() => {
    const getCookingUsers = async () => {
      const data = await fetch("/api/admin/account_management", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ usertype: "Cooking", action: "get_user" }),
      });
      if (data) {
        console.log(
          data.json().then((data) => setcCookingDepartmentUser(data))
        );
      }
    };
    getCookingUsers();
  }, [newMohallaPopup]);

  useEffect(() => {
    const getPandIUsers = async () => {
      const data = await fetch("/api/admin/account_management", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          usertype: "Procurement Inventory",
          action: "get_user",
        }),
      });
      if (data) {
        console.log(data.json().then((data) => setpandiDepartmentUser(data)));
      }
    };
    getPandIUsers();
  }, [newMohallaPopup]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await fetch("/api/admin/account_management", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          usertype,
          username,
          email,
          password,
          action: "create_mk",
        }),
      });

      const res = await data.json();

      if (res.fieldError) {
        setValidationError(true);
        setError(false);

        setEmailError(false);
      } else if (res.errorEmail) {
        setError(false);

        setEmailError(true);
        setValidationError(false);
      } else if (res.emailExists) {
        setError(true);
        setEmailError(false);
        setValidationError(false);
      } else {
        setUserEmail("");
        setUserPassword("");
        setUserName("");
        setError(false);
        setNewMohallaPopup(false);
        setValidationError(false);
        setEmailError(false);
      }
    } catch (error) {
      console.error(error);
      console.log(error.message);
      setError(true);
      setEmailError(false);
      setValidationError(false);
    }
  };

  const [foodItems, setFoodItems] = useState([]);
  const addFoodItem = () => {
    setFoodItems([
      ...foodItems,
      document.getElementById("food-item-selected").value,
    ]);
  };

  const removeFoodItems = (subject) => {
    var old_food_item_list = foodItems;
    old_food_item_list.pop(old_food_item_list.indexOf(subject));
  };

  const updatePasswordAdmin = async () => {
    if (emailErrorPandIPassword === false) {
      const data = await fetch(
        "/api/admin/account_management/update_admin_password",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: authCtx.userEmail,
            oldPassword: oldAdminPassword,
            password: newconfirmpasswordPandI,
          }),
        }
      );
      if (data) {
        console.log(data);
        const res = await data.json();
        console.log(res);
        if (res.error) {
          setFieldError(true);
          setOldPasswordError(false);
        } else if (res.InvalidPassword) {
          setOldPasswordError(true);
          setFieldError(false);
        } else {
          setNewConfirmpassword("");
          setNewpassword("");
          setNewpasswordPandI("");
          setNewConfirmpasswordPandI("");
          setOldAdminPassword("");
          setVisible(true);
          setError(false);
          setFieldError(false);
          setOldPasswordError(false);
        }
      }
    }
  };

  



  /* ---------------------------------- Table --------------------------------- */

  return (
    <div
      style={{ margin: 0, padding: 0 }}
    >
      <div style={{ display: "flex" }}>
        <SideNav k="3" userType="admin" />
        <div style={{ width: "100%" }}>
          <Header
            title="Account Management"
            comp={<Button
            icon={<PlusCircleOutlined style={{color: colorGreen}} />}
              style={{
                // marginLeft: "60%",
                backgroundColor: "white",
                color: colorBlack,
                fontWeight: 600,

              }}
              onClick={showNMModal}
            >
              Add New MK User
            </Button>}
          />
          <ConfigProvider
            theme={{
              token: {
                colorPrimary: colorGreen,
                colorDanger: "",
              },
            }}
          >
            <Modal
              title={<h3 style={{ color: "darkred" }}>Add New Account</h3>}
              open={newMohallaPopup}
              onOk={handleNMOk}
              onCancel={handleNMCancel}
              footer={<div style={{width: "100%", display: 'flex', justifyContent: "space-evenly"}}>
              <Button style={{backgroundColor: "darkred", width: "40%"}} onClick={handleSubmit} type="primary" block>Create new Account</Button>
              <Button style={{width: "40%"}} onClick={handleNMCancel}>Cancel</Button>
              </div>}
            >
              <table style={{ width: "100%" }}>
                <tr>
                  <td colSpan={2}>
                    Select User type:<br/>
                    <Select
                      defaultValue={null}
                      style={{ width: "100%", height:'70%', borderColor:'darkred' }}
                      options={[
                        { value: "Mohalla Admin", label: "Mohalla Admin" },
                        {
                          value: "Procurement Inventory",
                          label: "Procurement Inventory",
                        },
                        { value: "Cooking", label: "Cooking" },
                      ]}
                      onChange={handleUserTypeChange}
                    />
                    <hr style={{ borderColor:'lightgrey' }}></hr>
                  </td>
                </tr>
                <tr>
                  <td>Name of the user:</td>
                  <td>
                    <Input
                      value={username}
                      placeholder="Eg: Kalimi Mohalla, Noor Baug, etc"
                      onChange={(e) => setUserName(e.target.value)}
                    />
                  </td>
                </tr>
                <tr>
                  <td>Email of the user</td>
                  <td>
                    <Input
                      value={email}
                      placeholder="Eg: juzermakki@gmail.com, hakimburhan@hotmail.com., etc"
                      onChange={(e) => setUserEmail(e.target.value)}
                    />
                  </td>
                </tr>
                <tr>
                  <td>New Password</td>
                  <td>
                    <Input.Password
                      value={password}
                      placeholder="Initial password"
                      onChange={(e) => setUserPassword(e.target.value)}
                    />
                  </td>
                </tr>
                {/* <tr>
                <td>Confirm Password</td>
                <td>
                  <Input.Password placeholder="Confirm initial password" />
                </td>
              </tr> */}
                {error && !validationError && (
                  <tr>
                    <td colSpan={2}>
                      <br />
                      <Alert
                        style={{ margin: "0.5rem" }}
                        message="Validation Error"
                        description="User already exists. Please try a different user email."
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
                        description="All Fields Must Be Filled"
                        type="error"
                        closable
                      />
                    </td>
                  </tr>
                )}
                {emailError && (
                  <tr>
                    <td colSpan={2}>
                      <br />
                      <Alert
                        style={{ margin: "0.5rem" }}
                        message="Validation Error"
                        description="Plese write the correct email"
                        type="error"
                        closable
                      />
                    </td>
                  </tr>
                )}
                {/* <tr>
                  <td colSpan={2}>
                    <br />
                    <Button style={{backgroundColor: "darkred"}} onClick={handleSubmit} type="primary" block>
                      Create new MK Account
                    </Button>
                  </td>
                </tr> */}
              </table>
            </Modal>

            <div className="" style={{ padding: 10 }}>
              <Tabs centered style={{ color: colorBlack, fontWeight: '600' }}>
                <Tabs.TabPane tab="Mohalla Accounts" key="1">
                  <div
                    style={{
                      borderWidth: 2,
                    }}
                  >
                    <label
                      style={{
                        fontSize: "130%",
                        padding: 20,
                        color: colorGreen,
                      }}
                    >
                      <b>Mohalla Accounts</b>
                    </label>

                    <Card
                    bodyStyle={{padding: "0 14px 24px 24px"}}
                      style={{
                        margin: 10,
                        overflowY: "scroll",
                        backgroundColor: "transparent",
                        height: "65vh",
                        // border: '1px 0px',
                        // borderColor: '#E86800',
                      }}
                    >
                      <List
                        dataSource={mohallaUsers}
                        renderItem={(item) => (
                          <>
                            <List.Item style={{ padding:'0px' }}>
                              <Row
                                style={{
                                  padding: 10,
                                  display: "flex",
                                  backgroundColor: "#fff",
                                  borderRadius: 5,
                                  // border: "2px solid darkred",
                                  boxShadow: '1px 1px 4px 4px lightgray',
                                  margin: "8px auto",
                                  marginBottom: "4px",
                                  width: "100%",
                                }}
                              >
                                <Col
                                  xs={24}
                                  xl={6}
                                  style={{ padding:'1%', display: 'flex', alignItems: 'center', columnGap: '3px' }}
                                >
                                  <i style={{ fontSize:'150%' }} className="fa-solid fa-house-user"></i>&nbsp;&nbsp;
                                  <label style={{ fontSize:'150%' }}>{item.username}</label>
                                </Col>
                                <Col xs={8} xl={4} style={{marginLeft: '12px', display: 'flex', flexDirection: 'column', rowGap: '5px', justifyContent: 'center'}}>
                                  <span>
                                  Verification status:
                                  </span>
                                  {item.usertype ? (
                                    <label style={{ fontSize:'120%' }}><i class="fa-solid fa-toggle-on"></i> &nbsp;&nbsp; <Tag color="green">ACTIVE</Tag></label>
                                  ) : (
                                    <label style={{ fontSize:'120%' }}><i class="fa-solid fa-toggle-off"></i> &nbsp;&nbsp; <Tag color="red">DISABLED</Tag></label>
                                  )}
                                </Col>
                                <Col xs={8} xl={6} style={{display: 'flex', flexDirection: 'column', rowGap: '5px', justifyContent: 'center'}}>
                                  <span>
                                  Email address:
                                  </span>
                                  <label style={{ fontSize:'120%' }}><i class="fa-solid fa-envelope"></i>&nbsp;&nbsp;{item.email}</label>
                                </Col>
                                <Col xs={8} xl={7} style={{display: 'flex', flexDirection: 'column', rowGap: '5px', justifyContent: 'center'}}>
                                  <span>
                                  Change Mohalla account's email and password:
                                  </span>
                                  <Button
                                    size="small"
                                    type="primary"
                                    style={{ backgroundColor: colorGreen, height:'34px' }}
                                    onClick={() =>
                                      showModal(item.username, item.email)
                                    }
                                  >
                                    <label style={{ fontSize:'120%' }}><i class="fa-solid fa-gear"></i>&nbsp;&nbsp;Manage Account</label>
                                  </Button>
                                </Col>
                              </Row>
                            </List.Item>
                          </>
                        )}
                      />
                    </Card>

                    <Modal
                      title={<h3 style={{ color: "darkred" }}>
                        Reset Password
                      </h3>}
                      open={isModalOpen}
                      onOk={handleOk}
                      onCancel={handleCancel}
                      footer={<div style={{width: "100%", display: 'flex', justifyContent: "space-evenly"}}>
              <Button style={{backgroundColor: "darkred", width: "40%"}} onClick={() => updateUserPasswordMohalla("Mohalla Admin")} type="primary" block>Change Password</Button>
              <Button style={{width: "40%"}} onClick={handleCancel}>Cancel</Button>
              </div>}
                    >
                      {/* <p>Change Email</p> */}
                      <table style={{ width: "100%" }}>
                        <tr>
                          <td style={{ width: "75%", display: 'flex', alignItems: 'baseline', columnGap: '1rem' }}>
                      <span style={{fontSize: '1.1rem'}}>Change Email: </span>
                            {/* <Input
                              value={newEmailMohalla}
                              onChange={(e) =>
                                setNewEmailMohalla(e.target.value)
                              }
                              placeholder="Enter your username"
                              suffix={
                                <Tooltip title="Change only in case needed.">
                                  <InfoCircleOutlined
                                    style={{ color: "darkred" }}
                                  />
                                </Tooltip>
                              }
                            /> */}
                            <label style={{fontSize: '1.3rem', borderBottom: '2px solid darkred' , padding: '5px 8px', borderRadius: '5px'}}>{newEmailMohalla}</label>
                          </td>
                          {/* <td style={{ width: "25%" }}>
                            <Button
                              onClick={updateMohallAdminEmail}
                              type="primary"
                            >
                              Change Email
                            </Button>
                          </td> */}
                        </tr>
                        {emailError && (
                          <tr>
                            <td colSpan={2}>
                              <br />
                              <Alert
                                style={{ margin: "0.5rem" }}
                                message="Validation Error"
                                description=" Invalid Email. Please try again"
                                type="error"
                                closable
                              />
                            </td>
                          </tr>
                        )}
                      </table>
                      <hr />
                      <table style={{ width: "100%" }}>
                        <tr>
                          <td>New Password</td>
                          <td>
                            <Input.Password
                              value={newPasswordMohalla}
                              onChange={(e) =>
                                setNewpasswordMohalla(e.target.value)
                              }
                              placeholder="New password to be set"
                            />
                          </td>
                        </tr>
                        <tr>
                          <td>Confirm Password</td>
                          <td>
                            <Input.Password
                              value={newConfirmpasswordMohalla}
                              onChange={(e) =>
                                setNewConfirmpasswordMohalla(e.target.value)
                              }
                              placeholder="Confirm new password"
                            />
                          </td>
                        </tr>
                        <tr>
                          {/* <td colSpan={2}>
                            <br />
                            <Button
                              onClick={() =>
                                updateUserPasswordMohalla("Mohalla Admin")
                              }
                              type="primary"
                              block
                            >
                              Change Password
                            </Button>
                          </td> */}
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
                      </table>
                    </Modal>
                  </div>
                </Tabs.TabPane>
                <Tabs.TabPane tab="Cooking Department" key="2">
                  <div>
                    {" "}
                    <label style={{ fontSize: "130%", padding: 20, color: colorGreen, letterSpacing: 1.1 }}>
                      <b>Cooking Department</b>
                    </label>
                    <Modal
                      open={visible}
                      onOk={handleOk}
                      onCancel={handleOk}
                      footer={[
                        <Button key="ok" type="primary" onClick={handleOk}>
                          OK
                        </Button>,
                      ]}
                    >
                      <div style={{ textAlign: "center" }}>
                        <h2 style={{ color: "#52c41a" }}>Success!</h2>
                        <p>User Detail Updated Successfully.</p>
                      </div>
                    </Modal>
                    <Row>
                      <Col
                        xs={24}
                        xl={12}
                        style={{ padding: "2%", width: "100%" }}
                      >
                        <Card
                          bordered={true}
                          style={{
                            marginTop: 10,
                            marginBottom: 20,
                            backgroundColor: "white",
                            borderRadius: 10,
                            // border: "2px solid darkred",
                            boxShadow: '1px 1px 4px 4px lightgray',
                            width: "85%",
                          }}
                        >
                          <label style={{ fontSize: '120%', color: colorBlack }}>
                            Change Email of Cooking Department
                          </label>
                          <br/>
                          <hr className="separator"></hr>
                          
                          <table style={{ width:'100%' }}>
                            <tr>
                              <td colSpan={2}>
                              <i style={{color: colorGreen}} class="fa-solid fa-user"></i> &nbsp;&nbsp;
                              
                              {cookingDepartmentUser && (
                                <Select
                                  // defaultValue={"-- SELECT USER ---"}
                                  placeholder="Select User"
                                  style={{ width: "80%", border: `1px solid ${colorBlack}`, borderRadius: '5px' }}
                                  block
                                    options={cookingDepartmentUser.map((item) => ({
                                      value: item.username,
                                      label: item.username,
                                      id: item.email,
                                    }))}
                                    onChange={(value, id) =>
                                      handleCookingUser(value, id)
                                    }
                                  />
                                )}
                                
                              </td>
                            </tr>
                            <tr><td colSpan={2}>&nbsp;</td></tr>
                            <tr>
                            <td> Current email </td>
                              <td>
                              <center><i class="fa-solid fa-envelope"></i>&nbsp;&nbsp;{newEmailCooking}</center>
                              </td>
                            </tr>
                          </table>
                          <table style={{ width: "100%" }}>
                            <tr>
                              <td style={{ width: "100%" }}>
                                <Input
                                style={{border: `1px solid ${colorBlack}`, borderRadius: '5px'}}
                                  value={newEmailCooking}
                                  onChange={(e) =>
                                    setNewEmailCooking(e.target.value)
                                  }
                                  placeholder="Type your username"
                                  suffix={
                                    <Tooltip title="Change only in case needed.">
                                      <InfoCircleOutlined
                                        style={{ color: colorGreen }}
                                      />
                                    </Tooltip>
                                  }
                                />
                              </td>
                              <td style={{ width: "100%" }}>
                                <Button
                                  onClick={updateCookingDepartmentEmail}
                                  type="primary"
                                  style={{ backgroundColor: colorGreen, marginLeft: "5px"}}
                                >
                                  Change Email
                                </Button>
                              </td>
                            </tr>
                            {emailError && (
                              <tr>
                                <td colSpan={2}>
                                  <br />
                                  <Alert
                                    style={{ margin: "0.5rem" }}
                                    message="Validation Error"
                                    description="User not selected or invalid email !!"
                                    type="error"
                                    closable
                                  />
                                </td>
                              </tr>
                            )}
                          </table>
                        </Card>
                      </Col>
                      <Col xs={24} xl={12} style={{ padding: "2%" }}>
                        <Card
                          bordered={true}
                          style={{
                            marginTop: 5,
                            marginBottom: 20,
                            padding: 5,
                            display: "flex",
                            backgroundColor: "white",
                            borderRadius: 10,
                            // border: "2px solid darkred",
                            boxShadow: '1px 1px 4px 4px lightgray',
                            width: "100%",
                          }}
                        >
                          <label style={{ fontSize: '120%', color: colorBlack}}>
                            Reset Password for cooking department
                          </label>
                          <hr className="separator"></hr>
                          <table style={{ width: "35vw" }}>
                            <tr>
                              <td style={{ width: "30%" }}>New Password</td>
                              <td style={{ width: "70%" }}>
                                <Input.Password
                                style={{border: `1px solid ${colorBlack}`, borderRadius: '5px'}}
                                  value={newpassword}
                                  onChange={(e) =>
                                    setNewpassword(e.target.value)
                                  }
                                  placeholder="New password to be set"
                                />
                              </td>
                            </tr>
                            <br/>
                            <tr>
                              <td>Confirm Password</td>
                              <td>
                                <Input.Password
                                style={{border: `1px solid ${colorBlack}`, borderRadius: '5px'}}
                                  value={newconfirmpassword}
                                  onChange={(e) =>
                                    setNewConfirmpassword(e.target.value)
                                  }
                                  placeholder="Confirm new password"
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
                                    description="Password do not match or user not selected. Please try again"
                                    type="error"
                                    closable
                                  />
                                </td>
                              </tr>
                            )}
                            <br/>
                            <tr>
                              <td></td>
                              <td>
                                <Button
                                  onClick={() => updateUserPassword("Cooking")}
                                  style={{ width: "100%", backgroundColor: colorGreen }}
                                  type="primary"
                                >
                                  Change Password
                                </Button>
                              </td>
                            </tr>
                          </table>
                        </Card>
                      </Col>
                    </Row>
                  </div>
                </Tabs.TabPane>
                <Tabs.TabPane tab="P&I Department" key="3">
                  <div>
                    <label style={{ fontSize: "130%", padding: 20, color: colorGreen }}>
                      <b>P&I Department</b>
                    </label>
                    <Row>
                      <Col xs={24} xl={12} style={{ padding: "2%" }}>
                        {/* <Card
                          bordered={true}
                          style={{
                            marginTop: 10,
                            marginBottom: 20,
                            padding: 10,
                            display: "flex",
                            backgroundColor: "white",
                            borderRadius: 10,
                            borderBottom: "2px solid orange",
                          }}
                        >
                          Select user: 
                          {pandiDepartmentUser && (
                            <Select
                              defaultValue={"select user"}
                              style={{ width: 120 }}
                              block
                              options={pandiDepartmentUser.map((item) => ({
                                value: item.username,
                                label: item.username,
                              }))}
                              onChange={(value) => setSelectedPandIUser(value)}
                            />
                          )}
                          <br />
                          <br />
                          <p>
                            <u>Change Email of P&I Department</u>
                          </p>
                          <table style={{ width: "100%" }}>
                            <tr>
                              <td>
                                <Input
                                  value={newEmailPandI}
                                  onChange={(e) =>
                                    setNewEmailPandI(e.target.value)
                                  }
                                  placeholder="Enter your username"
                                  suffix={
                                    <Tooltip title="Change only in case needed.">
                                      <InfoCircleOutlined
                                        style={{ color: "rgba(0,0,0,.45)" }}
                                      />
                                    </Tooltip>
                                  }
                                />
                              </td>
                              <td>
                                <Button
                                  onClick={updatePandIEmail}
                                  type="primary"
                                  danger
                                >
                                  Change Email
                                </Button>
                              </td>
                            </tr>
                          </table>
                        </Card> */}
                        <Card
                          bordered={true}
                          style={{
                            marginTop: 10,
                            marginBottom: 20,
                            backgroundColor: "white",
                            borderRadius: 10,
                            // border: "2px solid darkred",
                            boxShadow: '1px 1px 4px 4px lightgray',
                            width: "80%",
                          }}
                        >
                          <label style={{ fontSize: '120%', color: colorBlack }}>
                            Change Email of Cooking Department
                          </label>
                          <br/>
                          <hr className="separator"></hr>
                          <table style={{ width:'100%' }}>
                            <tr>
                              <td colspan={2}>
                                <i style={{color: colorGreen}} class="fa-solid fa-user"></i> &nbsp;&nbsp;
                                {pandiDepartmentUser && (
                              <Select
                                // defaultValue={"select user"}
                                placeholder="Select User"
                                style={{ width: "80%", border: `1px solid ${colorBlack}`, borderRadius: '5px'  }}
                                block
                                options={pandiDepartmentUser.map((item) => ({
                                  value: item.username,
                                  label: item.username,
                                  id: item.email,
                                }))}
                                onChange={(value, id) =>
                                  handlepandIUser(value, id)
                                }
                              />
                            )}
                              </td>
                            </tr>
                            <tr><td colSpan={2}>&nbsp;</td></tr>
                            <tr>
                            <td> Current email </td>
                              <td style={{ textAlign:'right' }}>
                              <i class="fa-solid fa-envelope"></i>&nbsp;&nbsp;{newEmailPandI}
                              </td>
                            </tr>
                          </table>
                          
                          


                          <table style={{ width: "100%" }}>
                            <tr>
                              <td style={{ width: "100%" }}>
                                <Input
                                style={{border: `1px solid ${colorBlack}`, borderRadius: '5px' }}
                                  value={newEmailPandI}
                                  onChange={(e) =>
                                    setNewEmailPandI(e.target.value)
                                  }
                                  placeholder="Enter your email"
                                  suffix={
                                    <Tooltip title="Change only in case needed.">
                                      <InfoCircleOutlined
                                        style={{ color: colorGreen }}
                                      />
                                    </Tooltip>
                                  }
                                />
                              </td>
                              <td style={{ width: "100%" }}>
                                <Button
                                  onClick={updatePandIEmail}
                                  type="primary"
                                  style={{ backgroundColor:colorGreen, marginLeft: "5px" }}
                                >
                                  Change Email
                                </Button>
                              </td>
                            </tr>
                            {emailErrorPI && (
                              <tr>
                                <td colSpan={2}>
                                  <br />
                                  <Alert
                                    style={{ margin: "0.5rem" }}
                                    message="Validation Error"
                                    description="User not selected or invalid email !!"
                                    type="error"
                                    closable
                                  />
                                </td>
                              </tr>
                            )}
                          </table>
                        </Card>
                      </Col>
                      <Col xs={24} xl={12} style={{ padding: "2%" }}>
                        <Card
                          bordered={true}
                          style={{
                            marginTop: 5,
                            marginBottom: 20,
                            padding: 5,
                            display: "flex",
                            backgroundColor: "white",
                            borderRadius: 10,
                            // border: "2px solid darkred",
                            boxShadow: '1px 1px 4px 4px lightgray',
                            width: "100%",
                          }}
                        >
                          <label style={{ fontSize: '120%', color: colorBlack }}>
                            Reset Password for P&I department.
                          </label>
                          <hr className="separator"></hr>
                          <table style={{ width: "35vw" }}>
                            <tr>
                              <td style={{ width: "30%" }}>New Password</td>
                              <td style={{ width: "70%" }}>
                                <Input.Password
                                style={{border: `1px solid ${colorBlack}`, borderRadius: '5px' }}
                                  value={newpasswordPandI}
                                  onChange={(e) =>
                                    setNewpasswordPandI(e.target.value)
                                  }
                                  placeholder="New password to be set"
                                />
                              </td>
                            </tr>
                            <br />
                            <tr>
                              <td>Confirm Password</td>
                              <td>
                                <Input.Password
                                style={{border: `1px solid ${colorBlack}`, borderRadius: '5px' }}
                                  value={newconfirmpasswordPandI}
                                  onChange={(e) =>
                                    setNewConfirmpasswordPandI(e.target.value)
                                  }
                                  placeholder="Confirm new password"
                                />
                              </td>
                            </tr>
                            {emailErrorPandIPassword && (
                              <tr>
                                <td colSpan={2}>
                                  <br />
                                  <Alert
                                    style={{ margin: "0.5rem" }}
                                    message="Validation Error"
                                    description="Password do not match or user not selected. Please try again"
                                    type="error"
                                    closable
                                  />
                                </td>
                              </tr>
                            )}
                            <br />
                            <tr>
                              <td></td>
                              <td>
                                <Button
                                  onClick={() =>
                                    updateUserPassword("Procurement Inventory")
                                  }
                                  style={{ width: "100%", backgroundColor: colorGreen }}
                                  type="primary"
                                >
                                  Change Password
                                </Button>
                              </td>
                            </tr>
                          </table>
                        </Card>
                      </Col>
                    </Row>
                  </div>
                </Tabs.TabPane>
                <Tabs.TabPane tab="Admin Password Reset" key="4">
                  <center>
                  <Col xs={24} xl={12} style={{ padding: "2%" }}>
                    <Card
                      bordered={true}
                      style={{
                        marginTop: 5,
                        marginBottom: 20,
                        padding: 5,
                        display: "flex",
                        backgroundColor: "white",
                        borderRadius: 10,
                        // border: "2px solid darkred",
                        boxShadow: '1px 1px 4px 4px lightgray',
                        width: "100%",
                      }}
                    >
                      <Modal
                        open={visible}
                        onOk={handleOk}
                        onCancel={handleOk}
                        footer={[
                          <Button key="ok" type="primary" onClick={handleOk}>
                            OK
                          </Button>
                        ]}
                      >
                        <div style={{ textAlign: "center" }}>
                          <h2 style={{ color: "#52c41a" }}>Success!</h2>
                          <p>User Detail Updated Successfully.</p>
                        </div>
                      </Modal>
                      <label style={{ color: colorBlack }}>
                        Admin Reset Password
                      </label>
                      <hr className="separator" />
                      <table style={{ width: "35vw" }}>
                        <tr>
                          <td style={{ width: "30%" }}>Old Password</td>
                          <td style={{ width: "70%" }}>
                            <Input.Password
                              style={{border: `1px solid ${colorBlack}`, borderRadius: '5px'}}
                              value={oldAdminPassword}
                              onChange={(e) =>
                                setOldAdminPassword(e.target.value)
                              }
                              placeholder="New password to be set"
                            />
                          </td>
                        </tr>
                        <br/>
                        <tr>
                          <td style={{ width: "30%" }}>New Password</td>
                          <td style={{ width: "70%" }}>
                            <Input.Password
                              style={{border: `1px solid ${colorBlack}`, borderRadius: '5px'}}
                              value={newpasswordPandI}
                              onChange={(e) =>
                                setNewpasswordPandI(e.target.value)
                              }
                              placeholder="New password to be set"
                            />
                          </td>
                        </tr>
                        <br />
                        <tr>
                          <td>Confirm Password</td>
                          <td>
                            <Input.Password
                              style={{border: `1px solid ${colorBlack}`, borderRadius: '5px'}}
                              value={newconfirmpasswordPandI}
                              onChange={(e) =>
                                setNewConfirmpasswordPandI(e.target.value)
                              }
                              placeholder="Confirm new password"
                            />
                          </td>
                        </tr>
                        <br />
                        {emailErrorPandIPassword && (
                          <tr>
                            <td colSpan={2}>
                              <br />
                              <Alert
                                style={{ margin: "0.5rem" }}
                                message="Validation Error"
                                description="Password do not match . Please try again"
                                type="error"
                                closable
                              />
                            </td>
                          </tr>
                        )}
                        {fieldError && (
                          <tr>
                            <td colSpan={2}>
                              <br />
                              <Alert
                                style={{ margin: "0.5rem" }}
                                message="Validation Error"
                                description="All fields required"
                                type="error"
                                closable
                              />
                            </td>
                          </tr>
                        )}
                        {oldPasswordError && (
                          <tr>
                            <td colSpan={2}>
                              <br />
                              <Alert
                                style={{ margin: "0.5rem" }}
                                message="Validation Error"
                                description="Old Password is incorrect "
                                type="error"
                                closable
                              />
                            </td>
                          </tr>
                        )}
                        <tr>
                          <td></td>
                          <td>
                            <Button
                              onClick={updatePasswordAdmin}
                              style={{ width: "100%", backgroundColor: colorGreen
                             }}
                              type="primary"
                            >
                              Change Password
                            </Button>
                          </td>
                        </tr>
                      </table>
                    </Card>
                  </Col>
                  </center>
                </Tabs.TabPane>
              </Tabs>
            </div>
          </ConfigProvider>
        </div>
      </div>
    </div>
  );
};

export default Accounts;
