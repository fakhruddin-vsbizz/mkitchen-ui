import React, { useState, useContext } from "react";

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
} from "antd";

const NewVendor = () => {
  const [vendorName, setVendorName] = useState();
  const [vendorEmail, setVendorEmail] = useState();
  const [vendorAddress, setVendorAddress] = useState();
  const [closingTime, setClosingTime] = useState();
  const [openingTime, setOpeningTime] = useState();
  const [visible, setVisible] = useState(false);

  const createNewVendor = async () => {
    const selectedTimeOpening = openingTime ? new Date(openingTime) : null;
    const selectedTimeClosing = closingTime ? new Date(closingTime) : null;

    const finalOpeningTime = selectedTimeOpening
      ? selectedTimeOpening.toLocaleTimeString()
      : "";

    const finalClosingTime = selectedTimeClosing
      ? selectedTimeClosing.toLocaleTimeString()
      : "";

    if (
      vendorAddress &&
      vendorEmail &&
      vendorName &&
      finalClosingTime &&
      finalOpeningTime
    ) {
      try {
        console.log("inside");
        const data = await fetch("http://localhost:5001/vendor", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            mkuser_email: "sujeet@gmail.com",
            vendor_name: vendorName,
            opening_time: finalOpeningTime,
            closing_time: finalClosingTime,
            email: vendorName,
            address: vendorAddress,
          }),
        });

        if (data) {
          const res = await data.json();
          setVisible(true);
          setVendorEmail("");
          setVendorName("");
          setVendorAddress("");
          setOpeningTime("");
          setClosingTime("");

          console.log(res);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <div>
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

      <Card style={{ padding: "1%", border: "1px solid grey" }} bordered={true}>
        <Row>
          <Col xs={12} xl={12} style={{ fontSize: "200%" }}>
            <i class="fa-solid fa-arrow-left"></i>&nbsp;&nbsp;&nbsp;New Vendor
          </Col>
          <Col xs={12} xl={12}>
            <center>
              <Button type="primary" danger>
                Cancel
              </Button>
            </center>
          </Col>
        </Row>
      </Card>
      <div style={{ width: "80%", padding: "3%" }}>
        <Card
          style={{ border: "2px solid orange" }}
          className="dongle-font-class"
        >
          <label style={{ fontSize: "150%" }}>
            <u>Vendor Details</u>
          </label>
          <br />
          <table style={{ width: "100%", fontSize: "130%" }} cellPadding={20}>
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
                    ></TimePicker>
                  </Col>
                  <Col xs={12} xl={12}>
                    Closing time: <br />
                    <TimePicker
                      value={closingTime}
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
  );
};

export default NewVendor;
