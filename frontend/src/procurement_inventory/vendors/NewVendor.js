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
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { colorBackgroundColor, colorBlack, colorGreen, colorNavBackgroundColor, valueShadowBox } from "../../colors";
import { baseURL } from "../../constants";

const NewVendor = () => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const [vendorName, setVendorName] = useState();
  const [vendorEmail1, setVendorEmail1] = useState();
  const [vendorEmail2, setVendorEmail2] = useState();
  const [phone1, setPhone1] = useState("");
  const [phone2, setPhone2] = useState("");
  const [GSTIN, setGSTIN] = useState("");
  const [personOfContact, setPersonOfContact] = useState("");
  const [vendorAddress, setVendorAddress] = useState();
  const [visible, setVisible] = useState(false);

  const [validationError, setValidationError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [prevPath, setPrevPath] = useState("");

  const authCtx = useContext(AuthContext);
  const userEmail = authCtx.userEmail;

  const navigate = useNavigate();

  const location = useLocation();

  /**************Restricting PandI Route************************* */

  useEffect(()=>{
    setPrevPath(location?.state?.prevPath);
    console.log(location?.state?.prevPath);
  },[])

  // useEffect(() => {
  //   const type = localStorage.getItem("type");

  //   if (!type) {
  //     navigate("/");
  //   }

  //   const typeAdmin = type === "mk admin" ? true : false;

  //   if (typeAdmin) {
  //     navigate("/admin/menu");
  //   }
  //   if (!typeAdmin && type && type === "Cooking") {
  //     navigate("/cooking/ingredients");
  //   }
  //   if (!typeAdmin && type && type === "Procurement Inventory") {
  //     navigate("/pai/vendors/new");
  //   }
  // }, [navigate]);

  /**************Restricting PandI Route************************* */

  const createNewVendor = async () => {

    if (!vendorName && !phone1) {
      return;
    }

    try {
      const data = await fetch("/api/vendor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mkuser_email: userEmail,
          vendor_name: vendorName,
          phone: phone1,
          phone2: phone2,
          email: vendorEmail1,
          email2: vendorEmail2,
          gstin: GSTIN,
          contact_person: personOfContact,
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
          setVendorEmail1("");
          setVendorEmail2("");
          setVendorName("");
          setVendorAddress("");
          setPhone1("");
          setPhone2("");
          setPersonOfContact("");
          setGSTIN("");
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
      style={{ margin: 0, padding: 0}}
    >
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: colorGreen,
          },
        }}
      >
        <Modal
          open={visible}
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
        <div style={{ display: "flex", backgroundColor: colorNavBackgroundColor }}>
        {localStorage.getItem("type") === "mk superadmin" ? <Sidebar k="4" userType="superadmin" /> :
          <Sidebar k="5" userType="pai" />}

          <div style={{ width: "100%", backgroundColor: colorBackgroundColor }}>
            <Header
              title={
                <p>
                  <Link
                    to={prevPath}
                    style={{ color: "white", textDecoration: "none" }}
                  >
                    <ArrowLeftOutlined />
                  </Link>{" "}
                  Add New Vendor
                </p>
              }
              comp={
                <center>
                  <Link to={prevPath}>
                    <Button
                      style={{ backgroundColor: "white", color: colorGreen }}
                    >
                      Cancel
                    </Button>
                  </Link>
                </center>
              }
            />
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
            <div style={{ width: "100%", padding: 0 }}>
              <div style={{ width: "90%", padding: "3%" }}>
                <Card
                  style={{boxShadow: valueShadowBox}}
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
                      <Col xs={12} xl={24}>
                        Vendor Name:<span style={{color: 'red'}}>*</span>{" "}
                        <Input
                          value={vendorName}
                          onChange={(e) => setVendorName(e.target.value)}
                          placeholder="Enter Name"
                          required
                        ></Input>
                        </Col>
                      </td>
                      {/* <td>
                        Email:{" "}
                        <Input
                          value={vendorEmail}
                          onChange={(e) => setVendorEmail(e.target.value)}
                          placeholder="Eg: brahma@gmail.com, vkstore@hotmail.com, etc.."
                        ></Input>
                      </td> */}
                      <td>
                        <Row style={{columnGap: "1rem"}}>
                          <Col xs={12} xl={11}>
                          Email 1: <br />
                        <Input
                          value={vendorEmail1}
                          onChange={(e) => setVendorEmail1(e.target.value)}
                          placeholder="Enter Email Here"
                        ></Input>
                          </Col>
                          <Col xs={12} xl={11}>
                          Email 2: <br />
                        <Input
                          value={vendorEmail2}
                          onChange={(e) => setVendorEmail2(e.target.value)}
                          placeholder="Enter Email Here"
                        ></Input>
                          </Col>
                        </Row>
                      </td>
                    </tr>
                    <tr>
                      <td>
                      <Col xs={12} xl={24}>
                        Address:{" "}
                        <Input
                          value={vendorAddress}
                          onChange={(e) => setVendorAddress(e.target.value)}
                          placeholder="Enter Address Here"
                        ></Input>
                        </Col>
                      </td>
                      <td>
                        <Row style={{columnGap: "1rem"}}>
                          <Col xs={12} xl={11}>
                          Phone 1:<span style={{color: 'red'}}>*</span><br />
                        <Input
                          value={phone1}
                          onChange={(e) => setPhone1(e.target.value)}
                          placeholder="Enter Phone Number Here"
                          required
                        ></Input>
                          </Col>
                          <Col xs={12} xl={11}>
                            Phone 2:<br />
                        <Input
                          value={phone2}
                          onChange={(e) => setPhone2(e.target.value)}
                          placeholder="Enter Phone Number Here"
                        ></Input>
                          </Col>
                        </Row>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <Col xs={12} xl={24}>
                      Contact Person:{" "}
                        <Input
                          value={personOfContact}
                          onChange={(e) => setPersonOfContact(e.target.value)}
                          placeholder="Enter Person of Contact Here"
                        ></Input>
                        </Col>
                      </td>
                      <td>
                        <Col xs={12} xl={24}>
                      GSTIN:{" "}
                        <Input
                          value={GSTIN}
                          onChange={(e) => setGSTIN(e.target.value)}
                          placeholder="Enter GSTIN Here"
                        ></Input>
                        </Col>
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
