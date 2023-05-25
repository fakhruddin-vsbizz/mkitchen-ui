import React, { useEffect } from "react";
import {
  Row,
  Col,
  Select,
  List,
  Divider,
  Card,
  Button,
  AutoComplete,
  Input,
  Switch,
  DatePicker,
  Tag,
  Modal,
  ConfigProvider,
  Alert,
} from "antd";
import { CaretRightOutlined, PlusOutlined } from "@ant-design/icons";

import { useState } from "react";
import axios from "axios";
import Header from "../components/navigation/Header";
import Sidebar from "../components/navigation/SideNav";
import DeshboardBg from "../res/img/DeshboardBg.png";
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

const Cooking = () => {
  const [selectedDate, setSelectedDate] = useState(newTodaysDate);
  const [menuFoodId, setMenuFoodId] = useState();
  const [inventoryId, setInventoryId] = useState();
  const [reorderQuantity, setReorderQuantity] = useState();
  const [inventoryItems, setInventoryItems] = useState([]);
  const [reorderFullFilled, setReorderFullFilled] = useState();

  const [leftOverQuantity, setLeftOverQuantity] = useState();

  const [isDisabled, setIsDisabled] = useState(false);

  const [reorderLogs, setReorderLogs] = useState([]);
  const [update, setUpdate] = useState(false);
  const [visible, setVisible] = useState(false);
  const [totalAshkashCount, setTotalAshkashCount] = useState();
  const [status, setStatus] = useState();

  const [getFoodList, setGetFoodList] = useState();

  const navigate = useNavigate();

  /**************Restricting Cooking Route************************* */

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
      navigate("/cooking/cookfood");
    }
    if (!typeAdmin && type && type === "Procurement Inventory") {
      navigate("/pai/inventory");
    }
  }, [navigate]);

  /**************Restricting Cooking Route************************* */

  const handleDateChange = (date) => {
    const dateObj = new Date(date);
    const formattedDate = `${
      dateObj.getMonth() + 1
    }/${dateObj.getDate()}/${dateObj.getFullYear()}`;
    setSelectedDate(formattedDate);
  };

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
  }, []);

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
    const getData = async () => {
      if (menuFoodId) {
        const data = await fetch("/api/admin/menu", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            add_type: "get_total_ashkash_sum",
            menu_id: menuFoodId,
          }),
        });

        if (data) {
          const res = await data.json();
          if (res) {
            setTotalAshkashCount(res);
            console.log(res);
          }
        }
      }
    };
    getData();
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
            setGetFoodList(res[0].food_list);
          }
        }
      }
    };
    getFood();
    if (new Date(selectedDate) < new Date().setDate(new Date().getDate() - 1)) {
      setIsDisabled(true);
    } else {
      setIsDisabled(false);
    }
  }, [selectedDate]);

  const [ingredientLists, setIngredientLists] = useState([]);

  // Call the API endpoint and retrieve the ingredient lists
  useEffect(() => {
    if (getFoodList) {
      axios
        .post("/api/cooking/ingredients", {
          food_item_ids: getFoodList,
          type: "get_food_and_ingridient",
        })
        .then((response) => {
          setIngredientLists(response.data);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [getFoodList]);

  const handleIngridientReOrder = async (inventoryId, quantity) => {
    setInventoryId(inventoryId);
    setReorderQuantity(quantity);
  };

  const handleleftOver = async (inventoryId, quantity) => {
    setInventoryId(inventoryId);
    setLeftOverQuantity(quantity);
  };
  console.log(reorderLogs);
  console.log(reorderFullFilled);

  useEffect(() => {
    if (reorderLogs) {
      reorderLogs.forEach((ele, index) => {
        if (ele.reorder_delivery_status === true) {
          setReorderFullFilled(false);
          return;
        } else {
          setReorderFullFilled(true);
        }
      });
    }
  }, [reorderLogs]);

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
            if (selectedDate !== "1/1/1970") {
              setReorderLogs(res.reorder_logs);
            } else {
              setReorderLogs([]);
            }
          }
        }
      }
    };
    getData();
  }, [selectedDate, menuFoodId]);

  useEffect(() => {
    const updateReorderLog = async () => {
      if (reorderLogs && update)
        try {
          const data = await fetch("/api/cooking/ingredients", {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              type: "update_operation_pipeline_reorder_logs",
              menu_id: menuFoodId,
              reorder_logs: reorderLogs,
            }),
          });

          if (data) {
            const res = await data.json();
            setUpdate(false);
            setReorderQuantity("");
          }
        } catch (error) {
          console.log(error);
        }
    };
    updateReorderLog();
  }, [update, reorderLogs]);

  const reorderIngridient = async (ing) => {
    let obj = {
      ingridient_name: ing,
      inventory_id: inventoryId,
      quantity_requireds: +reorderQuantity,
      reorder_delivery_status: true,
    };

    setReorderLogs([...reorderLogs, obj]);
    setUpdate(true);
  };

  const cookingDone = async () => {
    if (reorderFullFilled === true) {
      try {
        const data = await fetch("/api/operation_pipeline", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type: "update_operation_pipeline_status",
            menu_id: menuFoodId,
            status: 3,
          }),
        });

        if (data) {
          const res = await data.json();
          setVisible(true);
        }
      } catch (error) {}
    }
  };

  const returnIngToInventory = async (inventory_id, ingName) => {
    try {
      const data = await fetch("/api/cooking/add_leftover", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          menu_id: menuFoodId,
          inventory_id: inventory_id,
          ingredient_name: ingName,
          leftover_amount: leftOverQuantity,
        }),
      });

      if (data) {
        const res = await data.json();
        console.log(res);
      }
    } catch (error) {
      console.log(error);
    }

    try {
      const data = await fetch("/api/inventory/addinventory", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "udate_volume",
          inventory_id: inventory_id,
          quantity: leftOverQuantity,
        }),
      });

      if (data) {
        const res = await data.json();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      style={{ margin: 0, padding: 0, backgroundImage: `url(${DeshboardBg})` }}
    >
      <Modal
        open={visible}
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
      </Modal>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "orange",
          },
        }}
      >
        <div style={{ display: "flex" }}>
          <Sidebar k="2" userType="cooking" />

          <div style={{ width: "100%" }}>
            <Header
              title="Cooking Operation"
              comp={
                <Row>
                  <Col xs={24} xl={12}>
                    Select the date:
                    <br />
                    <DatePicker
                      defaultValue={dayjs(TodaysDate, "MM/DD/YYYY")}
                      onChange={handleDateChange}
                    />
                  </Col>
                  {/* <Col xs={24} xl={12}>
                  Select the client:
                  <br />
                  <Select
                    defaultValue={0}
                    style={{ width: "70%" }}
                    options={[
                      { value: 0, label: "MK" },
                      { value: 1, label: "Mohsin Ranapur" },
                      { value: 2, label: "Shk. Aliasgar Ranapur" },
                    ]}
                  />
                </Col> */}
                </Row>
              }
            />

            <Row style={{ padding: 10 }}>
              <Col xs={24} xl={16} style={{ padding: "2%" }}>
                {status >= 3 && (
                  <tr>
                    <td colSpan={2}>
                      <br />
                      <Alert
                        style={{ margin: "0.5rem" }}
                        message="Menu Cooked"
                        description="This Menu has been cooked"
                        type="success"
                        closable
                      />
                    </td>
                  </tr>
                )}
                {reorderFullFilled === false && (
                  <tr>
                    <td colSpan={2}>
                      <br />
                      <Alert
                        style={{ margin: "0.5rem" }}
                        message="Not Recieved Re-Order"
                        description="Reorder Item is not accepted"
                        type="error"
                        closable
                      />
                    </td>
                  </tr>
                )}
                {status < 2 && (
                  <tr>
                    <td colSpan={2}>
                      <br />
                      <Alert
                        style={{ margin: "0.5rem" }}
                        message="Menu Not Procured"
                        description="This Menu is Not Procured"
                        type="error"
                        closable
                      />
                    </td>
                  </tr>
                )}
                {status >= 2 && (
                  <List
                    style={{
                      width: "100%",
                      overflowY: "scroll",
                      height: "70vh",
                    }}
                    itemLayout="horizontal"
                    dataSource={getFoodList}
                    renderItem={(item, index) => (
                      <List.Item>
                        <Card style={{ width: "100%" }}>
                          <Row>
                            <Col xs={12} xl={6}>
                              <label
                                style={{ fontSize: "130%", color: "#e08003" }}
                              >
                                <b>{item.food_name}</b>
                              </label>
                            </Col>
                            <Col xs={12} xl={6}>
                              <i
                                style={{ color: "#e08003" }}
                                class="fa-solid fa-circle-check"
                              ></i>{" "}
                              <label
                                style={{ fontSize: "100%", color: "#e08003" }}
                              >
                                Ingredients Set
                              </label>
                            </Col>
                            <Col xs={12} xl={6}>
                              <center>
                                Cooked? &nbsp;&nbsp;&nbsp;
                                <Switch disabled={isDisabled} />
                              </center>
                            </Col>
                          </Row>
                          <hr></hr>
                          <Row>
                            <Col xs={24} xl={24} style={{ padding: "1%" }}>
                              Here are the required ingredients for the cooking:
                              <br />
                              <List
                                dataSource={ingredientLists[index]}
                                renderItem={(ing, index) => (
                                  <List.Item>
                                    <Card
                                      style={{
                                        width: "100%",
                                        backgroundColor: "transparent",
                                        border: "none",
                                      }}
                                    >
                                      <Row
                                        style={{
                                          padding: 20,
                                          display: "flex",
                                          backgroundColor: "#fff6ed",
                                          borderRadius: 10,
                                          borderBottom: "2px solid orange",
                                          width: "100%",
                                        }}
                                      >
                                        <Col
                                          xs={12}
                                          xl={6}
                                          style={{ padding: "2%" }}
                                        >
                                          <label
                                            style={{
                                              fontSize: "110%",
                                              color: "#e08003",
                                            }}
                                          >
                                            <h3>{ing.ingredient_name}</h3>
                                          </label>
                                        </Col>
                                        <Col
                                          xs={12}
                                          xl={6}
                                          style={{ padding: "2%" }}
                                        >
                                          Amount procured:
                                          <br />
                                          {totalAshkashCount && (
                                            <label
                                              style={{
                                                fontSize: "120%",
                                                color: "#e08003",
                                              }}
                                            >
                                              {ing.perAshkash *
                                                totalAshkashCount}
                                            </label>
                                          )}
                                        </Col>
                                        <Col
                                          xs={12}
                                          xl={6}
                                          style={{ padding: "2%" }}
                                        >
                                          You can re-order the items here too if
                                          needed:
                                          <br />
                                          <br />
                                          <Input
                                            style={{ width: "100%" }}
                                            onChange={(e) =>
                                              handleIngridientReOrder(
                                                ing.inventory_item_id,
                                                e.target.value
                                              )
                                            }
                                            placeholder="Eg: 1L, 12KG, etc"
                                          ></Input>
                                          <div>
                                            {inventoryItems &&
                                              inventoryItems
                                                .filter(
                                                  (itemNew) =>
                                                    itemNew._id ===
                                                    ing.inventory_item_id
                                                )
                                                .map(
                                                  (ele) =>
                                                    ele.ingridient_measure_unit
                                                )}
                                          </div>
                                          <Button
                                            disabled={status >= 3}
                                            onClick={(e) =>
                                              reorderIngridient(
                                                ing.ingredient_name
                                              )
                                            }
                                            size="small"
                                            type="primary"
                                          >
                                            Re-order Item
                                          </Button>
                                        </Col>
                                        <Col
                                          xs={12}
                                          xl={6}
                                          style={{
                                            textAlign: "right",
                                            padding: "2%",
                                          }}
                                        >
                                          Leftover amount of{" "}
                                          {ing.ingredient_name}
                                          <br />
                                          <br />
                                          <Input
                                            onChange={(e) =>
                                              handleleftOver(
                                                ing.inventory_item_id,
                                                e.target.value
                                              )
                                            }
                                            style={{ width: "100%" }}
                                            placeholder="Eg: 1L, 12KG, etc"
                                          ></Input>
                                          <div>
                                            {inventoryItems &&
                                              inventoryItems
                                                .filter(
                                                  (itemNew) =>
                                                    itemNew._id ===
                                                    ing.inventory_item_id
                                                )
                                                .map(
                                                  (ele) =>
                                                    ele.ingridient_measure_unit
                                                )}
                                          </div>
                                          <Button
                                            disabled={status >= 3}
                                            onClick={(e) =>
                                              returnIngToInventory(
                                                ing.inventory_item_id,
                                                ing.ingredient_name
                                              )
                                            }
                                            size="small"
                                            type="primary"
                                          >
                                            Return to inventory
                                          </Button>
                                        </Col>
                                      </Row>
                                    </Card>
                                  </List.Item>
                                )}
                              />
                            </Col>
                          </Row>
                        </Card>
                      </List.Item>
                    )}
                  />
                )}
              </Col>
              <Col xs={12} xl={8} style={{ padding: "2%" }}>
                {reorderLogs && status >= 2 && (
                  <div>
                    <label style={{ fontSize: "150%" }}>Reorder Log:</label>
                    <br />
                    <br />
                    <List
                      style={{
                        height: "65vh",
                        overflowY: "scroll",
                        padding: 0,
                      }}
                      dataSource={reorderLogs}
                      renderItem={(item) => (
                        <List.Item>
                          <Card
                            style={{
                              width: "100%",
                              backgroundColor: "transparent",
                              border: "none",
                            }}
                          >
                            <Row
                              style={{
                                padding: 20,
                                display: "flex",
                                backgroundColor: "#fff",
                                borderRadius: 10,
                                borderBottom: "2px solid orange",
                                width: "100%",
                              }}
                            >
                              <Col xs={12} xl={8}>
                                <label
                                  style={{
                                    fontSize: "120%",
                                    color: "#e08003",
                                  }}
                                >
                                  {item.ingridient_name}
                                </label>
                              </Col>
                              <Col xs={12} xl={8}>
                                Amount re-ordered:
                                <br />
                                <b style={{ color: "#e08003" }}>
                                  {item.quantity_requireds}{" "}
                                  {inventoryItems &&
                                    inventoryItems
                                      .filter(
                                        (itemNew) =>
                                          itemNew.ingridient_name ===
                                          item.ingridient_name
                                      )
                                      .map(
                                        (ele) => ele.ingridient_measure_unit
                                      )}
                                </b>
                              </Col>
                              <Col xs={12} xl={8}>
                                Delivery Status: <br />
                                {item.reorder_delivery_status ? (
                                  <Tag color="orange">PENDING</Tag>
                                ) : (
                                  <Tag color="green">DELIVERED</Tag>
                                )}
                              </Col>
                            </Row>
                          </Card>
                        </List.Item>
                      )}
                    />
                  </div>
                )}
              </Col>

              {reorderFullFilled === true &&
                getFoodList &&
                status !== 0 &&
                status !== 1 &&
                status === 2 && (
                  <Button
                    block
                    style={{ height: "160%", fontSize: "200%" }}
                    type="primary"
                    onClick={cookingDone}
                  >
                    Mark Cooking Done
                  </Button>
                )}
            </Row>
          </div>
        </div>
      </ConfigProvider>
    </div>
  );
};

export default Cooking;
