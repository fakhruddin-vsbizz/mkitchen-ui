import React from "react";
import { useState } from "react";
import {
  Card,
  Row,
  Col,
  Button,
  List,
  Tag,
  Input,
  DatePicker,
  Select,
  Slider,
  InputNumber,
  ConfigProvider,
} from "antd";
import Header from "../../components/navigation/Header";
import Sidebar from "../../components/navigation/SideNav";
import DeshboardBg from "../../res/img/DeshboardBg.png";
const VendorPurchase = () => {
  const vendorPurchaseList = [
    {
      ingredient_name: "Goat Meat",
      quantity_ordered: 130,
      rate: 600,
      unit: "KG",
      is_paid: false,
      created_on: "24-06-2023",
    },
    {
      ingredient_name: "Cabbage",
      quantity_ordered: 400,
      rate: 40,
      unit: "KG",
      is_paid: true,
      created_on: "24-06-2023",
    },
    {
      ingredient_name: "Amul Butter",
      quantity_ordered: 500,
      rate: 25,
      unit: "KG",
      is_paid: false,
      created_on: "24-06-2023",
    },
    {
      ingredient_name: "Sunflower Oil",
      quantity_ordered: 200,
      rate: 100,
      unit: "L",
      is_paid: true,
      created_on: "24-06-2023",
    },
  ];

  const [inputValue, setInputValue] = useState(1);

  const onChange = (newValue) => {
    setInputValue(newValue);
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
        <div style={{ display: "flex" }}>
          <Sidebar k="4" userType="pai" />

          <div style={{ width: "100%" }}>
            <Header
              title="Add New Vendor"
              comp=<center>
                <Button style={{ backgroundColor: "white", color: "orange" }}>
                  Cancel
                </Button>
              </center>
            />
            <div style={{ width: "100%", padding: 0 }}>
              <center>
                <Card style={{ width: "85%", textAlign: "left", backgroundColor: 'transparent' }}>
                  <Row style={{ width: "100%" }}>
                    <Col xs={12} xl={6}>
                      Filter by Ingredients: <br />
                      <Input
                        placeholder="Filter by ingredients. Eg: Chicken meat, Goat meat"
                        style={{ width: "70%" }}
                      ></Input>
                    </Col>
                    <Col xs={12} xl={6}>
                      Date of Purchase: <br />
                      <DatePicker></DatePicker>
                    </Col>
                    <Col xs={12} xl={6}>
                      Paid status: <br />
                      <Select
                        defaultValue={0}
                        style={{ width: "70%" }}
                        options={[
                          { value: 0, label: "PAID" },
                          { value: 1, label: "UNPAID" },
                        ]}
                      ></Select>
                    </Col>
                    <Col xs={12} xl={6}>
                      Price Range: <br />
                      <Row>
                        <Col xs={12} xl={12}>
                          <Slider
                            style={{ width: "70%" }}
                            min={1}
                            max={100000}
                            onChange={onChange}
                            value={
                              typeof inputValue === "number" ? inputValue : 0
                            }
                          />
                        </Col>
                        <Col xs={12} xl={12}>
                          <InputNumber
                            min={1}
                            max={100000}
                            style={{ margin: "0 16px" }}
                            value={inputValue}
                            onChange={onChange}
                          />
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </Card>
                <List
                  style={{ width: "100%", height: "60vh",
                  width: "85vw",
                  overflowY: "scroll", }}
                  dataSource={vendorPurchaseList}
                  renderItem={(item) => (
                    <List.Item style={{
                      margin: 10,
                      padding: 20,
                      display: "flex",
                      backgroundColor: "#fff",
                      borderRadius: 10,
                      borderBottom: "2px solid orange",
                      width: "98%",
                    }}>
                      <Row  style={{
                              width: "100%",
                              textAlign: "left",
                              display: "flex",
                              alignItems: "center",
                            }}>
                        <Col xs={8} xl={6} style={{ fontSize: "150%" }}>
                          {item.ingredient_name}
                        </Col>
                        <Col xs={8} xl={4}>
                          Required quantity: <br />
                          {item.quantity_ordered} {item.unit}
                        </Col>
                        <Col xs={8} xl={4}>
                          Required quantity: <br />
                          Rs. {item.quantity_ordered * item.rate}/-
                        </Col>
                        <Col xs={12} xl={4}>
                          Date of purchase: <br />
                          {item.created_on}
                        </Col>
                        <Col xs={12} xl={6}>
                          <Tag color={item.is_paid ? "green" : "red"}>
                            {item.is_paid ? "PAID" : "UNPAID"}
                          </Tag>
                          &nbsp;&nbsp;&nbsp;
                          {!item.is_paid ? <Button>MARK PAID</Button> : null}
                        </Col>
                      </Row>
                    </List.Item>
                  )}
                />
              </center>
            </div>
          </div>
        </div>
      </ConfigProvider>
    </div>
  );
};

export default VendorPurchase;
