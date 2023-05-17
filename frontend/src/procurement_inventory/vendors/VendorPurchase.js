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
import Header from "../../components/navigation/Header";
import Sidebar from "../../components/navigation/SideNav";
import DeshboardBg from "../../res/img/DeshboardBg.png";
import { useNavigate } from "react-router-dom";
const VendorPurchase = () => {
  const [purchaseList, setPurchaseList] = useState();
  const [inventoryItems, setInventoryItems] = useState([]);
  const [inputValue, setInputValue] = useState(1);
  const [update, setUpdate] = useState(false);

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
    if (!typeAdmin && type && type === "Procurement Inventory") {
      navigate("/pai/vendors/purchases");
    }
  }, [navigate]);

  /**************Restricting PandI Route************************* */

  //getting all purchase data
  useEffect(() => {
    const getPurchaseData = async () => {
      try {
        const data = await fetch("http://localhost:5001/purchase");
        const res = await data.json();

        if (res) {
          setPurchaseList(res);
        }
      } catch (e) {
        console.log(e);
      }
    };
    getPurchaseData();
  }, [update]);

  console.log("purcahse list: ", purchaseList);
  console.log("Inventory list: ", inventoryItems);

  useEffect(() => {
    const getInventory = async () => {
      try {
        console.log("inside");
        const data = await fetch("http://localhost:5001/cooking/ingredients", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type: "get_inventory_ingridients",
          }),
        });

        if (data) {
          const res = await data.json();
          if (res) {
            setInventoryItems(res);
          }
        }
      } catch (error) {
        console.log(error);
      }
    };
    getInventory();
  }, []);

  const payPurchaseItem = async (id) => {
    console.log(id);
    try {
      const data = await fetch("http://localhost:5001/purchase", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          purchase_id: id,
          paid: true,
        }),
      });
      if (data) {
        console.log(data);
        setUpdate((prev) => !prev);
      }
    } catch (e) {
      console.log(e);
    }
  };

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
                <Card
                  style={{
                    width: "85%",
                    textAlign: "left",
                    backgroundColor: "transparent",
                  }}
                >
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
                {purchaseList && (
                  <List
                    style={{
                      width: "100%",
                      height: "60vh",
                      width: "85vw",
                      overflowY: "scroll",
                    }}
                    dataSource={purchaseList}
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
                        <Row
                          style={{
                            width: "100%",
                            textAlign: "left",
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <Col xs={8} xl={6} style={{ fontSize: "150%" }}>
                            {item.ingredient_name}
                          </Col>
                          <Col xs={8} xl={4}>
                            Required quantity: <br />
                            {item.quantity_loaded}{" "}
                            {inventoryItems &&
                              inventoryItems
                                .filter(
                                  (itemNew) => itemNew._id === item.inventory_id
                                )
                                .map((ele) => ele.ingridient_measure_unit)}
                          </Col>
                          <Col xs={8} xl={4}>
                            Total Amount: <br />
                            Rs. {item.total_amount}/-
                          </Col>
                          <Col xs={12} xl={4}>
                            Date of purchase: <br />
                            {item.createdAt}
                          </Col>
                          <Col xs={12} xl={6}>
                            <Tag color={item.paid ? "green" : "red"}>
                              {item.paid ? "PAID" : "UNPAID"}
                            </Tag>
                            &nbsp;&nbsp;&nbsp;
                            {!item.paid ? (
                              <Button
                                onClick={(e) => payPurchaseItem(item._id)}
                              >
                                MARK PAID
                              </Button>
                            ) : null}
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

export default VendorPurchase;
