import { ConfigProvider, DatePicker, Tabs } from "antd";
import React, { useEffect, useState } from "react";
import { Card, List, Row, Col } from "antd";
import DeshboardBg from "../../res/img/DeshboardBg.png";
import SideNav from "../../components/navigation/SideNav";
import Header from "../../components/navigation/Header";

const ProcedureLogs = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [menuFoodId, setMenuFoodId] = useState();
  const [reviewData, setReviewData] = useState([]);
  const [totalAshkash, setTotalAshkhaas] = useState(0);

  const [ingridientList, setIngridientList] = useState([]);

  useEffect(() => {
    const getHistory = async () => {
      if (selectedDate !== "1/1/1970") {
        const data = await fetch("http://localhost:5001/api/menu/history", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            date: selectedDate,
          }),
        });
        if (data) {
          const res = await data.json();
          // setGetMkUserId(res.user);
          setTotalAshkhaas(res?.totalAshkhaas);
          console.log("getFood menu/history ==============> ", res);
        }
      }
    };

    getHistory();
  }, [selectedDate]);

  useEffect(() => {
    const getFood = async () => {
      if (menuFoodId) {
        const data = await fetch("http://localhost:5001/operation_pipeline", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type: "get_ingridient_list",
            menu_id: menuFoodId,
          }),
        });
        if (data) {
          const res = await data.json();
          console.log(res);
          if (res) {
            setIngridientList(res);
            console.log("==============> ", ingridientList);
            console.log("getFood operation_pipeline ==============> ", res);
          }
        }
      }
    };
    getFood();
  }, [menuFoodId]);

  useEffect(() => {
    const getFood = async () => {
      if (selectedDate) {
        const data = await fetch("http://localhost:5001/cooking/ingredients", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type: "get_food_Item",
            date: selectedDate,
          }),
        });
        if (data) {
          const res = await data.json();
          console.log(res);
          if (res) {
            setMenuFoodId(res[0]._id);
            console.log("getFood ingredients ==============> ", res);
          }
        }
      }
    };
    getFood();
  }, [selectedDate]);

  useEffect(() => {
    const getData = async () => {
      if (selectedDate && menuFoodId) {
        const data = await fetch("http://localhost:5001/review", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type: "get_review",
            // date: selectedDate,
            menu_id: menuFoodId,
          }),
        });

        if (data) {
          const res = await data.json();
          if (res) {
            setReviewData(res);
          }
        }
      }
    };
    getData();
  }, [selectedDate, menuFoodId]);

  const mohalla_user_data = [
    {
      mohalla_user: "Fakhri Mohalla",
      count: 240,
      total_daig_count: 12,
      total_weight: 2400,
      delivery_status: true,
      rating: 3,
      review: "N/A",
    },
    {
      mohalla_user: "Badshah Nagar",
      count: 240,
      total_daig_count: 12,
      total_weight: 2400,
      delivery_status: true,
      rating: 3,
      review: "N/A",
    },
    {
      mohalla_user: "Konark Pooram",
      count: 240,
      total_daig_count: 12,
      total_weight: 2400,
      delivery_status: false,
      rating: 3,
      review: "N/A",
    },
    {
      mohalla_user: "Hatimi Mohalla",
      count: 240,
      total_daig_count: 12,
      total_weight: 2400,
      delivery_status: false,
      rating: 3,
      review: "N/A",
    },
    {
      mohalla_user: "Taiyabi Mohalla",
      count: 240,
      total_daig_count: 12,
      total_weight: 2400,
      delivery_status: true,
      rating: 3,
      review: "N/A",
    },
  ];

  const ingredients_inventory = [
    {
      ingredient_name: "Goat Meat",
      required_amount: 1200,
      unit: "KG",
      per_unit_price: 12,
      left_item: 200,
    },
    {
      ingredient_name: "Pudina Masala",
      required_amount: 200,
      unit: "Packet",
      per_unit_price: 12,
      left_item: 200,
    },
    {
      ingredient_name: "Sunflower Oil",
      required_amount: 1200,
      unit: "L",
      per_unit_price: 12,
      left_item: 200,
    },
    {
      ingredient_name: "Rawa",
      required_amount: 1200,
      unit: "KG",
      per_unit_price: 12,
      left_item: 200,
    },
    {
      ingredient_name: "Govardhan Ghee",
      required_amount: 1200,
      unit: "KG",
      per_unit_price: 12,
      left_item: 200,
    },
    {
      ingredient_name: "Moong Dal",
      required_amount: 3500,
      unit: "KG",
      per_unit_price: 12,
      left_item: 200,
    },
    {
      ingredient_name: "Basmati Rice",
      required_amount: 3500,
      unit: "KG",
      per_unit_price: 12,
      left_item: 500,
    },
    {
      ingredient_name: "Eggs",
      required_amount: 12,
      unit: "Dozens",
      per_unit_price: 12,
      left_item: 0.5,
    },
  ];
  const handleDateChange = (date) => {
    console.log(date);
    const dateObj = new Date(date);
    const formattedDate = `${
      dateObj.getMonth() + 1
    }/${dateObj.getDate()}/${dateObj.getFullYear()}`;
    setSelectedDate(formattedDate);
  };

  return (
    <div
      style={{ margin: 0, padding: 0, backgroundImage: `url(${DeshboardBg})` }}
    >
      <div style={{ display: "flex" }}>
        <SideNav k="2" userType="admin" />
        <div style={{ width: "100%" }}>
          <Header
            title="Process Log"
            comp=<Row>
              <Col style={{ marginRight: 10, fontSize: 18 }}>
                Select date for showing history:{" "}
              </Col>
              <Col>
                <DatePicker onChange={handleDateChange} />
              </Col>
            </Row>
          />
          <div style={{ padding: "1%" }}>
            <ConfigProvider
              theme={{
                token: {
                  colorPrimary: "orange",
                  colorDanger: "",
                },
              }}
            >
              <Tabs centered style={{ color: "#E86800", border: "none" }}>
                <Tabs.TabPane
                  style={{ border: "none" }}
                  tab="Menu Decision & Delivery"
                  key="1"
                >
                  <Card
                    style={{
                      width: "95%",
                      marginLeft: "2%",
                      backgroundColor: "transparent",
                      border: "none",
                    }}
                  >
                    {/* <h2 style={{ color: "#e08003" }}>
                      Menu Decision & Delivery
                    </h2> */}

                    {console.log(reviewData)}
                    {reviewData && (
                      <List
                        style={{ width: "100%" }}
                        dataSource={reviewData}
                        renderItem={(item) => (
                          <List.Item
                            style={{
                              padding: 15,
                              display: "flex",
                              backgroundColor: "#fff",
                              borderRadius: 10,
                              borderBottom: "2px solid orange",
                              width: "100%",
                              margin: "10px 0px",
                            }}
                          >
                            <Card
                              style={{
                                width: "100%",
                                borderColor: "transparent",
                                color: "#e08003",
                              }}
                            >
                              <Row>
                                <Col xs={12} xl={4}>
                                  <label style={{ fontSize: "120%" }}>
                                    <span>{item.username}</span>
                                  </label>
                                </Col>
                                <Col xs={6} xl={4}>
                                  Total Daigh: 2
                                </Col>
                                <Col xs={6} xl={4}>
                                  Total Weight : 180
                                </Col>
                                <Col xs={6} xl={4}>
                                <i class="fa-solid fa-star"></i>{" "}
                                  &nbsp;&nbsp;&nbsp; {item.review}/5
                                </Col>
                                <Col xs={6} xl={4}>
                                  Review: 
                                  &nbsp;&nbsp;&nbsp; {item.review}/5
                                </Col>
                                <Col xs={6} xl={4}>
                                {item.review ? (
                                    <div>
                                      <i class="fa-solid fa-circle-check"></i>{" "}
                                      Delivered
                                    </div>
                                  ) : (
                                    <div>
                                      <i class="fa-regular fa-clock"></i>{" "}
                                      Pending
                                    </div>
                                  )}
                                </Col>
                              </Row>
                            </Card>
                          </List.Item>
                        )}
                      />
                    )}
                      {/* <List
                        style={{ width: "100%" }}
                        dataSource={reviewData}
                        renderItem={(item) => (
                          <List.Item
                            style={{
                              padding: 20,
                              display: "flex",
                              backgroundColor: "#fff",
                              borderRadius: 10,
                              borderBottom: "2px solid orange",
                              width: "100%",
                              margin: "10px 0px",
                            }}
                          >
                            <Card
                              style={{
                                width: "100%",
                                borderColor: "transparent",
                                color: "#e08003",
                              }}
                            >
                              <Row>
                                <Col xs={12} xl={12}>
                                  <label style={{ fontSize: "120%" }}>
                                    <span>h</span>
                                  </label>
                                </Col>

                                <Col xs={6} xl={6}>
                                    <div>
                                      <i class="fa-solid fa-circle-check"></i>{" "}
                                      Delivered
                                    </div>
                                 
                                    <div>
                                      <i class="fa-regular fa-clock"></i>{" "}
                                      Pending
                                    </div>
                               
                                </Col>
                                <Col xs={6} xl={6}>
                                  <i class="fa-solid fa-star"></i>{" "}
                                  &nbsp;&nbsp;&nbsp; 5/5
                                </Col>
                              </Row>
                            </Card>
                          </List.Item>
                        )}
                      /> */}
                
                  </Card>
                </Tabs.TabPane>
                <Tabs.TabPane tab="Ingredients for the menu" key="2">
                  <Card style={{ width: "85%", marginLeft: "4%" }}>
                    {/* <h2 style={{ color: "#e08003" }}>
                      Ingredients for the menu
                    </h2> */}

                    {console.log(ingridientList)}
                    {ingridientList && (
                      <List
                        dataSource={ingridientList}
                        renderItem={(item) => (
                          <List.Item style={{ border: "none" }}>
                            <Card style={{ width: "100%", border: "none" }}>
                              <Row
                                style={{
                                  padding: 20,
                                  display: "flex",
                                  backgroundColor: "#fff",
                                  borderRadius: 10,
                                  borderBottom: "2px solid orange",
                                  width: "100%",
                                  color: "#e08003",
                                }}
                              >
                                <Col xs={12} xl={6}>
                                  <center>
                                    <label style={{ fontSize: "120%" }}>
                                      {item.ingredient_name}
                                    </label>
                                  </center>
                                </Col>
                                <Col xs={12} xl={6}>
                                  <center>
                                    Required Amount:
                                    <br />
                                    <b>
                                      {item.perAshkash * totalAshkash}{" "}
                                      {item.unit}
                                    </b>
                                  </center>
                                </Col>
                                <Col xs={12} xl={6}>
                                  <center>
                                    Leftover amount:
                                    <br />
                                    <b>
                                      {item.leftover_amount} {item.unit}
                                    </b>
                                  </center>
                                </Col>
                                <Col xs={12} xl={6}>
                                  <center>
                                    <label style={{ fontSize: "120%" }}>
                                      Rs.
                                      {item.per_unit_price *
                                        item.required_amount}
                                      /-
                                    </label>
                                  </center>
                                </Col>
                              </Row>
                            </Card>
                          </List.Item>
                        )}
                      />
                    )}
                    {/* <Card style={{ width: "100%", border: "none" }}>
											<Row
												style={{
													padding: 20,
													display: "flex",
													backgroundColor: "#fff",
													borderRadius: 10,
													border: "2px solid orange",
													width: "100%",
													color: "orange",
												}}>
												<Col xs={12} xl={6}>
													<center>
														<label style={{ fontSize: "150%" }}>
															<b>Total</b>
														</label>
													</center>
												</Col>
												<Col xs={12} xl={6}></Col>
												<Col xs={12} xl={6}></Col>
												<Col xs={12} xl={6}>
													<center>
														<b style={{ fontSize: "150%" }}>Rs. 60000/-</b>
													</center>
												</Col>
											</Row>
										</Card> */}
                  </Card>
                </Tabs.TabPane>
              </Tabs>
            </ConfigProvider>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProcedureLogs;
