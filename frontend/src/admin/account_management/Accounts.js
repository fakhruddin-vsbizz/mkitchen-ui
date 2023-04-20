import React, { useEffect, useState } from "react";
import axios from "axios";

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
} from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
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

  const handleUserTypeChange = (value) => {
    console.log("n");
    setUserType(value);
  };
  const showModal = (data) => {
    setSelectedMohallaUser(data);
    setIsModalOpen(true);
  };

  console.log(selectedMohallaUser);

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
      if (selectedMohallaUser && newEmailMohalla) {
        const data = await fetch("http://localhost:5001/adduser", {
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
          console.log(data.json().then((data) => console.log(data)));
          setNewEmailMohalla("");
          setIsModalOpen(false);
          setVisible(true);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  const updateCookingDepartmentEmail = async () => {
    console.log("inside 1");

    try {
      if (selectedCookingUser && newEmailCooking) {
        console.log("inside2");
        const data = await fetch("http://localhost:5001/adduser", {
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
          console.log(data.json().then((data) => console.log(data)));
          setNewEmailCooking("");
          setVisible(true);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updatePandIEmail = async () => {
    try {
      if (selectedPandIUser && newEmailPandI) {
        const data = await fetch("http://localhost:5001/adduser", {
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
          console.log(data.json().then((data) => console.log(data)));
          setNewEmailPandI("");
          setVisible(true);
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

  const updateUserPasswordMohalla = async (usertype) => {
    try {
      if (selectedMohallaUser && newConfirmpasswordMohalla) {
        const data = await fetch("http://localhost:5001/adduser", {
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
          console.log(data.json().then((data) => console.log(data)));
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

        const data = await fetch("http://localhost:5001/adduser", {
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
          console.log(data.json().then((data) => console.log(data)));
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
      const data = await fetch("http://localhost:5001/adduser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ usertype: "Mohalla Admin", action: "get_user" }),
      });
      if (data) {
        console.log(data.json().then((data) => setMohallaUsers(data)));
      }
    };
    getMohallas();
  }, [newMohallaPopup]);

  useEffect(() => {
    const getCookingUsers = async () => {
      const data = await fetch("http://localhost:5001/adduser", {
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
      const data = await fetch("http://localhost:5001/adduser", {
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
      const response = await axios.post("http://localhost:5001/adduser", {
        usertype,
        username,
        email,
        password,
        action: "create_mk",
      });

      setUserEmail("");
      setUserPassword("");
      setUserName("");
      setError(false);
      setNewMohallaPopup(false);
      console.log("Signup successful");
    } catch (error) {
      console.error(error);
      console.log(error.message);
      setError(true);
    }
  };

  const options = [
    { value: "Mutton Biryani" },
    { value: "Mutton Kebab" },
    { value: "Moong Dal" },
    { value: "Dal" },
    { value: "Chawal" },
    { value: "Palidu" },
    { value: "Roti" },
    { value: "Manda" },
    { value: "Chicken Gravy" },
  ];

  const [foodItems, setFoodItems] = useState([]);
  console.log(selectedCookingUser);
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

  return (
    <div>
      <Row>
        <Col xs={0} xl={4} style={{ padding: "1%" }}>
          <List
            bordered
            dataSource={data}
            renderItem={(item) => <List.Item>{item}</List.Item>}
          />
        </Col>
        <Col xs={24} xl={20} style={{ padding: "5%" }}>
          <Row>
            <Col xs={12} xl={12}>
              <label style={{ fontSize: "300%" }} className="dongle-font-class">
                Account Management
              </label>
            </Col>
            <Col xs={12} xl={12}>
              <Button onClick={showNMModal}>Add New MK User</Button>
            </Col>
          </Row>
          <Modal
            title="New Mohalla user"
            open={newMohallaPopup}
            onOk={handleNMOk}
            onCancel={handleNMCancel}
          >
            <p>Add new account</p>
            <table style={{ width: "100%" }}>
              <tr>
                <td>Select User type:</td>
                <td>
                  <Select
                    defaultValue={null}
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
              {error && (
                <tr>
                  <h2
                    style={{
                      color: "red",
                    }}
                  >
                    User Already Registered
                  </h2>
                </tr>
              )}
              <tr>
                <td colSpan={2}>
                  <br />
                  <Button onClick={handleSubmit} type="primary" block>
                    Create new MK Account
                  </Button>
                </td>
              </tr>
            </table>
          </Modal>
          <Divider style={{ backgroundColor: "#000" }}></Divider>
          <label style={{ fontSize: "200%" }} className="dongle-font-class">
            Mohalla Accounts
          </label>
          <br />
          <br />
          <br />
          <List
            grid={{
              gutter: 16,
              xs: 1,
              sm: 2,
              md: 4,
              lg: 4,
              xl: 3,
              xxl: 3,
            }}
            dataSource={mohallaUsers}
            renderItem={(item) => (
              <List.Item>
                <Card title={item.username}>
                  Status:{" "}
                  {item.usertype ? (
                    <Tag color="green">ACITVE</Tag>
                  ) : (
                    <Tag color="red">DISABLED</Tag>
                  )}
                  <br />
                  <br />
                  <Button
                    size="small"
                    type="primary"
                    onClick={() => showModal(item.username)}
                  >
                    Manage Account
                  </Button>
                </Card>
              </List.Item>
            )}
          />
          <Modal
            title="Account setting"
            open={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
          >
            <p>Change Email</p>
            <table style={{ width: "100%" }}>
              <tr>
                <td>
                  <Input
                    value={newEmailMohalla}
                    onChange={(e) => setNewEmailMohalla(e.target.value)}
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
                    onClick={updateMohallAdminEmail}
                    type="primary"
                    danger
                  >
                    Change Email
                  </Button>
                </td>
              </tr>
            </table>
            <Divider style={{ backgroundColor: "#000" }}></Divider>
            <p>Reset Password</p>
            <table style={{ width: "100%" }}>
              <tr>
                <td>New Password</td>
                <td>
                  <Input.Password
                    value={newPasswordMohalla}
                    onChange={(e) => setNewpasswordMohalla(e.target.value)}
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
                <td colSpan={2}>
                  <br />
                  <Button
                    onClick={() => updateUserPasswordMohalla("Mohalla Admin")}
                    type="primary"
                    block
                    danger
                  >
                    Change Password
                  </Button>
                </td>
              </tr>
            </table>
          </Modal>
          <Divider style={{ backgroundColor: "#000" }}></Divider>
          <label style={{ fontSize: "200%" }} className="dongle-font-class">
            Cooking Department
          </label>
          <Modal
            visible={visible}
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
          <br />
          Select user: &nbsp;&nbsp;&nbsp;
          {cookingDepartmentUser && (
            <Select
              defaultValue={"select user"}
              style={{ width: 120 }}
              block
              options={cookingDepartmentUser.map((item) => ({
                value: item.username,
                label: item.username,
              }))}
              onChange={(value) => setSelectedCookingUser(value)}
            />
          )}
          <br />
          <br />
          <Card
            bordered={true}
            style={{
              width: "100%",
            }}
          >
            <p>
              <u>Change Email of Cooking Department</u>
            </p>
            <table style={{ width: "100%" }}>
              <tr>
                <td>
                  <Input
                    value={newEmailCooking}
                    onChange={(e) => setNewEmailCooking(e.target.value)}
                    placeholder="Enter new email"
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
                    onClick={updateCookingDepartmentEmail}
                    type="primary"
                    danger
                  >
                    Change Email
                  </Button>
                </td>
              </tr>
            </table>
          </Card>
          <br />
          <Card
            bordered={true}
            style={{
              width: "100%",
            }}
          >
            <p>
              <u>Reset Password of Cooking Department</u>
            </p>
            <table style={{ width: "100%" }}>
              <tr>
                <td>New Password</td>
                <td>
                  <Input.Password
                    value={newpassword}
                    onChange={(e) => setNewpassword(e.target.value)}
                    placeholder="New password to be set"
                  />
                </td>
              </tr>
              <tr>
                <td>Confirm Password</td>
                <td>
                  <Input.Password
                    value={newconfirmpassword}
                    onChange={(e) => setNewConfirmpassword(e.target.value)}
                    placeholder="Confirm new password"
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
                    password dont match
                  </h2>
                </tr>
              )}
              <tr>
                <td></td>
                <td>
                  <br />
                  <Button
                    onClick={() => updateUserPassword("Cooking")}
                    type="primary"
                    danger
                  >
                    Change Password
                  </Button>
                </td>
              </tr>
            </table>
          </Card>
          <Divider style={{ backgroundColor: "#000" }}></Divider>
          <label style={{ fontSize: "200%" }} className="dongle-font-class">
            P&I Department
          </label>
          <br />
          Select user: &nbsp;&nbsp;&nbsp;
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
          <Card
            bordered={true}
            style={{
              width: "100%",
            }}
          >
            <p>
              <u>Change Email of P&I Department</u>
            </p>
            <table style={{ width: "100%" }}>
              <tr>
                <td>
                  <Input
                    value={newEmailPandI}
                    onChange={(e) => setNewEmailPandI(e.target.value)}
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
                  <Button onClick={updatePandIEmail} type="primary" danger>
                    Change Email
                  </Button>
                </td>
              </tr>
            </table>
          </Card>
          <br />
          <Card
            bordered={true}
            style={{
              width: "100%",
            }}
          >
            <p>
              <u>Reset Password of P&I Department</u>
            </p>
            <table style={{ width: "100%" }}>
              <tr>
                <td>New Password</td>
                <td>
                  <Input.Password
                    value={newpasswordPandI}
                    onChange={(e) => setNewpasswordPandI(e.target.value)}
                    placeholder="New password to be set"
                  />
                </td>
              </tr>
              <tr>
                <td>Confirm Password</td>
                <td>
                  <Input.Password
                    value={newconfirmpasswordPandI}
                    onChange={(e) => setNewConfirmpasswordPandI(e.target.value)}
                    placeholder="Confirm new password"
                  />
                </td>
              </tr>
              <tr>
                <td></td>
                <td>
                  <br />
                  <Button
                    onClick={() => updateUserPassword("Procurement Inventory")}
                    type="primary"
                    danger
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
  );
};

export default Accounts;
