import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  List,
  ConfigProvider,
  Input,
  Card,
  Button,
  Tag,
  DatePicker,
  Alert,
} from "antd";
import Header from "../../components/navigation/Header";
import Sidebar from "../../components/navigation/SideNav";
import DeshboardBg from "../../res/img/DeshboardBg.png";
import { MinusCircleFilled, PlusCircleFilled } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

import dayjs from "dayjs";
import { colorBackgroundColor, colorBlack, colorGreen, colorNavBackgroundColor, valueShadowBox } from "../../colors";
import { baseURL } from "../../constants";


const dateFormatterForToday = () => {
  const dateObj = new Date();
  const formattedDate = `${
    (dateObj.getMonth() + 1) < 10
      ? `0${dateObj.getMonth() + 1}`
      : dateObj.getMonth() + 1
  }/${(dateObj.getDate()) < 10
    ? `0${dateObj.getDate()}`
    : dateObj.getDate()}/${dateObj.getFullYear()}`;
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

const PostConfirmOps = () => {
  const [menuFoodId, setMenuFoodId] = useState();
  const [selectedDate, setSelectedDate] = useState(newTodaysDate);
  const [foodItems, setFoodItems] = useState(null);
  const [reorderLogs, setReorderLogs] = useState([]);
  const [update, setUpdate] = useState(true);
  const [status, setStatus] = useState();

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
      navigate("/");
    }

    const typeAdmin = type === "mk admin" ? true : false;

    if (typeAdmin) {
      navigate("/admin/menu");
    }
    if (!typeAdmin && type && type === "Cooking") {
      navigate("/cooking/ingredients");
    }
    if (!typeAdmin && type && type === "Procurement Inventory") {
      navigate("/pai/procurement/post");
    }
  }, [navigate]);

  /**************Restricting PandI Route************************* */
  //getting the status from operational pipeline
  useEffect(() => {
    const getFood = async () => {
      if (menuFoodId) {
        const data = await fetch("/api/operation_pipeline", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type: "get_status_op",
            menu_id: menuFoodId,
          }),
        });
        if (data) {
          const res = await data.json();
          setStatus(res);
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
            setFoodItems(res[0].food_list);
          }
        }
      }
    };
    getFood();
  }, [selectedDate]);

  useEffect(() => {
    const getData = async () => {
      if (selectedDate && menuFoodId) {
        const data = await fetch("/api/operation_pipeline", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type: "get_reorder_data",
            date: selectedDate,
            menu_id: menuFoodId,
          }),
        });

        if (data) {
          const res = await data.json();
          if (res) {
            setReorderLogs(res.reorder_logs);
          }
        }
      }
    };
    getData();
  }, [selectedDate, menuFoodId, update]);

  const updateReorderStatus = async (id, quantity_requireds, foodId) => {
    console.log(id, quantity_requireds, foodId);
    try {
      const data = await fetch("/api/operation_pipeline", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          menu_id: menuFoodId,
          type: "update_operation_pipeline_reorder_status",
          inventory_id: id,
          foodId: foodId,
          procured_Amount: Number(quantity_requireds.toFixed(3))
        }),
      }).then( res => res.json()).then(data => setUpdate((prev) => !prev)).catch(err => {console.log("fetch1", err)})

  // //     Promise.all([fetch("/api/operation_pipeline", {
  // //       method: "PUT",
  // //       headers: {
  // //         "Content-Type": "application/json",
  // //       },
  // //       body: JSON.stringify({
  // //         menu_id: menuFoodId,
  // //         type: "update_operation_pipeline_reorder_status",
  // //         inventory_id: id,
  // //         procured_Amount: Number(quantity_requireds.toFixed(2))
  // //       }),
  // //     }).then( res => res.json()).then(data => setUpdate((prev) => !prev)).catch(err => {
  // //       console.log("fetch1", err);
  // //   }),
  // //   fetch("/api/operation_pipeline/updateInventoryAmount", {
  // //     method: "POST",
  // //     headers: {
  // //       "Content-Type": "application/json",
  // //     },
  // //     body: JSON.stringify({
  // //       inventory_id: id,
  // //       procured_Amount: +quantity_requireds
  // //     }),
  // //   }).catch(err => {
  // //     console.log("fetch1", err);
  // // }),
  // //   fetch("/api/operation_pipeline/changeProcurementAmount", {
  // //     method: "POST",
  // //     headers: {
  // //       "Content-Type": "application/json",
  // //     },
  // //     body: JSON.stringify({
  // //       menu_id: menuFoodId,
  // //       inventory_id: id,
  // //       procured_Amount: +quantity_requireds
  // //     }),
  // //   }).catch(err => {
  // //     console.log("fetch1", err);
  // // })])
    } catch (error) {
      console.log(error);
    }
  };

  const handleDateChange = (date) => {
    const dateObj = new Date(date);
    const formattedDate = `${
      dateObj.getMonth() + 1
    }/${dateObj.getDate()}/${dateObj.getFullYear()}`;
    setSelectedDate(formattedDate);
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
        <div style={{ display: "flex", backgroundColor: colorNavBackgroundColor }}>
          {localStorage.getItem("type") === "mk superadmin" ? <Sidebar k="12" userType="superadmin" /> :
          <Sidebar k="4" userType="pai" />}

          <div style={{ width: "100%", backgroundColor: colorBackgroundColor }}>
            <Header
              title="Post Procurement"
              comp={
                <Row style={{justifyContent: 'flex-end'}}>
                <Col xs={24} xl={12}>
                  <span style={{fontSize: '1.1rem'}}>
                  Select the date:&nbsp;
                  </span>
              <DatePicker
                defaultValue={dayjs(TodaysDate, "MM/DD/YYYY")}
                onChange={handleDateChange}
              />
              </Col>
              </Row>
              }
            />
            {status < 2 ? (
              <center>
              <div style={{ marginTop: '8%', marginBottom: '8%' }}>
                <label style={{ fontSize: '800%', color: colorGreen }}>
                  <i class="fa-solid fa-hourglass-start"></i>
                </label>
                <br/>
                <label style={{ fontSize: '120%', width:'50%' }}>Procurement is not done yet. Please wait or try again later.</label>
              </div>
            </center>
            ) : (
                <div style={{ width: "100%", padding: 0 }}>
                  <div style={{ padding: "3%" }}>
                    {/* <label
                      style={{ fontSize: "180%" }}
                      className="dongle-font-class"
                    >
                      Food Item Cooking Status
                    </label>
                    {foodItems && status >= 2 && (
                      <List
                        grid={{
                          gutter: 16,
                          xs: 1,
                          sm: 2,
                          md: 4,
                          lg: 4,
                          xl: 6,
                          xxl: 3,
                        }}
                        dataSource={foodItems}
                        renderItem={(item) => (
                          <List.Item>
                            <Card
                              style={{
                                margin: 5,
                                width: "100%",
                                // color: '#e08003',
                                backgroundColor: "white",
                                padding: "2%",
                                borderRadius: 10,
                                border: "2px solid darkred",
                              }}
                              bodyStyle={{padding: '12px'}}
                            >
                              <span style={{fontSize: "1.3rem", fontWeight: '600'}}>{item.food_name}</span>
                             
                            </Card>
                          </List.Item>
                        )}
                      />
                    )}
                    <br />
                    <br /> */}
                    <label
                      style={{ fontSize: "180%" }}
                      className="dongle-font-class"
                    >
                      Re-order Logs
                    </label>
                    {(reorderLogs && status >= 2) ? (
                      <div>
                        <List
                          style={{
                            maxHeight: "68vh",
                            width: "100%",
                            overflowY: "scroll",
                            backgroundColor: "transparent",
                          }}
                          dataSource={reorderLogs}
                          renderItem={(item) => (
                            <List.Item>
                              <Card style={{ margin: "0px 10px", width: "100%", 
                              // border: '2px solid darkred'
                                boxShadow: valueShadowBox,
                             }}
                              bodyStyle={{padding: '12px'}}
                              >
                                <Row>
                                  <Col xs={8} xl={6} style={{alignSelf: 'center', paddingLeft:'2rem',  fontSize: '1.5rem'}}>
                                    <span>
                                      For:&nbsp;
                                    </span>
                                    <span style={{color: colorGreen}}>
                                    {item?.foodName}
                                    </span>
                                  </Col>
                                  <Col xs={8} xl={6} style={{alignSelf: 'center', paddingLeft:'0',  fontSize: '1.5rem'}}>
                                    <span>
                                      Ingredient:&nbsp;
                                    </span>
                                    <span style={{color: colorGreen}}>
                                    {item.ingridient_name}
                                    </span>
                                  </Col>
                                  <Col xs={8} xl={6} style={{alignSelf: 'center', paddingLeft:'2rem',  fontSize: '1.3rem'}}>
                                    <span>
                                    Required quantity:&nbsp;
                                    <span style={{color: colorGreen}}>
                                    {item.quantity_requireds}
                                    </span>
                                    {" "}<span style={{textTransform: 'capitalize', color: colorGreen}}>
                                      {item.unit}
                                      </span> 
                                    </span>
                                  </Col>
                                  <Col xs={8} xl={6} style={{alignSelf: 'center', textAlign: 'center'}}>
                                    {item.reorder_delivery_status ? (
  
                                        <Button
                                          onClick={(e) =>
                                            updateReorderStatus(item.inventory_id, item.quantity_requireds, item.foodId)
                                          }
                                          type="primary"
                                        >
                                          FULLFILL ORDER
                                        </Button>
                                      
                                    ) : (
                                      <Tag color="green">FULFILLED</Tag>
                                    )}
                                  </Col>
                                </Row>
                              </Card>
                            </List.Item>
                          )}
                        />
                      </div>
                    ) : (
                      <div style={{ marginBottom: '8%', width:'30%', border:'0.5px solid black', padding:'5%', borderRadius:'10px' }}>
                        <center>
                          <label style={{ fontSize: '200%', color: colorGreen }}>
                          <i class="fa-brands fa-creative-commons-zero"></i>
                          </label>
                          <br/>
                          <label style={{ fontSize: '100%', width:'50%' }}>For now, there are no reorders for this menu</label>
                        </center>
                      </div>
                    )}
                    
                    
                  </div>
                </div>
              )
            }
            
          </div>
        </div>
      </ConfigProvider>
    </div>
  );
};

export default PostConfirmOps;
