import React, { useEffect, useState } from "react";
import './procedurelog.css';
import { ConfigProvider, DatePicker, Rate, Tabs } from "antd";
import { Card, List, Row, Col } from "antd";
import DeshboardBg from "../../res/img/DeshboardBg.png";
import SideNav from "../../components/navigation/SideNav";
import Header from "../../components/navigation/Header";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

const dateFormatterForToday = () => {
  const dateObj = new Date();
  const formattedDate = `${
    (dateObj.getMonth() + 1) < 10
      ? `0${dateObj.getMonth() + 1}`
      : dateObj.getMonth() + 1
  }/${(dateObj.getDate()) < 10
    ? `0${dateObj.getDate()}`
    : dateObj.getDate()}/${dateObj.getFullYear()}`;
  console.log(formattedDate);
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
  const [menuFoodId, setMenuFoodId] = useState("");
  const [reviewData, setReviewData] = useState([]);
  const [totalAshkash, setTotalAshkhaas] = useState(0);
  const [inventoryItems, setInventoryItems] = useState([]);
  const [leftOverItems, setLeftOverItems] = useState([]);
  const [daigData, setDaigData] = useState([]);

  const [ingridientList, setIngridientList] = useState([]);
  const [foodList, setFoodList] = useState([]);

  const [pipelineData, setPipelineData] = useState({});

  const [totalPrice, setTotalPrice] = useState([]);

  const [dispatchData, setDispatchData] = useState([])

  // console.log(ingridientList);
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
            setReviewData(res?.menuDelivery);
            setDispatchData(res?.dispatchData);
            console.log(res);
          }
        }
      }
    };
    getData();
  }, [menuFoodId, selectedDate]);

  useEffect(() => {
    const getData = async () => {
      if (menuFoodId) {
        const data = await fetch("/api/review/admin_history", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            menuFoodId: menuFoodId,
          }),
        });

        if (data) {
          const res = await data.json();
          if (res) {
            setDaigData(res);
            console.log(res);
          }
        }
      }
    };
    getData();
  }, [menuFoodId]);
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
            console.log(res.leftover);
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
            setMenuFoodId(res[0]?._id ? res[0]._id: "");
          }
        }
      }
    };
    getFood();
  }, [selectedDate]);

  useEffect(()=>{
    const getPipeline = async() => {
    try {
      const res = await fetch("/api/operation_pipeline", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "get_full_pipeline",
          menu_id: menuFoodId,
        }),
      })
      const data = await res.json()
      setPipelineData(data)
      setFoodList(data?.menu_food_data[0].food_list)
      console.log(data?.menu_food_data[0].food_list);
      console.log(data)
      try {
        const res = await fetch("/api/operation_pipeline/getTotalPrices", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            menu_id: menuFoodId,
          }),
        })
        const data = await res.json()
        setTotalPrice(data);
        console.log("priceList", data);
      } catch (error) {
        
      }
    } catch (error) {
      console.log(error);
    }
  }
  getPipeline();
  },[menuFoodId])

  // useEffect(() => {
  //   const getData = async () => {
  //     if (selectedDate && menuFoodId) {
  //       const data = await fetch("/api/review", {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({
  //           type: "get_review",
  //           // date: selectedDate,
  //           menu_id: menuFoodId,
  //         }),
  //       });

  //       if (data) {
  //         const res = await data.json();
  //         if (res) {
  //           setReviewData(res);
  //         }
  //       }
  //     }
  //   };
  //   getData();
  // }, [selectedDate, menuFoodId]);

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
                  Select date:{" "}
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
                  colorPrimary: "darkred",
                  colorDanger: "",
                },
              }}
            >
              <Tabs centered style={{ color: "darkred", border: "none", maxHeight: "70vh" }}>
                <Tabs.TabPane
                  style={{ border: "none" }}
                  tab="Menu Decision & Delivery"
                  key="1"
                >
                  <Card
                    style={{width: "96%", marginLeft: "1%", overflowY: "scroll", overflowX: "hidden", maxHeight:'68vh' }}
                    bodyStyle={{padding: '0', width: '80vw', backgroundColor:'transparent'}}
                  >
                    {/* <h2 style={{ color: "#e08003" }}>
                      Menu Decision & Delivery
                    </h2> */}
                    {reviewData.length > 0 ? (
                      <List
                        dataSource={reviewData}
                        renderItem={(item, index) => (
                          <List.Item
                            style={{ border: "none", padding: "0px" }}
                          >
                            <div
                              style={{
                                padding: 10,
                                backgroundColor: "#fff",
                                borderRadius: 5,
                                border: "2px solid darkred",
                                width: "100%",
                              }}
                            >
                              <Row style={{ display: "flex", alignItems: 'center'}}>
                                <Col xs={12} xl={7} style={{ padding: "1%"}}>
                                  <label
                                    style={{
                                      fontSize: "150%",
                                      fontWeight: 700,
                                    }}
                                  >
                                    <span>
                                      <i className="fa-solid fa-house-user"></i>
                                      &nbsp;&nbsp;{item.username}
                                    </span>
                                  </label>
                                </Col>
                                <Col xs={6} xl={7}>
                                <i className="fa-solid fa-star"></i>&nbsp;&nbsp;Ratings (out of 5):
                                  <Rate disabled allowHalf defaultValue={+item.review} />
                                </Col>
                                <Col xs={6} xl={9}>
                                <i className="fa-solid fa-magnifying-glass"></i>
                                    &nbsp;&nbsp;Review :
                                  <label style={{}}>
                                    {item.remark}
                                  </label>
                                </Col>
                              </Row>
                                {dispatchData.filter(filterDispatch => filterDispatch?.mk_id === item.user_data[0]?.email)[0]?.dispatch.map(newItem => (
                                  <Row>
                                  <Col xs={6} xl={5} style={{marginLeft: "12px" }}>
                                  Food Name:&nbsp;
                                  <label style={{}}>
                                    {newItem.food_name}
                                  </label>
                                </Col>
                                  <Col xs={6} xl={5} style={{marginLeft: "12px" }}>
                                  <i className="fa-solid fa-flask"></i>&nbsp;&nbsp;Total Shipment:&nbsp;
                                  <label style={{}}>
                                    {newItem?.no_of_deigh}&nbsp;<span style={{textTransform: 'capitalize'}}>{newItem?.containerType}</span>
                                  </label>
                                </Col>
                                <Col xs={6} xl={5}>
                                <i className="fa-solid fa-scale-unbalanced-flip"></i>&nbsp;&nbsp;Total <span style={{textTransform: 'capitalize'}}>{newItem?.unitValueType}</span> :&nbsp; 
                                  <label style={{}}>
                                    {newItem?.total_weight}&nbsp;{newItem?.unitValueType === "weight" ? "Kg": newItem?.newItem?.unitValueType === "liters" ? "Liters" : "Piece"}
                                  </label>
                                </Col>
                                <Col xs={6} xl={8}>
                                  <center>
                                  <i className="fa-solid fa-truck-ramp-box"></i>&nbsp;&nbsp;Delivery Status:&nbsp;
                                    <label style={{}}>
                                      
                                      {newItem?.delivery_status === "completed" ? (
                                        <label style={{ color: "green" }}>
                                          <i className="fa-solid fa-circle-check"></i>{" "}
                                          Delivered
                                        </label>
                                      ) : (
                                        <label style={{ color: "orange" }}>
                                          <i className="fa-regular fa-clock"></i>{" "}
                                          Pending
                                        </label>
                                      )}
                                    </label>
                                  </center>
                                </Col>
                                  </Row>
                    ))}
                            </div>
                          </List.Item>
                        )}
                      />
                    ) : (
                      <center>
                        <div style={{ marginTop: "8%", marginBottom: "8%" }}>
                          <label style={{ fontSize: "800%", color: "darkred" }}>
                            <i className="fa-solid fa-hourglass-start"></i>
                          </label>
                          <br />
                          <label style={{ fontSize: "120%", width: "50%" }}>
                            There are no reviews from customers. Please visit after some
                            time.
                          </label>
                        </div>
                      </center>
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
                                      <i className="fa-solid fa-circle-check"></i>{" "}
                                      Delivered
                                    </div>
                                 
                                    <div>
                                      <i className="fa-regular fa-clock"></i>{" "}
                                      Pending
                                    </div>
                               
                                </Col>
                                <Col xs={6} xl={6}>
                                  <i className="fa-solid fa-star"></i>{" "}
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
                  <Card
                   style={{ width: "96%", marginLeft: "1%", backgroundColor: 'transparent', overflowY: "scroll", overflowX: "hidden", overflowX: "hidden", maxHeight:'68vh' }} bodyStyle={{ padding: '0', width: '80vw'}} >
                    {/* <h2 style={{ color: "#e08003" }}>
                      Ingredients for the menu
                    </h2> */}
                    {ingridientList.length > 0 ? (
                        foodList.map(foodItem => (
                          <div key={foodItem.food_item_id}>
                            <Row>
                                <Col xs={12} xl={12} style={{ padding: "1%" }}>
                                  <label style={{ fontSize: "1.3rem" }}>
                                    {foodItem.food_name}
                                  </label>
                                </Col>
                                <Col xs={12} xl={12} style={{ padding: "1%" }}>
                                  <label style={{ fontSize: "1.3rem" }}>
                                    {totalPrice.filter(filteredPrice => filteredPrice.foodId === foodItem.food_item_id)[0]?.price}&nbsp;₹
                                  </label>
                                </Col>
                            </Row>
                            <List
                              dataSource={pipelineData?.ingridient_list.filter(filterFoodItem => filterFoodItem.foodId === foodItem.food_item_id)}
                              renderItem={(item, index) => (
                                <List.Item style={{ border: "none", padding: "0px", marginBottom: '5px' }}>
                                  <div
                                    style={{
                                      padding: 10,
                                      backgroundColor: "#fff",
                                      borderRadius: 5,
                                      border: "2px solid darkred",
                                      width: "100%",
                                    }}
                                  >
                                    <Row>
                                      <Col xs={12} xl={6} style={{ padding: "1%" }}>
                                        <label style={{ fontSize: "1.3rem" }}>
                                          <i className="fa-solid fa-mortar-pestle"></i>{" "}
                                          &nbsp;{item.ingredient_name}
                                        </label>
                                      </Col>
                                      <Col xs={12} xl={6}>
                                        Required Amount: <br />
                                        <label style={{ fontSize: "120%" }}>
                                          <i className="fa-solid fa-scale-unbalanced"></i>{" "}
                                          &nbsp;
                                          {item.procure_amount}{" "}
                                          {inventoryItems
                                            .filter(
                                              (inventory) =>
                                                inventory._id ===
                                                item.inventory_item_id
                                            )
                                            .map(
                                              (ele) => ele.ingridient_measure_unit
                                            )}
                                        </label>
                                        
                                          {item?.reorders && item?.reorders.length !== 0 ? <span style={{fontSize: '1rem', color:'red'}}>+{item?.reorders.reduce((a,b)=> a.quantity_requireds + b.quantity_requireds)}&nbsp;{inventoryItems
                                            .filter(
                                              (inventory) =>
                                                inventory._id ===
                                                item.inventory_item_id
                                            )
                                            .map(
                                              (ele) => ele.ingridient_measure_unit
                                            )}</span> : null}
                                        
                                        {/* <label style={{ color:'darkgreen' }}>+ 2 KGs reordered</label><br/>
                                        <label style={{ color:'darkgreen' }}>+ 2 KGs reordered</label><br/> */}
                                      </Col>
                                      <Col xs={12} xl={6}>
                                        Leftover amount:
                                        <br />
                                        <label style={{ fontSize: "120%" }}>
                                          <i className="fa-solid fa-chart-pie"></i>{" "}
                                          &nbsp;
                                          {leftOverItems && leftOverItems.filter(newItem => newItem.foodId === item.foodId && newItem.inventory_id === item.inventory_item_id
                                            )[0]?.leftover_amount !== undefined ? (
                                            <>
                                            <span style={{fontSize: '1rem', color:'green'}}>
                                            {leftOverItems.filter(newItem => newItem.foodId === item.foodId && newItem.inventory_id === item.inventory_item_id
                                            )[0]?.leftover_amount}&nbsp;{inventoryItems
                                              .filter(
                                                (inventory) =>
                                                  inventory._id ===
                                                  item.inventory_item_id
                                              )
                                              .map(
                                                (ele) => ele.ingridient_measure_unit
                                              )}
                                            </span>
                                            </>
                                          ) : (
                                            <label>No Leftovers</label>
                                          )}
                                          
                                        </label>
                                      </Col>
                                      <Col xs={12} xl={6}>
                                        Procurement Cost:
                                        <br />
                                        <label style={{ fontSize: "120%" }}>
                                          <i className="fa-solid fa-indian-rupee-sign"></i>
                                          &nbsp;
                                          {inventoryItems
                                            .filter(
                                              (inventory) =>
                                                inventory._id ===
                                                item.inventory_item_id
                                            )
                                            .map((filteredItem) =>{
                                              return (
                                                filteredItem.price * item.procure_amount
                                              ).toFixed(2)}
                                            )}
                                          &nbsp; / -
                                        </label>
                                      </Col>
                                    </Row>
                                  </div>
                                </List.Item>
                              )}
                            />
                          </div>
                        ))
                      
                    ) : (
                      <center>
                        <div style={{ marginTop: "8%", marginBottom: "8%" }}>
                          <label style={{ fontSize: "800%", color: "darkred" }}>
                            <i className="fa-solid fa-hourglass-start"></i>
                          </label>
                          <br />
                          <label style={{ fontSize: "120%", width: "50%" }}>
                            Food is not cooked yet. Please visit after some
                            time.
                          </label>
                        </div>
                      </center>
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
