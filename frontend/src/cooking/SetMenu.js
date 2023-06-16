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
import { colorBackgroundColor, colorBlack, colorGreen, colorNavBackgroundColor } from "../colors";
import { baseURL } from "../constants";

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

const SetMenu = () => {
  const [getFoodList, setGetFoodList] = useState();
  const [getMkUserId, setGetMkUserId] = useState();
  //date filter
  const [selectedDate, setSelectedDate] = useState(newTodaysDate);
  const [selectedFoodName, setSelectedFoodName] = useState("")

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
  const [foodIndex, setFoodIndex] = useState("");
  const [foodIngredientMap, setFoodIngredientMap] = useState([]);
  const [validationError, setValidationError] = useState(false);
  const [updatedIngredientsList, setupdatedIngredientsList] = useState([]);
  const [finalArrayForData, setFinalArrayForData] = useState([]);

  const [filteredAutoCompleted, setFilteredAutoCompleted] = useState([]);
  const [reasonForChangingMenu, setReasonForChangingMenu] = useState("");

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
        const data = await fetch(baseURL+"/api/admin/menu", {
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
      const data = await fetch(baseURL+"/api/cooking/ingredients", {
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
        const data = await fetch(baseURL+"/api/cooking/ingredients", {
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

            console.log("res[0]",res[0]);
            setReasonForChangingMenu(res[0]?.reason_for_reconfirming_menu === undefined ? "" : res[0].reason_for_reconfirming_menu)
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
        const data = await fetch(baseURL+"/api/cooking/ingredients", {
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
          foodId: foodIndex,
          foodName: selectedFoodName,
          procure_amount: 0,
          inventory_item_id: inventoryItemId,
          ingredient_name: ingredientName,
          perAshkash: 0, // set initial perAshkash value as empty string
          reorders: [],
          leftover: {}
        };
        setIngredientItems((prevState) =>
          prevState === undefined
            ? [newIngredient]
            : [newIngredient, ...prevState]
        );
        setUpdateAshkash(true);
        setIngredientName("");
      } else {
        try {
          const data = await fetch(baseURL+"/api/inventory/addinventory", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              mkuser_email: email,
              ingridient_name: ingredientName,
              ingridient_measure_unit: "",
              ingridient_expiry_period: "Days",
              ingridient_expiry_amount: "5",
              price: 0,
              decommisioned: true,
              total_volume: 0,
              baseline: 1,
            }),
          });
          
            // setDataAdded((prev) => !prev);
            const res = await data.json();
            setInventoryItems(prev => [...prev, res])
            console.log(res, "res");
            console.log(finalArrayForData, "finalArrayForData");
            const newIngredient = {
              foodId: foodIndex,
              foodName: selectedFoodName,
              procure_amount: 0,
              inventory_item_id: res._id,
              ingredient_name: ingredientName,
              perAshkash: 0, // set initial perAshkash value as empty string
              reorders: [],
              leftover: {}
            };
            // setFinalArrayForData([...finalArrayForData, res])
            // setFilteredAutoCompleted(finalArrayForData.map((item) => ({
            //   value: item.ingridient_name,
            //   id: item._id,
            // })))
            setIngredientItems((prevState) =>
              prevState === undefined
                ? [newIngredient]
                : [newIngredient, ...prevState]
            );
            setIngredientName("");

        } catch (error) {
          console.log(error);
        }
      }
    }
  };

  const handlePerAshkashChange = (value, ingredientName, unit) => {
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
    setUpdateAshkash(true);
  };

  const setFoodReference = async (idx) => {
    if (idx) {
      try {
        const data = await fetch(baseURL+"/api/cooking/ingredients", {
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
      const data = await fetch(baseURL+"/api/cooking/ingredients", {
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
        setVisible(true);
        setFoodIndex("");
        setIngredientItems([]);
        setStatus(1);
      }
    } catch (error) {
      console.log(error);
    }
    console.log("allIngridients", allIngridients);
    console.log("allIngridients type", typeof allIngridients[0]?.perAshkash);
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
    // setFilteredAutoCompleted(finalArray.map((item) => ({
    //   value: item.ingridient_name,
    //   id: item._id,
    // })))
    console.log("finalArray", finalArray);
  }, [ingredientItems, inventoryItems]);

  // Output the final array

  const logIngredientForFood = async () => {
    const newFoodIngredient = ingredientItems.map(item => ({
      ...item,
      procure_amount: Number((totalAshkash * +item.perAshkash).toFixed(3)),
      perAshkash: +item.perAshkash,
    }))
    const foodIngMapObj = { ingridients: newFoodIngredient };
    setFoodIngredientMap([foodIngMapObj, ...foodIngredientMap]);

    if (foodIndex) {
      try {
        const data = await fetch(baseURL+"/api/cooking/ingredients", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type: "update_food_ingridient",
            food_id: foodIndex,
            ingridient_list: newFoodIngredient,
          }),
        });

        if (data) {
          const res = await data.json();
          setAllIngridients([...allIngridients, ...newFoodIngredient]);
          setVisible(true);
          setFoodIndex("");
          setIngredientItems([]);
        }
      } catch (error) {
        console.log(error);
      }
    }
    console.log(newFoodIngredient);
    console.log(ingredientItems);
    setSelectedFoodName("")
  };

  // console.log(inventoryItems);

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
      style={{ margin: 0, padding: 0}}
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
            colorPrimary: colorGreen,
            colorLink: colorGreen
          },
        }}
      >
        <div style={{ display: "flex", backgroundColor: colorNavBackgroundColor }}>
        {localStorage.getItem("type") === "mk superadmin" ? <Sidebar k="6" userType="superadmin" /> :
          <Sidebar k="1" userType="cooking" />}

          <div style={{ width: "100%", backgroundColor: colorBackgroundColor }}>
            <Header
              title="Set Ingredients"
              comp={
                <Row style={{justifyContent: 'flex-end'}}>
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
            <div style={{ padding: 20 }}>
              <Row>
                <Col xs={24} xl={24} style={{ padding: "0px 15px" }}>
                  <h3 style={{ color: colorBlack, fontSize:'1.5rem', marginBottom: '0' }}>
                    Total count: <span style={{color: colorGreen}}>{totalAshkash}</span> People
                  </h3>
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
                <Col xs={24} xl={12} style={{ padding: "1%" }}>
                  {totalAshkash === 0 && (
                    <Alert
                      message="Message"
                      description="Mohalla Count Not set"
                      type="error"
                      closable
                    />
                  )}
                  {(reasonForChangingMenu !== "" && status === -2) && (
                    <Alert
                      message="Menu changed please change ingredients"
                      description={"Reason: "+reasonForChangingMenu}
                      type="error"
                      closable
                    />
                  )}
                  {status === -1 && (
                    <Alert
                      message="Message"
                      description="Menu not set for the selected date"
                      type="error"
                      closable
                    />
                  )}
                  {status >= 1 && (
                    <Alert
                      message="Message"
                      description="Ingredient Items have already added"
                      type="success"
                      closable
                    />
                  )}
                  {/* <Divider style={{ backgroundColor: "#000" }}></Divider> */}
                  {getFoodList && totalAshkash > 0 && (
                    <List
                      style={{ width: "100&" }}
                      itemLayout="horizontal"
                      dataSource={getFoodList}
                      renderItem={(item, index) => (
                        <List.Item style={{padding: '10px 0'}}>
                          <Card
                            style={{
                              width: "100%",
                              backgroundColor: "transparent",
                              border: "none",
                            }}
                            bodyStyle={{padding: '0'}}
                          >
                            <Row
                              style={{
                                padding: 20,
                                display: "flex",
                                backgroundColor: "#fff",
                                borderRadius: 10,
                                // border: "2px solid darkred",
                                boxShadow: '1px 1px 4px 4px lightgray',
                                width: "100%",
                              }}
                            >
                              <Col xs={16} xl={16} style={{
                                display: "flex",
                                columnGap: "5px",
                                alignItems: "center",
                                justifyContent: "flex-start",
                                fontSize: '1.3rem',
                                color: colorBlack,
                                fontWeight: '600'
                              }}>
                                <span>
                                Food Name:
                                </span>
                                <label style={{color: colorGreen}}>
                                  {item.food_name}
                                </label>
                              </Col>
                              <Col xs={8} xl={8}>
                                <Button
                                  type="primary"
                                  id={"set_index_" + item.food_item_id}
                                  onClick={() => {
                                    setFoodReference(item.food_item_id);
                                    setSelectedFoodName(item.food_name);
                                    setIsSelected(true);
                                  }}
                                  shape="circle"
                                  icon={<CaretRightOutlined />}
                                  size="large"
                                />
                              </Col>
                            </Row>
                          </Card>
                        </List.Item>
                      )}
                    />
                  )}
                </Col>
                <Col xs={24} xl={12} style={{ padding: "1%" }}>
                  {status >= 0 && totalAshkash > 0 && (
                    <Card
                      style={{
                        width: "100%",
                        backgroundColor: "white",
                        border: "none",
                        // border: '2px solid darkred'
                        boxShadow: '1px 1px 4px 4px lightgray',
                      }}
                    >
                      {status < 3 ?
                      <label
                        style={{ fontSize: "200%", color: colorGreen }}
                        className="dongle-font-class"
                      >
                        Select the ingredients for : <span>{selectedFoodName}</span>
                      </label>: <label
                        style={{ fontSize: "200%", color: colorGreen }}
                        className="dongle-font-class"
                      >
                        Selected ingredients: <span>{selectedFoodName}</span> 
                      </label>}
                      <br />
                      {status < 3 && foodIndex && <>
                      {/* <span style={{ fontSize: 16, color: colorGreen }}>
                        Add Ingredients:
                      </span> */}
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
                        <Col xs={6} xl={6}>
                          <Button
                            type="primary"
                            onClick={addIngredients}
                            shape="circle"
                            icon={<PlusOutlined />}
                            style={{ margin: "0px 10px" }}
                            // size="large"
                          />
                        </Col>
                      </Row></>}
                      {ingredientItems.length !== 0 ? <List
                        size="small"
                        style={{
                          width: "100%",
                          padding: 5,
                          maxHeight: "35vh",
                          overflowY: "scroll",
                          overflowX: "hidden",
                          // backgroundColor: "#fff6ed",
                        }}
                        bordered
                        dataSource={ingredientItems}
                        renderItem={(item, index) => (
                          <List.Item
                            style={{
                              // margin: 5,
                              padding: 0,
                              display: "flex",
                              backgroundColor: "#fff",
                              borderRadius: 10,
                              // border: "2px solid darkred",
                              boxShadow: '1px 1px 4px 2px lightgray',
                              margin: '8px auto',
                              width: "98%",
                            }}
                          >
                            <Card
                              style={{
                                width: "100%",
                                backgroundColor: "transparent",
                                border: "none",
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center'
                              }}
                              bodyStyle={{padding: '10px 24px'}}
                            >
                              <Row>
                              <Col xs={12} xl={8}  style={{alignSelf: 'center'}}>
                                <span style={{fontSize: '1.3rem', textTransform: 'capitalize'}}>
                                    {item.ingredient_name}
                                </span>
                                  </Col>
                                <Col xs={12} xl={7} style={{alignSelf: 'center'}}>
                                <span style={{fontSize: '1.3rem'}}>
                                  Per person:
                                  </span>
                                </Col>
                                <Col xs={12} xl={9} style={{display: 'flex', justifyContent: 'center', columnGap: '5px', alignSelf: 'center'}}>

                                  <div style={{ display: 'flex', columnGap: '4px', alignSelf: 'center'}}>
                                      {status < 3 ?
                                      <Input
                                      style={{fontSize: '1.3rem'}}
                                      value={item.perAshkash}
                                      onChange={(e) => {
                                        handlePerAshkashChange(
                                          e.target.value,
                                          item.ingredient_name,
                                          inventoryItems.find(
                                            (inv) =>
                                            inv.ingridient_name ===
                                            item.ingredient_name
                                            )?.ingridient_measure_unit
                                          );
                                        }}
                                        placeholder="Eg: 1200,200,etc.."
                                        /> : <span style={{fontSize: '1.3rem'}}>{item.perAshkash}</span>
                        }
                                        <span style={{fontSize: '1.3rem', textTransform: 'capitalize', alignSelf: 'center'}}>
                                        &nbsp;
                                        {inventoryItems.find(
                                          (inv) =>
                                          inv.ingridient_name ===
                                          item.ingredient_name
                                          )?.ingridient_measure_unit || "kg"}
                                      </span>
                                          </div>
                                      {status < 3 &&
                                        <Button
                                        type="primary"
                                        onClick={() =>
                                          OnDelete(item.inventory_item_id)
                                        }
                                        shape="circle"
                                        icon={<DeleteOutlined />}
                                        style={{ margin: "0px 15px", alignSelf: 'center' }}
                                        // size="large"
                                      />
                                      }
                                    </Col>

                                  </Row>
                            </Card>
                          </List.Item>
                        )}
                      />: <div style={{width: "100%",
                      padding: 5,
                      height: "35vh",
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      flexDirection: 'column'
                      }}>
             
                        <i style={{fontSize: '6rem', color: colorGreen}} class="fa-solid fa-square-xmark"></i>
                        <span style={{fontSize: '1.8rem', letterSpacing: 2}}>
                        Add Ingredient or select food item
                        </span>
                        </div>}
                      {/* <IngredientList
                        ingredientItems={ingredientItems}
                        OnDelete={OnDelete}
                        inventoryItems={inventoryItems}
                        handlePerAshkashChange={handlePerAshkashChange}
                        foodIndex={foodIndex}
                      /> */}
                      {status < 3 && foodIndex && (
                        <Button
                          block
                          type="primary"
                          style={{ marginTop: 10 }}
                          onClick={logIngredientForFood}
                        >
                          Confirm Menu
                        </Button>
                      )}
                    </Card>
                  )}
                </Col>
              </Row>
            </div>
            <center>
              {status < 3 && totalAshkash > 0 && (
                <Button
                  block
                  style={{
                    width: "90%",
                    height: 60,
                    fontSize: 18,
                    backgroundColor: colorGreen,
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
