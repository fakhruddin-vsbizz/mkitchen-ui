import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  List,
  Card,
  Input,
  DatePicker,
  Slider,
  InputNumber,
  // Button, Divider, Skeleton,
  ConfigProvider,
} from "antd";
// import InfiniteScroll from 'react-infinite-scroll-component';
import Header from "../../components/navigation/Header";
import Sidebar from "../../components/navigation/SideNav";
import DeshboardBg from "../../res/img/DeshboardBg.png";
import { useNavigate } from "react-router-dom";
const Purchases = () => {
  const [purchases, setPurchases] = useState();

  const data = [
    "Inventory",
    "Purchases",
    "Current Menu",
    "Vendors",
    "Damaged Goods",
  ];

  const navigate = useNavigate();

  /**************Restricting PandI Route************************* */

  useEffect(() => {

    const type = localStorage.getItem("type");


    if (!type) {
      navigate("/login");
    }

    const typeAdmin = type === "mk admin" ? true : false;

    if (typeAdmin) {
      navigate("/admin/menu");
    }
    if (!typeAdmin && type && type === "Cooking") {
      navigate("/cooking/ingredients");
    }
    if (!typeAdmin && type && type === "Procurement Inventory") {
      navigate("/pai/purchases");
    }
  }, [navigate]);

  /**************Restricting PandI Route************************* */

  useEffect(() => {
    const getPurchases = async () => {
      const data = await fetch(
        "http://localhost:5001/purchase/vendor_purchase"
      );
      if (data) {
        const res = await data.json();
        setPurchases(res.data);
      }
    };
    getPurchases();
  }, []);

  const [amtVal, setAmtVal] = useState(1);
  const [weightVal, setWeightVal] = useState(1);

  const showAmtVal = (newAmt) => {
    setAmtVal(newAmt);
  };

  const showWeightVal = (newWeight) => {
    setWeightVal(newWeight);
  };

  return (
    <div
      style={{
        margin: 0,
        padding: 0,
        backgroundImage: `url(${DeshboardBg})`,
        height: "100%  ",
        overflowY: "hidden",
      }}
    >
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "orange",
          },
        }}
      >
        <div style={{ display: "flex" }}>
          <Sidebar k="2" userType="pai" />

          <div style={{ width: "100%" }}>
            <Header title=" Purchases" />
            <div style={{ padding: 0 }}>
              <Col xs={24} xl={24} style={{ width: "100%", padding: "2%" }}>
                <table style={{ width: "100%" }} cellPadding={10}>
                  <tr>
                    <td>
                      Ingredient name:
                      <br />
                      <Input placeholder="Filter by name"></Input>
                    </td>
                    <td>
                      Date of purchase:
                      <br />
                      <DatePicker></DatePicker>
                    </td>
                    <td>
                      Total amount:
                      <br />
                      <Slider
                        min={1}
                        max={200}
                        onChange={showAmtVal}
                        value={amtVal}
                      ></Slider>
                      <br />
                      <InputNumber
                        value={amtVal}
                        onChange={showAmtVal}
                      ></InputNumber>
                    </td>
                    <td>
                      Weight:
                      <br />
                      <Slider
                        min={1}
                        max={5000}
                        onChange={showWeightVal}
                        value={weightVal}
                      ></Slider>
                      <br />
                      <InputNumber
                        value={weightVal}
                        onChange={showWeightVal}
                      ></InputNumber>
                    </td>
                  </tr>
                </table>

                <label
                  style={{ fontSize: "180%" }}
                  className="dongle-font-class"
                >
                  Recent Purchases
                </label>
                <br />
                <br />
                {purchases && (
                  <List
                    style={{
                      height: "55vh",
                      width: "80vw",
                      overflowY: "scroll",
                      backgroundColor: "transparent",
                    }}
                    dataSource={purchases}
                    renderItem={(item) => (
                      <List.Item>
                        <Card style={{ width: "100%" }}>
                          <Row style={{ width: "100%", textAlign: "left" }}>
                            <Col xs={24} xl={24} style={{ fontSize: "150%" }}>
                              {item.ingredient_name}
                            </Col>
                            <Col xs={12} xl={6}>
                              Purchase Quantity: <br />
                              {item.quantity_loaded} units
                            </Col>
                            <Col xs={12} xl={6}>
                              Vendor Name: <br />
                              {item.vendorName}
                            </Col>
                            <Col xs={12} xl={6}>
                              Date of purchase: <br />
                              {item.updatedAt}
                            </Col>
                            <Col xs={12} xl={6}>
                              Purchase cost: <br />
                              <label style={{ fontSize: "120%" }}>
                                <b>
                                  Rs.{" "}
                                  {item.rate_per_unit * item.quantity_loaded}/-
                                </b>
                              </label>
                            </Col>
                          </Row>
                        </Card>
                        {/* <Card>
                    <label>
                      <b>{item.ingredient_name}</b>
                    </label>
                    <br />
                    <br />
                    Purchase quantity:
                    <br />
                    <label style={{ fontSize: "130%" }}>
                      {item.rate_per_unit}
                    </label>
                    <br />
                    per unit:
                    <br />
                    <label style={{ fontSize: "130%" }}>
                      {item.rate_per_unit}
                    </label>
                  </Card> */}
                      </List.Item>
                    )}
                  />
                )}
                <br />
                <br />
                <br />

                {/* <label style={{ fontSize: "180%" }} className="dongle-font-class">
            Short-on ingredients
          </label> */}

                <br />
                <br />
                {/* <List
            grid={{
              gutter: 16,
              xs: 1,
              sm: 2,
              md: 4,
              lg: 4,
              xl: 4,
              xxl: 3,
            }}
            dataSource={inventory_grid}
            renderItem={(item) => (
              <List.Item>
                <Card>
                  <label>
                    <b>{item.item_name}</b>
                  </label>
                  <br />
                  <br />
                  In Inventory:
                  <br />
                  <label>
                    {item.total_quantity} {item.unit}
                  </label>
                  <br />
                  <br />
                  <Button type="primary">OPEN Purchase</Button>
                </Card>
              </List.Item>
            )}
          /> */}
              </Col>
            </div>
          </div>
        </div>
      </ConfigProvider>
    </div>
  );
};

export default Purchases;
