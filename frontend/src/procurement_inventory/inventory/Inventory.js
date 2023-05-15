import React, { useContext, useEffect, useState } from "react";
import {
  Row,
  Col,
  List,
  Input,
  Slider,
  Button,
  Card,
  Modal,
  Radio,
  Tag,
  ConfigProvider,
  Alert,
} from "antd";
import { Link } from "react-router-dom";
import AuthContext from "../../components/context/auth-context";
import Header from "../../components/navigation/Header";
import Sidebar from "../../components/navigation/SideNav";
import DeshboardBg from "../../res/img/DeshboardBg.png";

const Inventory = () => {
  const data = [
    "Inventory",
    "Purchases",
    "Current Menu",
    "Vendors",
    "Damaged Goods",
  ];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [unit, setUnit] = useState("");
  const [expiry, setExpiry] = useState("");
  const [expiryType, setExpiryType] = useState("");
  const [inventoryItems, setInventoryItems] = useState();
  const [updated, setUpdated] = useState(false);

  const [validationError, setValidationError] = useState(false);
  const authCtx = useContext(AuthContext);
  const email = authCtx.userEmail;
  useEffect(() => {
    const getInventory = async () => {
      const data = await fetch("http://localhost:5001/inventory/addinventory");
      if (data) {
        const res = await data.json();
        setInventoryItems(res);
        console.log(res);
      }
    };
    getInventory();
  }, [updated]);

  const handleSubmit = async () => {
    try {
      console.log("inside");
      const data = await fetch("http://localhost:5001/inventory/addinventory", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mkuser_email: email,
          ingridient_name: name,
          ingridient_measure_unit: unit,
          ingridient_expiry_period: expiryType,
          ingridient_expiry_amount: expiry,
          decommisioned: true,
          total_volume: 0,
          date: "4/21/2023",
          quantity_transected: 0,
          latest_rate: 0,
          rate_per_unit: 0,
        }),
      });

      if (data) {
        const res = await data.json();
        if (res.error) {
          setValidationError(true);
        } else {
          setUpdated((prev) => !prev);
          setIsModalOpen(false);
          setName("");
          setExpiry("");
          setUnit("");
          setValidationError(false);
          setValidationError(false);

          console.log(res);
        }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      style={{ margin: 0, padding: 0, backgroundImage: `url(${DeshboardBg})` }}
    >
      {/* <Modal
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
          <p>Ingridient Added Successfully</p>
        </div>
      </Modal> */}
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "orange",
          },
        }}
      >
        <div style={{ display: "flex" }}>
          <Sidebar k="1" userType="pai" />

          <div style={{ width: "100%" }}>
            <Header title="Inventory" />
            <div style={{ padding: 0 }}>
              <Col xs={24} xl={20} style={{ width: "100%", padding: "2%" }}>
                <table
                  style={{ width: "80vw", marginLeft: 50 }}
                  cellPadding={10}
                >
                  <tr>
                    <td>
                      Filter by ingredients name:
                      <br />
                      <Input
                        placeholder="Filter by name..."
                        style={{ width: "70%" }}
                      ></Input>
                    </td>
                    <td>
                      Volume Range:
                      <Slider min={1} max={10000}></Slider>
                    </td>
                    <td>
                      <center>
                        <Button
                          type="primary"
                          onClick={(e) => setIsModalOpen(true)}
                        >
                          <i class="fa-solid fa-circle-plus"></i>{" "}
                          &nbsp;&nbsp;&nbsp; Add new ingredient
                        </Button>
                      </center>

                      <Modal
                        open={isModalOpen}
                        onOk={handleSubmit}
                        onCancel={(e) => setIsModalOpen(false)}
                      >
                        <label style={{ fontSize: "150%" }}>
                          Add new Ingredient
                        </label>
                        <br />
                        <br />
                        <table style={{ width: "100%" }}>
                          <tr>
                            <td>Name</td>
                            <td>
                              <Input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Eg: Chicken Meat, Basmati Rice, etc"
                              ></Input>
                            </td>
                          </tr>
                          <tr>
                            <td>Unit for measurement</td>
                            <td>
                              <Input
                                value={unit}
                                onChange={(e) => setUnit(e.target.value)}
                                placeholder="Eg: 2,3,4, etc"
                              ></Input>
                            </td>
                          </tr>
                          <tr>
                            <td>Expiry Period</td>
                            <td>
                              <Input
                                value={expiry}
                                onChange={(e) => setExpiry(e.target.value)}
                                placeholder="Eg: 12,24,36, etc"
                              ></Input>
                              <Radio.Group
                                onChange={(e) => setExpiryType(e.target.value)}
                              >
                                <Radio value={"Days"}>Days</Radio>
                                <Radio value={"Months"}>Months</Radio>
                                <Radio value={"Year"}>Year</Radio>
                              </Radio.Group>
                            </td>
                          </tr>
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
                        </table>
                      </Modal>
                    </td>
                  </tr>
                </table>
                {inventoryItems && (
                  <Card
                    style={{
                      height: "60vh",
                      width: "85vw",
                      overflowY: "scroll",
                      backgroundColor: "transparent",
                    }}
                  >
                    <List
                      size="small"
                      dataSource={inventoryItems}
                      renderItem={(item) => (
                        <List.Item
                          style={{
                            margin: 5,
                            padding: 5,
                            display: "flex",
                            backgroundColor: "#fff",
                            borderRadius: 10,
                            borderBottom: "2px solid orange",
                            width: "98%",
                          }}
                        >
                          <Row
                            style={{
                              width: "100%",
                              textAlign: "left",
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            <Col
                              xs={4}
                              xl={4}
                              style={{ fontSize: "150%", color: "#e08003" }}
                            >
                              {item.ingridient_name}
                            </Col>
                            <Col xs={6} xl={6}>
                              Ingredient Expiry period: <br />
                              {item.ingridient_expiry_amount}{" "}
                              {item.ingridient_expiry_period}
                            </Col>
                            <Col xs={6} xl={6}>
                              Ingredient total Volume: <br />
                              {item.total_volume} {item.ingridient_measure_unit}
                            </Col>
                            <Col xs={4} xl={4}>
                              {item.total_volume < 6 ? (
                                <div style={{ color: "#e08003" }}>
                                  <i class="fa-solid fa-circle-exclamation"></i>{" "}
                                  You are short on items
                                  <br />
                                  <Button
                                    style={{ backgroundColor: "green" }}
                                    type="primary"
                                  >
                                    Restock Ingredient
                                  </Button>
                                </div>
                              ) : (
                                <div
                                  style={{ fontSize: "130%", color: "green" }}
                                >
                                  <i
                                    class="fa-solid fa-circle-check"
                                    style={{ fontSize: "130%" }}
                                  ></i>{" "}
                                  SUFFICIENT
                                </div>
                              )}
                            </Col>
                            <Col xs={4} xl={4}>
                              <Link to={`/pai/inventory/purchases/${item._id}`}>
                                <Button
                                  type="primary"
                                  style={{
                                    fontSize: "110%",
                                  }}
                                >
                                  View Purchases
                                </Button>
                              </Link>
                            </Col>
                          </Row>
                          {/* <Card
                      style={{
                        backgroundColor:
                          item.total_quantity < 0 ? "lightpink" : "lightgreen",
                      }}
                    >
                      <label style={{ fontSize: "200%" }}>
                        {item.ingridient_name}
                      </label>
                      <br />
                      <br />
                      Expires in:
                      <br />
                      <label style={{ fontSize: "150%" }}>
                        <b>
                          {item.ingridient_expiry_amount}{" "}
                          {item.ingridient_expiry_period}
                        </b>
                      </label>
                    </Card> */}
                        </List.Item>
                      )}
                    />
                  </Card>
                )}
              </Col>
            </div>
          </div>
        </div>
      </ConfigProvider>
    </div>
  );
};

export default Inventory;
