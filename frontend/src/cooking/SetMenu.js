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
} from "antd";
import { RightSquareFilled } from "@ant-design/icons";
import { useState } from "react";

const SetMenu = () => {
  const [getFoodList, setGetFoodList] = useState();
  const [getMkUserId, setGetMkUserId] = useState();

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
          }),
        });
        if (data) {
          const res = await data.json();
          setGetFoodList(res.food_list);
        }
      }
    };
    getFood();
  }, [getMkUserId]);

  const data = ["Set Menu", "Cooking", "Dispatch"];

  const food_item_list = [
    {
      food: "Mutton Biryani",
      ingredient_list: [],
      idx: 1,
    },
    {
      food: "Mutton Kebab",
      ingredient_list: [],
      idx: 2,
    },
    {
      food: "Daal Gosht",
      ingredient_list: [],
      idx: 3,
    },
    {
      food: "Jira Masala",
      ingredient_list: [],
      idx: 4,
    },
  ];

  const options = [
    { value: "Chicken Meat" },
    { value: "Everest Chilli Masala" },
    { value: "California Almonds" },
    { value: "California Pista" },
    { value: "Basmati Rice" },
    { value: "Mughlai Garam Masala" },
    { value: "Saffron" },
    { value: "Haldi" },
    { value: "Goat Meat" },
  ];

  const [ingredientItems, setIngredientItems] = useState([]);
  const [visible, setVisible] = useState(false);

  const [presentIngridients, setPresentIngridients] = useState();

  const [foodIndex, setFoodIndex] = useState();
  const [foodIngredientMap, setFoodIngredientMap] = useState([]);

  console.log(getFoodList);

  const addIngredients = () => {
    const ingredientName = document.getElementById(
      "ingredient-item-selected"
    ).value;
    const newIngredient = {
      ingredient_name: ingredientName,
      perAshkash: "", // set initial perAshkash value as empty string
    };
    setIngredientItems([...ingredientItems, newIngredient]);
  };

  const handlePerAshkashChange = (value, ingredientName) => {
    const updatedIngredients = ingredientItems.map((ingredient) => {
      if (ingredient.ingredient_name === ingredientName) {
        // if the ingredient name matches, update its perAshkash value
        return {
          ...ingredient,
          perAshkash: value,
        };
      }
      return ingredient; // return the unchanged ingredient object
    });
    setIngredientItems(updatedIngredients);
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
        console.log(data);
        const res = await data.json();

        console.log(res.ingridient_data);

        setIngredientItems(res.ingridient_data);
      }
    } catch (error) {
      console.log(error);
    }
    setFoodIndex(idx);
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
          setVisible(true);
          setFoodIndex("");
          setIngredientItems([]);
        }
      } catch (error) {
        console.log(error);
      }
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
          <Row>
            <Col xs={12} xl={12}>
              <p>
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
              </p>
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
                      {item.name}
                      <Button
                        type="ghost"
                        style={{ marginLeft: "30%" }}
                        id={"set_index_" + item.index}
                        onClick={() => setFoodReference(item._id)}
                      >
                        <RightSquareFilled />
                      </Button>
                    </List.Item>
                  )}
                />
              )}
            </Col>
            <Col xs={12} xl={12} style={{ padding: "3%" }}>
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
                  <Col xs={18} xl={18}>
                    <AutoComplete
                      id="ingredient-item-selected"
                      style={{ width: "100%" }}
                      options={options}
                      placeholder="Eg: Roti, Chawal, Daal, etc"
                      filterOption={(inputValue, option) =>
                        option.value
                          .toUpperCase()
                          .indexOf(inputValue.toUpperCase()) !== -1
                      }
                    />
                  </Col>
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
      </Row>
    </div>
  );
};

export default SetMenu;
