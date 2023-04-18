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

  const mohalla_accounts = [
    { mohalla_name: "Fakhri Hills", is_active: true },
    { mohalla_name: "Brahma Avenue", is_active: true },
    { mohalla_name: "Natasha Enclave", is_active: false },
    { mohalla_name: "Badhshah Nagar", is_active: false },
  ];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newMohallaPopup, setNewMohallaPopup] = useState(false);
  const [mohallaUsers, setMohallaUsers] = useState();

  const handleUserTypeChange = (value) => {
    console.log("n");
    setUserType(value);
  };
  const showModal = () => {
    setIsModalOpen(true);
  };

  const showNMModal = () => {
    setNewMohallaPopup(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
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

  console.log(usertype);
  console.log(username);

  console.log(password);
  console.log(email);

  useEffect(() => {
    const getMohallas = async () => {
      const data = await fetch("http://localhost:5001/adduser");
      if (data) {
        console.log(data.json().then((data) => setMohallaUsers(data)));
      }
    };
    getMohallas();
  }, []);

  console.log(mohallaUsers);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5001/adduser", {
        usertype,
        username,
        email,
        password,
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
                  <Button size="small" type="primary" onClick={showModal}>
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
                  <Button type="primary" danger>
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
                  <Input.Password placeholder="New password to be set" />
                </td>
              </tr>
              <tr>
                <td>Confirm Password</td>
                <td>
                  <Input.Password placeholder="Confirm new password" />
                </td>
              </tr>
              <tr>
                <td colSpan={2}>
                  <br />
                  <Button type="primary" block danger>
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
          <br />
          Select user: &nbsp;&nbsp;&nbsp;
          <Select
            defaultValue={0}
            style={{ width: 120 }}
            block
            options={[
              { value: 0, label: "Hatim" },
              { value: 1, label: "Atif" },
              { value: 2, label: "Somesh" },
            ]}
          />
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
                  <Button type="primary" danger>
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
                  <Input.Password placeholder="New password to be set" />
                </td>
              </tr>
              <tr>
                <td>Confirm Password</td>
                <td>
                  <Input.Password placeholder="Confirm new password" />
                </td>
              </tr>
              <tr>
                <td></td>
                <td>
                  <br />
                  <Button type="primary" danger>
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
          <Select
            defaultValue={0}
            style={{ width: 120 }}
            block
            options={[
              { value: 0, label: "Hatim" },
              { value: 1, label: "Atif" },
              { value: 2, label: "Somesh" },
            ]}
          />
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
                  <Button type="primary" danger>
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
                  <Input.Password placeholder="New password to be set" />
                </td>
              </tr>
              <tr>
                <td>Confirm Password</td>
                <td>
                  <Input.Password placeholder="Confirm new password" />
                </td>
              </tr>
              <tr>
                <td></td>
                <td>
                  <br />
                  <Button type="primary" danger>
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
