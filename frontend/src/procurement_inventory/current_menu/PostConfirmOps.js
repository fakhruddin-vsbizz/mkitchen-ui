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

const PostConfirmOps = () => {
  const [menuFoodId, setMenuFoodId] = useState();
  const [selectedDate, setSelectedDate] = useState(null);
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
      navigate("/pai/procurement/post");
    }
  }, [navigate]);

  /**************Restricting PandI Route************************* */
  //getting the status from operational pipeline
  useEffect(() => {
    const getFood = async () => {
      if (menuFoodId) {
        const data = await fetch("http://localhost:5001/operation_pipeline", {
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
        const data = await fetch("http://localhost:5001/operation_pipeline", {
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

  const updateReorderStatus = async (id) => {
    try {
      console.log("inside");
      const data = await fetch("http://localhost:5001/operation_pipeline", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          menu_id: menuFoodId,
          type: "update_operation_pipeline_reorder_status",
          inventory_id: id,
        }),
      });

      if (data) {
        const res = await data.json();
        if (res) {
          console.log(res);
          setUpdate((prev) => !prev);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  console.log("menu: ", menuFoodId);
  console.log("food items: ", foodItems);
  console.log("reorder logs: ", reorderLogs);

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
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "orange",
          },
        }}
      >
        <div style={{ display: "flex" }}>
          <Sidebar k="3" userType="pai" />

          <div style={{ width: "100%" }}>
            <Header
              title="Post-Procument Ops"
              comp=<DatePicker onChange={handleDateChange} />
            />
            {status < 2 && (
              <Alert
                message="IN-PROGRESS"
                description="Procurement is in progress"
                type="success"
                closable
              />
            )}
            <div style={{ width: "100%", padding: 0 }}>
              <div style={{ padding: "3%" }}>
                <label
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
                          title={item.food_name}
                          style={{
                            margin: 5,
                            width: "100%",
                            // color: '#e08003',
                            backgroundColor: "white",
                            padding: "2%",
                            borderRadius: 10,
                            borderBottom: "2px solid orange",
                          }}
                        >
                          Cooking Status:{" "}
                          {item.status === "COOKING" ? (
                            <Tag color="gold">Cooking</Tag>
                          ) : (
                            <Tag color="green">Ready for Dispatch</Tag>
                          )}
                        </Card>
                      </List.Item>
                    )}
                  />
                )}
                <br />
                <br />
                <label
                  style={{ fontSize: "180%" }}
                  className="dongle-font-class"
                >
                  Re-order Logs
                </label>
                {reorderLogs && status >= 2 && (
                  <List
                    style={{
                      height: "35vh",
                      width: "100%",
                      overflowY: "scroll",
                      backgroundColor: "transparent",
                    }}
                    dataSource={reorderLogs}
                    renderItem={(item) => (
                      <List.Item>
                        <Card style={{ margin: "0px 10px", width: "100%" }}>
                          <Row>
                            <Col xs={8} xl={8}>
                              {item.ingridient_name}
                            </Col>
                            <Col xs={8} xl={8}>
                              Required quantity: {item.quantity_requireds}{" "}
                              {item.unit}
                            </Col>
                            <Col xs={8} xl={8}>
                              {item.reorder_delivery_status ? (
                                <>
                                  <Button
                                    onClick={(e) =>
                                      updateReorderStatus(item.inventory_id)
                                    }
                                    type="primary"
                                  >
                                    FULLFILL ORDER
                                  </Button>
                                </>
                              ) : (
                                <Tag color="green">FULFILLED</Tag>
                              )}
                            </Col>
                          </Row>
                        </Card>
                      </List.Item>
                    )}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </ConfigProvider>
    </div>
  );
};

export default PostConfirmOps;
