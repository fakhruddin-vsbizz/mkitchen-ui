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
} from "antd";
import { useState } from "react";
import axios from "axios";

const Cooking = () => {
  const data = ["Set Menu", "Cooking", "Dispatch"];
  const [selectedDate, setSelectedDate] = useState(null);
  const [menuFoodId, setMenuFoodId] = useState();
  const [inventoryId, setInventoryId] = useState();
  const [reorderQuantity, setReorderQuantity] = useState();
  const [reorderLogs, setReorderLogs] = useState([]);
  const [update, setUpdate] = useState(false);

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
          }
        } catch (error) {
          console.log(error);
        }
    };
    updateReorderLog();
  }, [update, reorderLogs]);

  const reorderIngridient = async () => {
    let obj = {
      inventory_id: inventoryId,
      quantity_requireds: +reorderQuantity,
      reorder_delivery_status: "re-ordered",
    };

    setReorderLogs([...reorderLogs, obj]);
    setUpdate(true);
  };

  return (
    <div>
      <Row>
        <Col xs={0} xl={4} style={{ padding: "1%" }}>
          <List
            bordered
            dataSource={data}
            renderItem={(item) => <List.Item>{item}</List.Item>}
          />
        </Col>
        <Col xs={24} xl={20} style={{ padding: "3%" }}>
          <Row>
            <Col xs={12} xl={12}>
              <label style={{ fontSize: "300%" }} className="dongle-font-class">
                Cooking Operation
              </label>
            </Col>
            <Col xs={12} xl={12}>
              Select the client:
              <Select
                defaultValue={0}
                style={{ width: "100%" }}
                options={[
                  { value: 0, label: "MK" },
                  { value: 1, label: "Mohsin Ranapur" },
                  { value: 2, label: "Shk. Aliasgar Ranapur" },
                ]}
              />
            </Col>
          </Row>
          <Divider style={{ backgroundColor: "#000" }}></Divider>
          <DatePicker onChange={handleDateChange} />
          <List
            style={{ width: "100&" }}
            itemLayout="horizontal"
            dataSource={getFoodList}
            renderItem={(item, index) => (
              <List.Item>
                <Row>
                  <Col xs={8} xl={8}>
                    <label
                      style={{ fontSize: "200%" }}
                      className="dongle-font-class"
                    >
                      {item.food_name}
                    </label>
                  </Col>
                  <Col xs={14} xl={14}>
                    <List
                      grid={{
                        gutter: 16,
                        xs: 1,
                        sm: 2,
                        md: 4,
                        lg: 4,
                        xl: 3,
                        xxl: 3,
                      }}
                      dataSource={ingredientLists[index]}
                      renderItem={(ing, index) => (
                        <List.Item>
                          <Card>
                            <u>{ing.ingredient_name}</u>
                            <br />
                            <Input
                              onChange={(e) =>
                                handleIngridientReOrder(
                                  ing.inventory_item_id,
                                  e.target.value
                                )
                              }
                              placeholder="Eg: 1L, 12KG, etc"
                            ></Input>
                            <br />
                            <br />
                            <Button
                              onClick={reorderIngridient}
                              size="small"
                              type="primary"
                            >
                              Re-order Item
                            </Button>
                          </Card>
                        </List.Item>
                      )}
                    />
                  </Col>
                  <Col xs={2} xl={2} style={{ padding: "2%" }}>
                    Cooked? &nbsp;&nbsp;&nbsp;
                    <Switch />
                  </Col>
                </Row>
              </List.Item>
            )}
          />
        </Col>
      </Row>
    </div>
  );
};

export default Cooking;
