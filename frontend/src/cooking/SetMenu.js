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
  Modal,
  DatePicker,
} from "antd";
import { RightSquareFilled } from "@ant-design/icons";
import { useState } from "react";

const SetMenu = () => {
  const [getFoodList, setGetFoodList] = useState();
  const [getMkUserId, setGetMkUserId] = useState();
  //date filter
  const [selectedDate, setSelectedDate] = useState(null);

  const [ingredientItems, setIngredientItems] = useState([]);
  const [inventoryItems, setInventoryItems] = useState([]);
  const [inventoryItemId, setInventoryItemId] = useState([]);
  const [allIngridients, setAllIngridients] = useState([]);

  const [menuFoodId, setMenuFoodId] = useState();

  const [visible, setVisible] = useState(false);
  const [updateAshkash, setUpdateAshkash] = useState(false);

  const [foodIndex, setFoodIndex] = useState();
  const [foodIngredientMap, setFoodIngredientMap] = useState([]);

  useEffect(() => {
    const getFood = async () => {
      const data = await fetch("http://localhost:5001/cooking/ingredients", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "get_user_id",
          client_name: "mk admin",
        }),
      });
      if (data) {
        const res = await data.json();
        setGetMkUserId(res.user);
      }
    };
    getFood();
  }, []);

  useEffect(() => {
    const getFood = async () => {
      if (getMkUserId) {
        const data = await fetch("http://localhost:5001/cooking/ingredients", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type: "get_food_Item",
            mkuser_id: getMkUserId,
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
  }, [getMkUserId, selectedDate]);

  console.log("food list for menu: ", getFoodList);
  console.log("food menu id: ", menuFoodId);

  const data = ["Set Menu", "Cooking", "Dispatch"];

  console.log(getFoodList);
  console.log("id: ", inventoryItemId);

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

  console.log(inventoryItems);

  const addIngredients = () => {
    const ingredientName = document.getElementById(
      "ingredient-item-selected"
    ).value;
    const newIngredient = {
      inventory_item_id: inventoryItemId,
      ingredient_name: ingredientName,
      perAshkash: 0, // set initial perAshkash value as empty string
    };
    setIngredientItems([...ingredientItems, newIngredient]);
    // setUpdateAshkash(true);
  };

  console.log("ingridient addedd: ", ingredientItems);
  console.log("All ingridient : ", allIngridients);

  const handlePerAshkashChange = (value, ingredientName) => {
    const updatedIngredients = ingredientItems.map((ingredient) => {
      if (ingredient.ingredient_name === ingredientName) {
        // if the ingredient name matches, update its perAshkash value
        return {
          ...ingredient,
          perAshkash: +value,
        };
      }
      return ingredient; // return the unchanged ingredient object
    });
    setIngredientItems(updatedIngredients);
    setUpdateAshkash(true);
  };

  console.log("food id: ", foodIndex);

  const setFoodReference = async (idx) => {
    try {
      console.log("inside");
      const data = await fetch("http://localhost:5001/cooking/ingredients", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "get_food_ingridients",
          food_id: idx,
        }),
      });

      if (data) {
        const res = await data.json();

        setIngredientItems(res.ingridient_data);
      }
    } catch (error) {
      console.log(error);
    }
    setFoodIndex(idx);
  };

  const updateOperationPipeliinIngridient = async () => {
    try {
      const data = await fetch("http://localhost:5001/cooking/ingredients", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "update_operation_pipeline_ingridient_list",
          menu_id: menuFoodId,
          ingridient_list: allIngridients,
        }),
      });

      if (data) {
        console.log(data);
        const res = await data.json();
        setAllIngridients([]);
        setVisible(true);
        setFoodIndex("");
        setIngredientItems([]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const logIngredientForFood = async () => {
    const foodIngMapObj = { ingridients: ingredientItems };
    setFoodIngredientMap([...foodIngredientMap, foodIngMapObj]);

    if (foodIndex && foodIngredientMap) {
      try {
        console.log("inside");
        const data = await fetch("http://localhost:5001/cooking/ingredients", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type: "update_food_ingridient",
            food_id: foodIndex,
            ingridient_list: ingredientItems,
          }),
        });

        if (data) {
          console.log(data);
          const res = await data.json();
          setAllIngridients([...allIngridients, ...ingredientItems]);
          setVisible(true);
          setFoodIndex("");
          setIngredientItems([]);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleSelect = (value, option) => {
    setInventoryItemId(option.id);
  };

  const handleDateChange = (date) => {
    console.log(date);
    const dateObj = new Date(date);
    const formattedDate = `${
      dateObj.getMonth() + 1
    }/${dateObj.getDate()}/${dateObj.getFullYear()}`;
    setSelectedDate(formattedDate);
  };

  console.log(selectedDate);

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
          <p>Ingridient Added Successfully</p>
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
        <Card style={{ padding:'1%', border:'1px solid grey' }} bordered={true}>
          <Row>
              <Col xs={24} xl={12}>
                <label style={{ fontSize: '200%' }}>Set Ingredients</label>
                <br/>
                Total count: 8000 People
              </Col>
              <Col xs={24} xl={12}>
                Select the date to view ingredients:<br/>
                <DatePicker onChange={handleDateChange} />
              </Col>
          </Row>
        </Card>
          <Row>
            <Col xs={24} xl={12}>
              
              {/* <Button onClick={handleButtonClick}>Filter</Button> */}
              
                <br/>
              {/* <p>
                <label
                  style={{ fontSize: "300%" }}
                  className="dongle-font-class"
                >
                  Set Ingredients
                </label>
              </p>
              <p>
                <label
                  style={{ fontSize: "150%" }}
                  className="dongle-font-class"
                >
                  8000 Ashkhaas
                </label>
              </p> */}
              Select Client: &nbsp;&nbsp;&nbsp;
              <Select
                defaultValue={0}
                style={{ width: "80%" }}
                options={[
                  { value: 0, label: "MK" },
                  { value: 1, label: "Mohsin Ranapur" },
                  { value: 2, label: "Shk. Aliasgar Ranapur" },
                ]}
              />
              <Divider style={{ backgroundColor: "#000" }}></Divider>
              {getFoodList && (
                <List
                  style={{ width: "100&" }}
                  itemLayout="horizontal"
                  dataSource={getFoodList}
                  renderItem={(item, index) => (
                    <List.Item>
                      <Card style={{ width: '100%' }}>
                        <Row>
                          <Col xs={12} xl={12}>
                            Food Name:
                            <br/>
                            <label style={{ fontSize: '125%' }}>{item.food_name}</label>
                          </Col>
                          <Col xs={12} xl={12}>
                          <Button
                            type="ghost"
                            style={{ marginLeft: "30%", fontSize:'200%' }}
                            id={"set_index_" + item.index}
                            onClick={() => setFoodReference(item.food_item_id)}
                          >
                        <i class="fa-solid fa-circle-chevron-right"></i>
                      </Button>
                          </Col>
                        </Row>
                      </Card>
                      
                      
                    </List.Item>
                  )}
                />
              )}
            </Col>
            <Col xs={24} xl={12} style={{ padding: "3%" }}>
              <Card>
                <label
                  style={{ fontSize: "200%" }}
                  className="dongle-font-class"
                >
                  Select the items
                </label>
                <hr></hr>
                Select the ingredients to add:
                <Row>
                  {inventoryItems && (
                    <Col xs={18} xl={18}>
                      <AutoComplete
                        id="ingredient-item-selected"
                        style={{ width: "100%" }}
                        options={inventoryItems.map((item) => ({
                          value: item.ingridient_name,
                          id: item._id,
                        }))}
                        onSelect={handleSelect}
                        placeholder="Eg: Roti, Chawal, Daal, etc"
                        filterOption={(inputValue, option) =>
                          option.value
                            .toUpperCase()
                            .indexOf(inputValue.toUpperCase()) !== -1
                        }
                      />
                    </Col>
                  )}
                  <Col xs={6} xl={6}>
                    <Button
                      type="secondary"
                      size="small"
                      onClick={addIngredients}
                    >
                      <i class="fa-solid fa-circle-plus"></i>
                    </Button>
                  </Col>
                </Row>
                <Divider></Divider>
                <List
                  size="small"
                  bordered
                  dataSource={ingredientItems}
                  renderItem={(item, index) => (
                    <List.Item>
                      <Card title={item.ingredient_name} bordered={false}>
                        <Row>
                          <Col xs={12} xl={12}>
                            Per Ashkhaas count
                          </Col>
                          <Col xs={12} xl={12}>
                            <Input
                              type="number"
                              defaultValue={ingredientItems && item.perAshkash}
                              onChange={(e) =>
                                handlePerAshkashChange(
                                  e.target.value,
                                  item.ingredient_name
                                )
                              }
                              placeholder="Eg: 1200,200,etc.."
                            ></Input>
                          </Col>
                        </Row>
                      </Card>
                    </List.Item>
                  )}
                />
              </Card>
              <Button block type="primary" onClick={logIngredientForFood}>
                Confirm Menu
              </Button>
            </Col>
          </Row>
        </Col>
        <Button
          block
          style={{ width: "500px", marginLeft: "300px" }}
          type="primary"
          onClick={updateOperationPipeliinIngridient}
        >
          Push to inventory
        </Button>
      </Row>
    </div>
  );
};

export default SetMenu;
