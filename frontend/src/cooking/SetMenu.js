import React, { useContext, useEffect } from "react";
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
  ConfigProvider,
  Alert,
} from "antd";
import {
  CaretRightOutlined,
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import Header from "../components/navigation/Header";
import Sidebar from "../components/navigation/SideNav";
import DeshboardBg from "../res/img/DeshboardBg.png";
import { useNavigate } from "react-router-dom";
import AuthContext from "../components/context/auth-context";
import IngredientList from "./Input";
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

const SetMenu = () => {
  const [getFoodList, setGetFoodList] = useState();
  const [getMkUserId, setGetMkUserId] = useState();
  //date filter
  const [selectedDate, setSelectedDate] = useState(newTodaysDate);

  const [ingredientItems, setIngredientItems] = useState([]);
  const [inventoryItems, setInventoryItems] = useState([]);
  const [inventoryItemId, setInventoryItemId] = useState([]);
  const [allIngridients, setAllIngridients] = useState([]);
  const [isSelected, setIsSelected] = useState(false);
  const [dataAdded, setDataAdded] = useState(false);

  const [ingredientName, setIngredientName] = useState("");

  const [menuFoodId, setMenuFoodId] = useState();

  const [visible, setVisible] = useState(false);
  const [updateAshkash, setUpdateAshkash] = useState(false);
  const [totalAshkash, setTotalAshkhaas] = useState(0);

  const [ashkaasCountInput, setAshkaasCountInput] = useState(0);
  const [foodIndex, setFoodIndex] = useState();
  const [foodIngredientMap, setFoodIngredientMap] = useState([]);
  const [validationError, setValidationError] = useState(false);
  const [updatedIngredientsList, setupdatedIngredientsList] = useState([]);
  const [finalArrayForData, setFinalArrayForData] = useState([]);
  const [pushToInventoryVisible, setPushToInventoryVisible] = useState(false)

  const [status, setStatus] = useState();
  const navigate = useNavigate();

  const authCtx = useContext(AuthContext);
  const email = authCtx.userEmail;

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
      navigate("/cooking/ingredients");
    }
    if (!typeAdmin && type && type === "Procurement Inventory") {
      navigate("/pai/inventory");
    }
  }, [navigate]);

  /**************Restricting Cooking Route************************* */

  const OnDelete = (id) => {
    setIngredientItems((pervItem) =>
      pervItem.filter((item) => item.inventory_item_id !== id)
    );
  };

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
    const getUserId = async () => {
      const data = await fetch("/api/cooking/ingredients", {
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
    getUserId();
  }, []);

  useEffect(() => {
    const getFood = async () => {
      if (getMkUserId) {
        const data = await fetch("/api/cooking/ingredients", {
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
          if (res[0]) {
            setMenuFoodId(res[0]._id);
            setGetFoodList(res[0].food_list);
            setIngredientItems([]);
            setStatus(res.status);
          } else {
            setGetFoodList([]);
            setIngredientItems([]);
            setStatus(-1);
          }
        }
      }
    };
    getFood();
  }, [getMkUserId, selectedDate, dataAdded]);

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
            setupdatedIngredientsList(res);
          }
        }
      } catch (error) {
        console.log(error);
      }
    };
    getInventory();
  }, [dataAdded]);

  const addIngredients = async () => {
    if (ingredientName === "") {
      setValidationError(true);
    } else {
      if (
        inventoryItems.some((item) => item.ingridient_name === ingredientName)
      ) {
        const newIngredient = {
          inventory_item_id: inventoryItemId,
          ingredient_name: ingredientName,
          perAshkash: 0, // set initial perAshkash value as empty string
        };
        setIngredientItems((prevState) =>
          prevState === undefined
            ? [newIngredient]
            : [...prevState, newIngredient]
        );
        setUpdateAshkash(true);
        setIngredientName("");
      } else {
        try {
          const data = await fetch("/api/inventory/addinventory", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              mkuser_email: email,
              ingridient_name: ingredientName,
              ingridient_measure_unit: "gram",
              ingridient_expiry_period: "Days",
              ingridient_expiry_amount: "5",
              price: 0,
              decommisioned: true,
              total_volume: 0,
              baseline: 1,
            }),
          });
          if (data) {
            setDataAdded((prev) => !prev);
            const res = await data.json();
            const newIngredient = {
              inventory_item_id: res._id,
              ingredient_name: ingredientName,
              perAshkash: 0, // set initial perAshkash value as empty string
            };
            setIngredientItems((prevState) =>
              prevState === undefined
                ? [newIngredient]
                : [...prevState, newIngredient]
            );
            setIngredientName("");
          }
        } catch (error) {
          console.log(error);
        }
      }
    }
  };

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

  const setFoodReference = async (idx) => {
    if (idx) {
      try {
        const data = await fetch("/api/cooking/ingredients", {
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
    }
    setFoodIndex(idx);
  };

  const updateOperationPipeliinIngridient = async () => {
    try {
      const data = await fetch("/api/cooking/ingredients", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "update_operation_pipeline_ingridient_list",
          menu_id: menuFoodId,
          ingridient_list: allIngridients,
          status: 1,
        }),
      });

      if (data) {
        const res = await data.json();
        setAllIngridients([]);
        setPushToInventoryVisible(true)
        setVisible(true);
        setFoodIndex("");
        setIngredientItems([]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Compare arrays and get the final array with unique objects

  useEffect(() => {
    const finalArray = [];

    for (const inventoryItem of inventoryItems) {
      const found = ingredientItems.some(
        (ingredientItem) =>
          ingredientItem.inventory_item_id === inventoryItem._id
      );
      if (!found) {
        finalArray.push(inventoryItem);
      }
    }
    setFinalArrayForData(finalArray);
  }, [ingredientItems, inventoryItems]);

  // Output the final array
  console.log(finalArrayForData);

  const logIngredientForFood = async () => {
    const foodIngMapObj = { ingridients: ingredientItems };
    setFoodIngredientMap([...foodIngredientMap, foodIngMapObj]);

    if (foodIndex) {
      try {
        const data = await fetch("/api/cooking/ingredients", {
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

  console.log(ingredientItems);
  console.log(inventoryItems);

  const handleSelect = (value, option) => {
    setInventoryItemId(option.id);
    setIngredientName(value);
  };

  const handleDateChange = (date) => {
    const dateObj = new Date(date);
    const formattedDate = `${
      dateObj.getMonth() + 1
    }/${dateObj.getDate()}/${dateObj.getFullYear()}`;
    setSelectedDate(formattedDate);
    setIsSelected(false);
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
          <Button key="ok" type="primary" onClick={() => {
            setVisible(false)}}>
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
          <Sidebar k="1" userType="cooking" />

          <div style={{ width: "100%" }}>
            <Header
              title="Set Ingredients"
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
            
            <div style={{ padding: 20 }}>
              <Row>
                <Col xs={24} xl={24} style={{ padding: "0px 50px" }}>
                  <label>
                    Today's total people to cook for <br/>
                    <label style={{ fontSize:'170%' }}><i class="fa-solid fa-users"></i> &nbsp;&nbsp;{totalAshkash}</label>
                  </label>
                  {/* Select Client: &nbsp;&nbsp;&nbsp;
                      <Select
                        defaultValue={0}
                        size="large"
                        style={{ width: "100%" }}
                        options={[
                          { value: 0, label: "MK" },
                          { value: 1, label: "Mohsin Ranapur" },
                          { value: 2, label: "Shk. Aliasgar Ranapur" },
                        ]}
                      /> */}
                </Col>
                <Col xs={24} xl={12} style={{ padding: "1%", marginTop:'3%' }}>
                  {totalAshkash === 0 && (
                    <Alert
                      style={{ margin: "0.5rem" }}
                      message="Message"
                      description="Mohalla Count Not set"
                      type="error"
                      closable
                    />
                  )}
                  
                  {status >= 1 && (
                    <Alert
                      style={{ margin: "0.5rem" }}
                      message="Message"
                      description="Ingridient Items have already added"
                      type="success"
                      closable
                    />
                  )}
                  {/* <Divider style={{ backgroundColor: "#000" }}></Divider> */}
                  {getFoodList && totalAshkash  > 0 && status !== -1 && (
                    <List
                      style={{ width: "100&" }}
                      itemLayout="horizontal"
                      dataSource={getFoodList}
                      renderItem={(item, index) => (
                        <List.Item style={{ padding:'0px' }}>
                            <Row
                              style={{
                                padding: 20,
                                backgroundColor: "#fff",
                                borderRadius: 10,
                                border: "2px solid orange",
                                width: "100%",
                                marginBottom:'4px'
                              }}
                            >
                              <Col xs={16} xl={16}>
                                Food Name:
                                <br />
                                <label style={{ fontSize: "150%" }}>
                                <i class="fa-solid fa-plate-wheat"></i>  &nbsp;&nbsp; {item.food_name}
                                </label>
                              </Col>
                              <Col xs={8} xl={8}>
                                <Button
                                  type="primary"
                                  id={"set_index_" + item.food_item_id}
                                  onClick={() => {
                                    setFoodReference(item.food_item_id);
                                    setIsSelected(true);
                                  }}
                                  
                                  size="large"
                                >Set the ingredients &nbsp;&nbsp; <i class="fa-solid fa-circle-chevron-right"></i></Button>
                              </Col>
                            </Row>
                        </List.Item>
                      )}
                    />
                  )}
                </Col>
                <Col xs={24} xl={12} style={{ padding: "1% 3%", marginTop:'3%' }}>
                  {status >= 0 && totalAshkash > 0 && (
                    <Card
                      style={{
                        width: "100%",
                        backgroundColor: "white",
                        border: "none",
                      }}
                    >
                      <div
                        style={{
                          backgroundColor: "#CA3F21",
                          padding: "2%",
                          color: "white",
                          borderRadius: 5,
                        }}
                      >
                        <label
                          style={{ fontSize: "120%", color: "white" }}
                        >
                          Ingredients for the selected food item
                        </label>
                      </div>
                      
                      <hr></hr>
                      
                      <Row
                        style={{
                          padding: 5,
                          display: "flex",
                          width: "100%",
                        }}
                      >
                        {finalArrayForData && (
                          <Col xs={18} xl={18}>
                            <AutoComplete
                              id="ingredient-item-selected"
                              style={{ width: "100%" }}
                              options={finalArrayForData.map((item) => ({
                                value: item.ingridient_name,
                                id: item._id,
                              }))}
                              value={ingredientName}
                              onChange={(value) => setIngredientName(value)}
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
                        <Col xs={6} xl={6} style={{ textAlign:'right' }}>
                          <Button
                            style={{
                              backgroundColor: "black",
                              borderRadius: 50,
                              color: "white",
                              fontSize: 14,
                              height: "auto",
                            }}
                            onClick={addIngredients}
                          >
                            <i className="fa-solid fa-plus"></i> &nbsp;&nbsp;Select
                          </Button>
                        </Col>
                      </Row>
                      <List
                        size="small"
                        style={{
                          width: "100%",
                          padding: 5,
                          height: "30vh",
                          overflowY: "scroll",
                          overflowX: "hidden",
                          backgroundColor: "#fff6ed",
                        }}
                        bordered
                        dataSource={ingredientItems}
                        renderItem={(item, index) => (
                          <List.Item
                            style={{
                              margin: 5,
                              padding: 0,
                              display: "flex",
                              backgroundColor: "#fff",
                              borderRadius: 10,
                              borderBottom: "2px solid orange",
                              width: "98%",
                            }}
                          >
                            <Card
                              style={{
                                width: "100%",
                                backgroundColor: "transparent",
                                border: "none",
                              }}
                              title={
                                <Row>
                                  <Col xs={12} xl={12}>
                                    {item.ingredient_name}
                                  </Col>
                                  <Col xs={6} xl={6}>
                                    <Button
                                      type="primary"
                                      onClick={() =>
                                        OnDelete(item.inventory_item_id)
                                      }
                                      shape="circle"
                                      icon={<DeleteOutlined />}
                                      style={{ margin: "0px 10px" }}
                                      // size="large"
                                    />
                                  </Col>
                                </Row>
                              }
                              bordered={false}
                            >
                              <Row>
                                <Col xs={12} xl={12}>
                                  Per Ashkhaas count
                                </Col>
                                <Col xs={12} xl={12}>
                                  <Row>
                                    <Col xs={16} xl={16}>
                                      <Input
                                        // min="0"
                                        type="number"
                                        value={item.perAshkash}
                                        onChange={(e) => {
                                          handlePerAshkashChange(
                                            e.target.value,
                                            item.ingredient_name
                                          );
                                        }}
                                        placeholder="Eg: 1200,200,etc.."
                                      />
                                    </Col>
                                    <Col xs={8} xl={8}>
                                      <label>
                                        {inventoryItems.find(
                                          (inv) =>
                                            inv.ingridient_name ===
                                            item.ingredient_name
                                        )?.ingridient_measure_unit || "kg"}
                                      </label>
                                    </Col>
                                  </Row>
                                </Col>
                              </Row>
                            </Card>
                          </List.Item>
                        )}
                      />
                      {/* <IngredientList
                        ingredientItems={ingredientItems}
                        OnDelete={OnDelete}
                        inventoryItems={inventoryItems}
                        handlePerAshkashChange={handlePerAshkashChange}
                        foodIndex={foodIndex}
                      /> */}
                      {status === 0 && (
                        <Button
                        disabled={pushToInventoryVisible}
                          block
                          type="primary"
                          style={{ marginTop: 10 }}
                          onClick={logIngredientForFood}
                        >
                          Confirm Ingredients
                        </Button>
                      )}
                    </Card>
                  )}
                </Col>
              </Row>
            </div>
            {(status === -1 && totalAshkash === 0) && (
              <center>
                <div style={{ marginTop: '8%', marginBottom: '8%', width:'30%' }}>
                  <label style={{ fontSize: '800%', color: 'darkred' }}>
                    <i class="fa-solid fa-hourglass-start"></i>
                  </label>
                  <br/><br/>
                  <label style={{ fontSize: '120%', width:'50%' }}>Menu for this date has not yet been set. Please come when the admin has set the menu for the same</label>
                </div>
              </center>
            )}
            {(totalAshkash === 0 && status === 0) && (
              <center>
              <div style={{ marginTop: '8%', marginBottom: '8%', width:'30%' }}>
                <label style={{ fontSize: '800%', color: 'darkred' }}>
                  <i class="fa-solid fa-hourglass-start"></i>
                </label>
                <br/><br/>
                <label style={{ fontSize: '120%', width:'50%' }}>It seems like no Mohalla has added the feed count. Please contact the mohalla admins or developer@vsbizz.com.</label>
              </div>
            </center>
            )}
            <center>
              {status === 0 && totalAshkash > 0 && (
                <Button
                  block
                  disabled={pushToInventoryVisible}
                  style={{
                    width: "90%",
                    height: 80,
                    fontSize: 18,
                    backgroundColor: "#e08003",
                    marginBottom: "14px"
                  }}
                  type="primary"
                  onClick={updateOperationPipeliinIngridient}
                >
                  Push to inventory
                </Button>
              )}
            </center>
          </div>
        </div>
      </ConfigProvider>
    </div>
  );
};

export default SetMenu;
