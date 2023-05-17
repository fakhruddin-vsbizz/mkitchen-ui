import React, { useEffect } from "react";
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
import { Link, useNavigate, useParams } from "react-router-dom";
import Header from "../../components/navigation/Header";
import Sidebar from "../../components/navigation/SideNav";
import DeshboardBg from "../../res/img/DeshboardBg.png";
import { ArrowLeftOutlined } from "@ant-design/icons";

const IngredientPurchase = () => {
  const [itemPurchase, setItemPurchase] = useState();
  const [vendors, setVendors] = useState([]);

  const { id } = useParams();
  console.log(id);

  const navigate = useNavigate();

  /**************Restricting PandI Route************************* */

  useEffect(() => {
    console.log("in");

    const type = localStorage.getItem("type");

    console.log("ttt=>", type);

    if (!type) {
      console.log("second in");
      navigate("/login");
    }

    const typeAdmin = type === "mk admin" ? true : false;

    if (typeAdmin) {
      console.log("second in");
      navigate("/admin/menu");
    }
    if (!typeAdmin && type && type === "Cooking") {
      navigate("/cooking/ingredients");
    }
    // if (!typeAdmin && type && type === "Procurement Inventory") {
    //   navigate("/pai/inventory/purchases/:id");
    // }
  }, [navigate]);

  /**************Restricting PandI Route************************* */

  useEffect(() => {
    const getInventory = async () => {
      const data = await fetch("http://localhost:5001/vendor");
      if (data) {
        const res = await data.json();
        if (res) {
          if (res) {
            setVendors(res);
          }
        }
      }
    };
    getInventory();
  }, []);

  console.log(vendors);

  useEffect(() => {
    const getInventory = async () => {
      const data = await fetch("http://localhost:5001/purchase");
      if (data && id) {
        const res = await data.json();
        if (res) {
          if (res) {
            let purchaseData = res.filter(
              (item, index) => item.inventory_id === id
            );
            setItemPurchase(purchaseData);
          }
        }
      }
    };
    getInventory();
  }, [id]);

  console.log(itemPurchase);

  const vendorPurchaseList = [
    {
      vendor_name: "V.K. General store",
      quantity_ordered: 130,
      rate: 600,
      unit: "KG",
      is_paid: false,
      created_on: "24-06-2023",
    },
    {
      vendor_name: "Brahma Stores",
      quantity_ordered: 400,
      rate: 40,
      unit: "KG",
      is_paid: true,
      created_on: "24-06-2023",
    },
    {
      vendor_name: "Mustali Stores",
      quantity_ordered: 500,
      rate: 25,
      unit: "KG",
      is_paid: false,
      created_on: "24-06-2023",
    },
    {
      vendor_name: "Supermarket Stores",
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
          <Sidebar k="1" userType="pai" />

          <div style={{ width: "100%" }}>
            <Header
              title=<p>
                <Link
                  to="/pai/inventory"
                  style={{ color: "white", textDecoration: "none" }}
                >
                  <ArrowLeftOutlined />
                </Link>{" "}
                Purchase Inventory
              </p>
            />
            <div style={{ padding: 0 }}>
              <center>
                <Card
                  style={{
                    width: "95%",
                    textAlign: "left",
                    backgroundColor: "transparent",
                  }}
                >
                  <Row style={{ width: "100%" }}>
                    <Col xs={12} xl={6}>
                      Filter by vendor name: <br />
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
                            max={10000}
                            style={{ margin: "0 16px" }}
                            value={inputValue}
                            onChange={onChange}
                          />
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </Card>
                {itemPurchase && (
                  <List
                    style={{
                      padding: "0px 20px",
                      margin: "10px 0px",
                      width: "100%",
                      height: "60vh",
                      width: "85vw",
                      overflowY: "scroll",
                    }}
                    dataSource={itemPurchase}
                    renderItem={(item) => (
                      <List.Item
                        style={{
                          margin: 10,
                          padding: 20,
                          display: "flex",
                          backgroundColor: "#fff",
                          borderRadius: 10,
                          borderBottom: "2px solid orange",
                          width: "98%",
                        }}
                      >
                        <Row style={{ width: "100%", textAlign: "left" }}>
                          <Col
                            xs={24}
                            xl={6}
                            style={{ fontSize: "150%", color: "#e08003" }}
                          >
                            {vendors &&
                              vendors
                                .filter(
                                  (it, index) => it._id === item.vendor_id
                                )
                                .map((ele) => ele.vendor_name)}
                          </Col>
                          <Col xs={8} xl={4}>
                            Required quantity: <br />
                            {item.quantity_loaded} {item.unit}
                          </Col>
                          <Col xs={8} xl={4}>
                            Price: <br />
                            Rs. {item.quantity_loaded * item.rate_per_unit}/-
                          </Col>
                          <Col xs={8} xl={6}>
                            Date of purchase: <br />
                            {item.createdAt}
                          </Col>
                          <Col xs={8} xl={4}>
                            <Tag color={item.paid ? "green" : "red"}>
                              {item.paid ? "PAID" : "UNPAID"}
                            </Tag>
                          </Col>
                        </Row>
                      </List.Item>
                    )}
                  />
                )}
              </center>
            </div>
          </div>
        </div>
      </ConfigProvider>
    </div>
  );
};

export default IngredientPurchase;
