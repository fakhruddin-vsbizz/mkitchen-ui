import React, { useState, useContext, useEffect } from "react";

import {
  Card,
  Row,
  Col,
  Button,
  Input,
  TimePicker,
  Checkbox,
  Radio,
  Modal,
  Alert,
  List,
  Tag,
  ConfigProvider,
} from "antd";

import AuthContext from "../../components/context/auth-context";

import Header from "../../components/navigation/Header";
import Sidebar from "../../components/navigation/SideNav";
import DeshboardBg from "../../res/img/DeshboardBg.png";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";

const NewVendor = () => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const [vendorName, setVendorName] = useState();
  const [vendorEmail, setVendorEmail] = useState();
  const [vendorAddress, setVendorAddress] = useState();
  const [closingTime, setClosingTime] = useState();
  const [openingTime, setOpeningTime] = useState();
  const [visible, setVisible] = useState(false);

  const [validationError, setValidationError] = useState(false);
  const [emailError, setEmailError] = useState(false);

  const authCtx = useContext(AuthContext);
  const userEmail = authCtx.userEmail;

  const navigate = useNavigate();
  /**************Restricting PandI Route************************* */

  useEffect(() => {

    const type = localStorage.getItem("type");


    if (!type) {
      navigate("/");
    }

    const typeAdmin = type === "mk admin" ? true : false;

    if (typeAdmin) {
      navigate("/admin/menu");
    }
    if (!typeAdmin && type && type === "Cooking") {
      navigate("/cooking/ingredients");
    }
    if (!typeAdmin && type && type === "Procurement Inventory") {
      navigate("/pai/vendors/new");
    }
  }, [navigate]);

  /**************Restricting PandI Route************************* */

  const createNewVendor = async () => {
    const selectedTimeOpening = openingTime ? new Date(openingTime) : null;
    const selectedTimeClosing = closingTime ? new Date(closingTime) : null;

    const finalOpeningTime = selectedTimeOpening
      ? selectedTimeOpening.toLocaleTimeString()
      : "";

    const finalClosingTime = selectedTimeClosing
      ? selectedTimeClosing.toLocaleTimeString()
      : "";

    try {
      const data = await fetch("/api/vendor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mkuser_email: userEmail,
          vendor_name: vendorName,
          opening_time: finalOpeningTime,
          closing_time: finalClosingTime,
          email: vendorEmail,
          address: vendorAddress,
          approval_status: 0,
        }),
      });

      if (data) {
        const res = await data.json();

        if (res.inputInvalid) {
          setValidationError(true);
          setEmailError(false);
        } else if (res.emailInvalid) {
          setEmailError(true);
          setValidationError(false);
        } else {
          setVisible(true);
          setVendorEmail("");
          setVendorName("");
          setVendorAddress("");
          setOpeningTime("");
          setClosingTime("");
          setEmailError(false);
          setValidationError(false);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      style={{ margin: 0, padding: 0, backgroundImage: `url(${DeshboardBg})` }}
    >
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "orange",
          },
        }}
      >
        <Modal
          visible={visible}
          onOk={() => setVisible(false)}
          onCancel={() => setVisible(false)}
          footer={[
            <Button key="ok" type="primary" onClick={() => setVisible(false)}>
              OK
            </Button>,
          ]}
        >
          <div style={{ textAlign: "center" }}>
            <h2 style={{ color: "#52c41a" }}>Success!</h2>
            <p>Vendor Added Successfully</p>
          </div>
        </Modal>
        <div style={{ display: "flex" }}>
          <Sidebar k="4" userType="pai" />

          <div style={{ width: "100%" }}>
            <Header
              title={<p>
                <Link
                  to="/pai/vendors"
                  style={{ color: "white", textDecoration: "none" }}
                >
                  <ArrowLeftOutlined />
                </Link>{" "}
                Add New Vendor
              </p>}
              comp={<center>
                <Link to="/pai/vendors">
                <Button style={{ backgroundColor: "white", color: "orange" }}>
                  Cancel
                </Button>
                </Link>
              </center>}
            />
            {validationError && (
              <tr>
                <td colSpan={2}>
                  <br />
                  <Alert
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
                    message="Validation Error"
                    description="Plese write the correct email"
                    type="error"
                    closable
                  />
                </td>
              </tr>
            )}
            <div style={{ width: "100%", padding: 0 }}>
              <div style={{ width: "90%", padding: "3%" }}>
                <Card
                  style={{ border: "2px solid orange" }}
                  className="dongle-font-class"
                >
                  <label style={{ fontSize: "250%" }}>
                    <span>Vendor Details</span>
                  </label>
                  <br />
                  <table
                    style={{ width: "100%", fontSize: "130%" }}
                    cellPadding={20}
                  >
                    <tr>
                      <td>
                        Vendor Name:{" "}
                        <Input
                          value={vendorName}
                          onChange={(e) => setVendorName(e.target.value)}
                          placeholder="Eg: VK General store, Brahma store, etc.."
                        ></Input>
                      </td>
                      <td>
                        Email:{" "}
                        <Input
                          value={vendorEmail}
                          onChange={(e) => setVendorEmail(e.target.value)}
                          placeholder="Eg: brahma@gmail.com, vkstore@hotmail.com, etc.."
                        ></Input>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        Address:{" "}
                        <Input
                          value={vendorAddress}
                          onChange={(e) => setVendorAddress(e.target.value)}
                          placeholder="Must include Street name, locality, city and country.."
                        ></Input>
                      </td>
                      <td>
                        <Row>
                          <Col xs={12} xl={12}>
                            Opening time: <br />
                            <TimePicker
                              value={openingTime}
                              onChange={(time) => setOpeningTime(time)}
                              style={{ width: "90%" }}
                            ></TimePicker>
                          </Col>
                          <Col xs={12} xl={12}>
                            Closing time: <br />
                            <TimePicker
                              value={closingTime}
                              style={{ width: "100%" }}
                              onChange={(time) => setClosingTime(time)}
                            ></TimePicker>
                          </Col>
                        </Row>
                      </td>
                    </tr>
                  </table>
                </Card>

                <br />
                <br />

                {/* <Card style={{ border: '2px solid orange' }} className='dongle-font-class'>
                <label style={{ fontSize: '150%' }}>
                    <u>Availability</u>
                </label>
                <br/>
                
                <Radio.Group name="availability" defaultValue={0} className='dongle-font-class'>
                    <Row>
                        <Col xs={12} xl={12}>
                            <Radio value='everyday' style={{ fontSize: '130%' }}>Everyday</Radio>
                        </Col>
                        <Col xs={12} xl={12}>
                            <Radio value='Weekdays' style={{ fontSize: '130%' }}>Weekdays</Radio>
                            <br/>
                            <br/>
                            <Row>                            
                                <Col xs={12} xl={8}><Checkbox>Monday</Checkbox></Col>
                                <Col xs={12} xl={8}><Checkbox>Tuesday</Checkbox></Col>
                                <Col xs={12} xl={8}><Checkbox>Wednesday</Checkbox></Col>
                                <Col xs={12} xl={8}><Checkbox>Thursday</Checkbox></Col>
                                <Col xs={12} xl={8}><Checkbox>Friday</Checkbox></Col>
                                <Col xs={12} xl={8}><Checkbox>Saturday</Checkbox></Col>
                                <Col xs={12} xl={8}><Checkbox>Sunday</Checkbox></Col>
                            </Row>
                        </Col>
                    </Row>
                </Radio.Group>
                        
            </Card> */}

                <br />
                <br />

                <Button onClick={createNewVendor} type="primary">
                  ADD VENDOR
                </Button>
              </div>
            </div>
          </div>
        </div>
      </ConfigProvider>
    </div>
  );
};

export default NewVendor;
