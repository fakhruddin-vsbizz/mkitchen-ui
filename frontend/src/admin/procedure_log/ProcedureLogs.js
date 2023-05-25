import { ConfigProvider, DatePicker, Tabs } from "antd";
import React, { useEffect, useState } from "react";
import { Card, List, Row, Col } from "antd";
import DeshboardBg from "../../res/img/DeshboardBg.png";
import SideNav from "../../components/navigation/SideNav";
import Header from "../../components/navigation/Header";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

const dateFormatterForToday = () => {
  const dateObj = new Date();
  const formattedDate = `${
    dateObj.getMonth() + 1 < 10
      ? `0${dateObj.getMonth() + 1}`
      : dateObj.getMonth() + 1
  }/${dateObj.getDate()}/${dateObj.getFullYear()}`;
  return formattedDate;
};

const dateFormatter = () => {
  const dateObj = new Date();
  const formattedDate = `${
    dateObj.getMonth() + 1 < 10
      ? `${dateObj.getMonth() + 1}`
      : dateObj.getMonth() + 1
  }/${dateObj.getDate()}/${dateObj.getFullYear()}`;
  return formattedDate;
};

const TodaysDate = dateFormatterForToday();

const newTodaysDate = dateFormatter();

const ProcedureLogs = () => {
  const [selectedDate, setSelectedDate] = useState(newTodaysDate);
  const [menuFoodId, setMenuFoodId] = useState();
  const [reviewData, setReviewData] = useState([]);
  const [totalAshkash, setTotalAshkhaas] = useState(0);
  const [inventoryItems, setInventoryItems] = useState([]);
  const [leftOverItems, setLeftOverItems] = useState([]);

  const [ingridientList, setIngridientList] = useState([]);

  console.log(ingridientList);
  const navigate = useNavigate();
  /**************Restricting Admin Route************************* */

  useEffect(() => {
    const type = localStorage.getItem("type");

    if (!type) {
      navigate("/");
    }

    const typeAdmin = type === "mk admin" ? true : false;

    if (typeAdmin) {
      navigate("/admin/menu/history");
    }
    if (!typeAdmin && type && type === "Cooking") {
      navigate("/cooking/ingredients");
    }
    if (!typeAdmin && type && type === "Procurement Inventory") {
      navigate("/pai/inventory");
    }
  }, [navigate]);

  /**************Restricting Admin Route************************* */

  useEffect(() => {
    const getData = async () => {
      if (selectedDate && menuFoodId) {
        const data = await fetch("/api/review", {
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
  }, [menuFoodId, selectedDate]);

  // useEffect(() => {
  //   const getFood = async () => {
  //     if (TodaysDate) {
  //       const data = await fetch("/api/cooking/ingredients", {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({
  //           type: "get_food_Item",
  //           date: TodaysDate,
  //         }),
  //       });
  //       if (data) {
  //         const res = await data.json();
  //         console.log(res);
  //         if (res) {
  //           console.log(res[0]._id);
  //           setMenuFoodId(res[0]._id);
  //         }
  //       }
  //     }
  //   };
  //   getFood();
  // }, [TodaysDate]);

  useEffect(() => {
    const getInventory = async () => {
      try {
        const data = await fetch("/api/cooking/ingredients", {
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
    dateFormatter();
  }, []);

  useEffect(() => {
    const getHistory = async () => {
      if (menuFoodId) {
        const data = await fetch("/api/admin/menu", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            menu_id: menuFoodId,
            add_type: "get_total_ashkash_sum",
          }),
        });
        if (data) {
          const res = await data.json();
          // setGetMkUserId(res.user);
          setTotalAshkhaas(res);
        }
      }
    };

    getHistory();
  }, [menuFoodId]);

  useEffect(() => {
    const getFood = async () => {
      if (menuFoodId) {
        const data = await fetch("/api/operation_pipeline", {
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
          if (res) {
            setIngridientList(res.data);
            setLeftOverItems(res.leftover);
          }
        }
      }
    };
    getFood();
  }, [menuFoodId]);

  useEffect(() => {
    const getFood = async () => {
      if (selectedDate) {
        const data = await fetch("/api/cooking/ingredients", {
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
          if (res) {
            setMenuFoodId(res[0]._id);
          }
        }
      }
    };
    getFood();
  }, [selectedDate]);

  useEffect(() => {
    const getData = async () => {
      if (selectedDate && menuFoodId) {
        const data = await fetch("/api/review", {
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

  const handleDateChange = (date) => {
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
            comp={
              <Row>
                <Col style={{ marginRight: 10, fontSize: 18 }}>
                  Select date for showing history:{" "}
                </Col>
                <Col>
                  <DatePicker
                    defaultValue={dayjs(TodaysDate, "MM/DD/YYYY")}
                    onChange={handleDateChange}
                  />
                </Col>
              </Row>
            }
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
                                  Review: &nbsp;&nbsp;&nbsp; {item.review}/5
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
                    {ingridientList && (
                      <List
                        dataSource={ingridientList}
                        renderItem={(item, index) => (
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
                                      {inventoryItems
                                        .filter(
                                          (inventory) =>
                                            inventory._id ===
                                            item.inventory_item_id
                                        )
                                        .map(
                                          (ele) => ele.ingridient_measure_unit
                                        )}
                                    </b>
                                  </center>
                                </Col>
                                <Col xs={12} xl={6}>
                                  <center>
                                    Leftover amount:
                                    <br />
                                    <b>
                                      {leftOverItems && leftOverItems[index] ? (
                                        leftOverItems[index].leftover_amount
                                      ) : (
                                        <label>No Leftovers</label>
                                      )}
                                      {leftOverItems &&
                                        leftOverItems[index] &&
                                        inventoryItems
                                          .filter(
                                            (inventory) =>
                                              inventory._id ===
                                              item.inventory_item_id
                                          )
                                          .map(
                                            (ele) => ele.ingridient_measure_unit
                                          )}
                                    </b>
                                  </center>
                                </Col>
                                <Col xs={12} xl={6}>
                                  <center>
                                    <label style={{ fontSize: "120%" }}>
                                      Rs.
                                      {inventoryItems
                                        .filter(
                                          (inventory) =>
                                            inventory._id ===
                                            item.inventory_item_id
                                        )
                                        .map(
                                          (filteredItem) =>
                                            filteredItem.price * totalAshkash
                                        )}
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
