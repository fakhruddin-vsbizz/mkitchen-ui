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
} from "antd";
import { useState } from "react";
import axios from "axios";

const Cooking = () => {
  // for viewing re-order statuses
  const reorder_log_dummy = [
    {
      ingredient_name: "Goat Meat",
      reorder_quantity: 1200,
      is_delivered: false,
    },
    {
      ingredient_name: "Cabbage",
      reorder_quantity: 100,
      is_delivered: false,
    },
    {
      ingredient_name: "Eggs",
      reorder_quantity: 250,
      is_delivered: false,
    },
    {
      ingredient_name: "Everest Chicken Masala",
      reorder_quantity: 10,
      is_delivered: false,
    },
  ];

  const data = ["Set Menu", "Cooking", "Dispatch"];
  const [selectedDate, setSelectedDate] = useState(null);
  const [menuFoodId, setMenuFoodId] = useState();
  const [inventoryId, setInventoryId] = useState();
  const [reorderQuantity, setReorderQuantity] = useState();
  const [reorderLogs, setReorderLogs] = useState([]);
  const [update, setUpdate] = useState(false);
  const [visible, setVisible] = useState(false);

  const [getFoodList, setGetFoodList] = useState();

  const handleDateChange = (date) => {
    console.log(date);
    const dateObj = new Date(date);
    const formattedDate = `${
      dateObj.getMonth() + 1
    }/${dateObj.getDate()}/${dateObj.getFullYear()}`;
    setSelectedDate(formattedDate);
  };

  console.log(selectedDate);
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
            setGetFoodList(res[0].food_list);
          }
        }
      }
    };
    getFood();
  }, [selectedDate]);

  const [ingredientLists, setIngredientLists] = useState([]);

  // Call the API endpoint and retrieve the ingredient lists
  useEffect(() => {
    if (getFoodList) {
      axios
        .post("http://localhost:5001/cooking/ingredients", {
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

  console.log("Ingridient list: ", ingredientLists);
  console.log("Food Items: ", getFoodList);
  console.log("Food Menu id: ", menuFoodId);
  console.log("reorder logs: ", reorderLogs);

  const handleIngridientReOrder = async (inventoryId, quantity) => {
    setInventoryId(inventoryId);
    setReorderQuantity(quantity);
  };

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
  }, [selectedDate, menuFoodId]);

  useEffect(() => {
    const updateReorderLog = async () => {
      if (reorderLogs && update)
        try {
          const data = await fetch(
            "http://localhost:5001/cooking/ingredients",
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                type: "update_operation_pipeline_reorder_logs",
                menu_id: menuFoodId,
                reorder_logs: reorderLogs,
              }),
            }
          );

          if (data) {
            const res = await data.json();
            console.log(data);
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
    console.log(ing);
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
    try {
      const data = await fetch("http://localhost:5001/operation_pipeline", {
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
        console.log(data);
        setVisible(true);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <Modal
        visible={visible}
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
          <p>Menu Cooked Successfully</p>
        </div>
      </Modal>
      <Row>
        <Col xs={0} xl={4} style={{ padding: "1%" }}>
          <List
            bordered
            dataSource={data}
            renderItem={(item) => <List.Item>{item}</List.Item>}
          />
        </Col>
        <Col xs={24} xl={20} style={{ padding: "3%" }}>
          <Card
            style={{ padding: "1%", border: "1px solid grey" }}
            bordered={true}
          >
            <Row>
              <Col xs={12} xl={8}>
                <label style={{ fontSize: "200%" }}>Cooking Operation</label>
              </Col>
              <Col xs={12} xl={8}>
                Select the date:
                <br />
                <DatePicker onChange={handleDateChange} />
              </Col>
              <Col xs={12} xl={8}>
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
              </Col>
            </Row>
          </Card>
          <Divider style={{ backgroundColor: "#000" }}></Divider>

          <Row>
            <Col xs={24} xl={12}>
              <List
                style={{ width: "100%" }}
                itemLayout="horizontal"
                dataSource={getFoodList}
                renderItem={(item, index) => (
                  <List.Item>
                    <Card style={{ width: "100%" }}>
                      <Row>
                        <Col xs={12} xl={6}>
                          <label style={{ fontSize: "130%" }}>
                            <b>{item.food_name}</b>
                          </label>
                        </Col>
                        <Col xs={12} xl={6}>
                          <i class="fa-solid fa-circle-check"></i>{" "}
                          <label style={{ fontSize: "80%" }}>
                            Ingredients Set
                          </label>
                        </Col>
                        <Col xs={12} xl={6}>
                          <center>
                            Cooked? &nbsp;&nbsp;&nbsp;
                            <Switch />
                          </center>
                        </Col>
                      </Row>
                      <hr></hr>
                      <Row>
                        <Col xs={24} xl={24} style={{ padding: "3%" }}>
                          Here are the required ingredients for the cooking:
                          <br />
                          <List
                            dataSource={ingredientLists[index]}
                            renderItem={(ing, index) => (
                              <List.Item>
                                <Card>
                                  <Row>
                                    <Col xs={12} xl={8}>
                                      <label style={{ fontSize: "110%" }}>
                                        <u>{ing.ingredient_name}</u>
                                      </label>
                                    </Col>
                                    <Col xs={12} xl={8}>
                                      Amount procured:
                                      <br />
                                      <label style={{ fontSize: "120%" }}>
                                        1200 KG
                                      </label>
                                    </Col>
                                    <Col
                                      xs={12}
                                      xl={8}
                                      style={{ textAlign: "right" }}
                                    >
                                      You can re-order the items here too if
                                      needed:
                                      <br />
                                      <br />
                                      <Input
                                        style={{ width: "50%" }}
                                        onChange={(e) =>
                                          handleIngridientReOrder(
                                            ing.inventory_item_id,
                                            e.target.value
                                          )
                                        }
                                        placeholder="Eg: 1L, 12KG, etc"
                                      ></Input>
                                      <Button
                                        onClick={(e) =>
                                          reorderIngridient(ing.ingredient_name)
                                        }
                                        size="small"
                                        type="primary"
                                      >
                                        Re-order Item
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
            </Col>
            <Col xs={12} xl={12}>
              {reorderLogs && (
                <div>
                  <label style={{ fontSize: "150%" }}>Reorder Log:</label>
                  <br />
                  <br />
                  <List
                    bordered
                    dataSource={reorderLogs}
                    renderItem={(item) => (
                      <List.Item>
                        <Card style={{ width: "100%" }}>
                          <Row>
                            <Col xs={12} xl={8}>
                              <label style={{ fontSize: "120%" }}>
                                {item.ingridient_name}
                              </label>
                            </Col>
                            <Col xs={12} xl={8}>
                              Amount re-ordered:
                              <br />
                              <b>{item.quantity_requireds}</b>
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
          </Row>
        </Col>
        <Col xs={24} xl={24}>
          {getFoodList && (
            <Button
              block
              style={{ height: "160%", fontSize: "200%" }}
              type="primary"
              onClick={cookingDone}
            >
              Mark Cooking Done
            </Button>
          )}
          <br />
        </Col>
      </Row>
    </div>
  );
};

export default Cooking;
