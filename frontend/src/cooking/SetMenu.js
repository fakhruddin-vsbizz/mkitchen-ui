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
  Tag,
  Carousel,
  Typography,
} from "antd";
import "./setmenu.css";
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
import {
  colorBackgroundColor,
  colorBlack,
  colorGreen,
  colorNavBackgroundColor,
  valueShadowBox,
} from "../colors";
import { baseURL } from "../constants";

const dateFormatterForToday = () => {
  const dateObj = new Date();
  const formattedDate = `${
    dateObj.getMonth() + 1 < 10
      ? `0${dateObj.getMonth() + 1}`
      : dateObj.getMonth() + 1
  }/${
    dateObj.getDate() < 10 ? `0${dateObj.getDate()}` : dateObj.getDate()
  }/${dateObj.getFullYear()}`;
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
  const [selectedFoodName, setSelectedFoodName] = useState("");

  const [ingredientItems, setIngredientItems] = useState([]);
  const [inventoryItems, setInventoryItems] = useState([]);
  const [inventoryItemId, setInventoryItemId] = useState([]);
  const [allIngridients, setAllIngridients] = useState([]);
  const [isSelected, setIsSelected] = useState(false);
  const [dataAdded, setDataAdded] = useState(false);
  const [countUpdated, setCountUpdated] = useState(false);

  const [ingredientName, setIngredientName] = useState("");

  const [menuFoodId, setMenuFoodId] = useState("");

  const [visible, setVisible] = useState(false);
  const [updateAshkash, setUpdateAshkash] = useState(false);
  const [totalAshkash, setTotalAshkhaas] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  const [ashkaasCountInput, setAshkaasCountInput] = useState(0);
  const [foodIndex, setFoodIndex] = useState("");
  const [foodIngredientMap, setFoodIngredientMap] = useState([]);
  const [validationError, setValidationError] = useState(false);
  const [updatedIngredientsList, setupdatedIngredientsList] = useState([]);
  const [finalArrayForData, setFinalArrayForData] = useState([]);
  const [addedList, setAddedList] = useState([]);
  const [mohallaList, setMohallaList] = useState([]);
  const [selectedMohalla, setSelectedMohalla] = useState("");
  const [mohallaDetails, setMohallaDetails] = useState();
  const [mohallaDetailsList, setMohallaDetailsList] = useState([]);

  const [filteredAutoCompleted, setFilteredAutoCompleted] = useState([]);
  const [reasonForChangingMenu, setReasonForChangingMenu] = useState("");
  const [mohallaUsersList, setMohallaUsersList] = useState([]);

  const [resetMenu, setResetMenu] = useState(false);

  const [status, setStatus] = useState();
  const navigate = useNavigate();

  const { Paragraph } = Typography;

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

  useEffect(() => {
    const getMohallaUsers = async () => {
      await fetch("/api/admin/account_management", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          usertype: "Mohalla Admin",
          action: "get_user",
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log("mohallauser", data);
          setMohallaUsersList(
            data.filter((item) => item?.username !== "Direct Donations")
          );
        });
    };
    getMohallaUsers();
  }, []);

  /**************Restricting Cooking Route************************* */

  const OnDelete = (id) => {
    setIngredientItems((pervItem) =>
      pervItem.filter((item) => item.inventory_item_id !== id)
    );
  };

  const onAddMohalla = () => {
    console.log("totalcount", totalCount);
    console.log("mohalladetails", mohallaDetails);
    if (mohallaDetails?.email) {
      // const newData = { ...mohallaDetails, total_ashkhaas: totalCount };
      console.log({ ...mohallaDetails, total_ashkhaas: +totalCount });
      fetch("/api/admin/menu", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          date_of_cooking: selectedDate,
          data: [
            {
              mk_id: mohallaDetails?.email,
              name: mohallaDetails?.username,
              total_ashkhaas: +totalCount,
            }, //name: username and mk_id: email
          ],
        }),
      })
        .then((res) => {
          setCountUpdated((prev) => !prev);
          console.log(res);
          setTotalCount(0);
          setSelectedMohalla("");
        })
        .catch((err) => console.log(err));
    }
  };

  useEffect(() => {
    const getHistory = async () => {
      if (menuFoodId) {
        console.log(menuFoodId);
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
      } else {
        setTotalAshkhaas(0);
      }
    };

    getHistory();
  }, [menuFoodId, selectedDate, countUpdated]);

  // useEffect(() => {
  //   setTotalCount(totalAshkash);
  // }, [totalAshkash]);

  const addTotalCount = () => {
    //figure out how to add total count
    fetch("/api/admin/menu", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: [
          {
            mk_id: "combine@gmail.com",
            total_ashkhaas: +totalCount,
            name: "Combine",
          },
        ],
        date_of_cooking: selectedDate,
      }),
    })
      .then((res) => setCountUpdated((prev) => !prev))
      .catch((error) => {
        console.log("error 189", error);
      });
  };

  useEffect(() => {
    const getUserId = async () => {
      const type = localStorage.getItem("type");
      const data = await fetch("/api/cooking/ingredients", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "get_user_id",
          client_name: type || "mk admin",
          // mk superadmin
        }),
      });
      if (data) {
        const res = await data.json();
        setGetMkUserId(res?.user);
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
          if (res?.message) {
            setMenuFoodId("");
            setGetFoodList([]);
            setIngredientItems([]);
            setStatus(-1);
            return;
          }
          if (res[0]) {
            setMenuFoodId(res[0]?._id);
            setGetFoodList(res[0]?.food_list);
            setIngredientItems([]);
            setStatus(res.status);
            console.log(res.status);
            setReasonForChangingMenu(res[0]?.reason_for_reconfirming_menu);
            setResetMenu(res[0]?.menu_reset);
            setMohallaList(res[0]?.mohalla_wise_ashkhaas);
            console.log(res[0]?.menu_reset);
          } else {
            setMenuFoodId("");
            setGetFoodList([]);
            setIngredientItems([]);
            setStatus(-1);
          }
        }
      }
    };
    getFood();
  }, [getMkUserId, selectedDate, dataAdded, countUpdated]);

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
          foodId: foodIndex,
          foodName: selectedFoodName,
          procure_amount: 0,
          inventory_item_id: inventoryItemId,
          ingredient_name: ingredientName,
          perAshkash: 0, // set initial perAshkash value as empty string
          reorders: [],
          leftover: {},
        };
        setIngredientItems((prevState) =>
          prevState === undefined
            ? [newIngredient]
            : [newIngredient, ...prevState]
        );
        setUpdateAshkash(true);
        setIngredientName("");
      } else {
        // try {
        //   const data = await fetch("/api/inventory/addinventory", {
        //     method: "POST",
        //     headers: {
        //       "Content-Type": "application/json",
        //     },
        //     body: JSON.stringify({
        //       mkuser_email: email,
        //       ingridient_name: ingredientName,
        //       ingridient_measure_unit: "",
        //       ingridient_expiry_period: "Days",
        //       ingridient_expiry_amount: "5",
        //       price: 0,
        //       decommisioned: true,
        //       total_volume: 0,
        //       baseline: 1,
        //     }),
        //   });
        //     // setDataAdded((prev) => !prev);
        //     const res = await data.json();
        //     setInventoryItems(prev => [...prev, res])
        //     console.log(res, "res");
        //     console.log(finalArrayForData, "finalArrayForData");
        //     const newIngredient = {
        //       foodId: foodIndex,
        //       foodName: selectedFoodName,
        //       procure_amount: 0,
        //       inventory_item_id: res._id,
        //       ingredient_name: ingredientName,
        //       perAshkash: 0, // set initial perAshkash value as empty string
        //       reorders: [],
        //       leftover: {}
        //     };
        //     // setFinalArrayForData([...finalArrayForData, res])
        //     // setFilteredAutoCompleted(finalArrayForData.map((item) => ({
        //     //   value: item.ingridient_name,
        //     //   id: item._id,
        //     // })))
        //     setIngredientItems((prevState) =>
        //       prevState === undefined
        //         ? [newIngredient]
        //         : [newIngredient, ...prevState]
        //     );
        //     setIngredientName("");
        // } catch (error) {
        //   console.log(error);
        // }
      }
    }
  };

  const handlePerAshkashChange = (value, ingredientName, unit) => {
    const updatedIngredients =
      ingredientItems.length !== 0 &&
      ingredientItems.map((ingredient) => {
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
    if (resetMenu) {
      await fetch("/api/admin/menu/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          add_type: "menu_reset",
          menu_reset: false,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          setResetMenu(data?.menu_reset);
        })
        .catch((err) => console.log(err));
    }

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
        setVisible(true);
        setFoodIndex("");
        setIngredientItems([]);
        setStatus(1);
      }
    } catch (error) {
      console.log(error);
    }
    // console.log("allIngridients", allIngridients);
    // console.log("allIngridients type", typeof allIngridients[0]?.perAshkash);
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
    // console.log("finalArray", finalArray);
  }, [ingredientItems, inventoryItems]);

  // Output the final array

  const logIngredientForFood = async () => {
    setAddedList((prev) => [...prev, foodIndex]);

    const newFoodIngredient =
      ingredientItems.length !== 0 &&
      ingredientItems.map((item) => ({
        ...item,
        procure_amount: Number((totalAshkash * +item.perAshkash).toFixed(3)),
        perAshkash: +item.perAshkash,
      }));
    const foodIngMapObj = { ingridients: newFoodIngredient };
    setFoodIngredientMap([foodIngMapObj, ...foodIngredientMap]);

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
    // console.log(newFoodIngredient);
    // console.log(ingredientItems);
    setSelectedFoodName("");
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
    <div style={{ margin: 0, padding: 0 }}>
      <Modal
        open={visible}
        onOk={() => setVisible(false)}
        onCancel={() => setVisible(false)}
        footer={[
          <Button key="ok" type="primary" onClick={() => setVisible(false)}>
            OK
          </Button>,
        ]}>
        <div style={{ textAlign: "center" }}>
          <h2 style={{ color: "#52c41a" }}>Success!</h2>
          <p>Ingridient Added Successfully</p>
        </div>
      </Modal>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: colorGreen,
            colorLink: colorGreen,
          },
        }}>
        <div
          style={{ display: "flex", backgroundColor: colorNavBackgroundColor }}>
          {localStorage.getItem("type") === "mk superadmin" ? (
            <Sidebar k="6" userType="superadmin" />
          ) : (
            <Sidebar k="1" userType="cooking" />
          )}

          <div style={{ width: "100%", backgroundColor: colorBackgroundColor }}>
            <Header
              title="Set Ingredients"
              comp={
                <Row style={{ justifyContent: "flex-end" }}>
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
                <Col xs={24} xl={12} style={{ padding: "0px 15px" }}>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      gap: "1rem",
                    }}>
                    <AutoComplete
                      id="food-item-selected"
                      style={{
                        // border: "2px solid darkred",
                        boxShadow: valueShadowBox,
                        flexGrow: 1,
                        borderRadius: 8,
                      }}
                      value={selectedMohalla}
                      options={
                        mohallaUsersList.length !== 0 &&
                        mohallaUsersList.map((item) => ({
                          value: item.username,
                          item: item,
                        }))
                      }
                      onChange={(value, item) => {
                        if (item?.item) {
                          setMohallaDetails(item?.item);
                        }
                        setSelectedMohalla(value);
                      }}
                      placeholder="Enter a food item"
                      filterOption={(inputValue, option) =>
                        option.value
                          .toUpperCase()
                          .indexOf(inputValue.toUpperCase()) !== -1
                      }
                    />
                    <Input
                      type="number"
                      onChange={(e) => setTotalCount(e.target.value)}
                      value={totalCount}
                      placeholder="Eg: 2,3,15, etc"
                      style={{ width: "10%" }}
                    />
                    <Button onClick={onAddMohalla}>Add</Button>
                    <Paragraph
                      style={{
                        width: "25%",
                        display: "inline-block",
                        textAlign: "center",
                        marginBottom: "0",
                        alignSelf: "center",
                      }}>
                      Total Count: {totalAshkash}
                    </Paragraph>
                  </div>

                  {/* <h3 style={{ color: colorBlack, fontSize:'1.5rem', marginBottom: '0' }}>
                    {localStorage.getItem("type") === "mk superadmin" ? <Col>
                    Total count: <Input
                      type="number"
                        onChange={(e) =>
                          setTotalCount(e.target.value)
                        }
                        value={totalCount}
                        placeholder="Eg: 2,3,15, etc"
                        style={{ width: "40%" }}
                      ></Input> People
                      <Button style={{marginLeft: '8px'}} onClick={addTotalCount}>Add Count</Button>
                    </Col>: <>Total count: <span style={{color: colorGreen}}>{totalAshkash}</span> People</>} 
                  </h3> */}
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
                <Col
                  xs={24}
                  xl={11}
                  style={{
                    display: "flex",
                    gap: "0.5rem",
                    alignItems: "center",
                    flexWrap: "wrap",
                    justifyContent: "left",
                    marginLeft: "1rem",
                  }}>
                  {mohallaList.length !== 0 &&
                    mohallaList.map((mohallaItem) => (
                      <Tag
                        color={colorGreen}
                        key={mohallaItem?.mk_id}
                        style={{
                          display: "flex",
                          // columnGap: ".5rem",
                          fontSize: "1.1rem",
                          padding: ".4rem .6rem",
                        }}>
                        <span>{mohallaItem?.name}</span>:&nbsp;
                        <span>{mohallaItem?.total_ashkhaas}</span>
                      </Tag>
                    ))}
                </Col>
                <Col xs={24} xl={24}>
                  {status === -1 && (
                    <center>
                      <div
                        style={{
                          marginTop: "8%",
                          marginBottom: "8%",
                          width: "30%",
                        }}>
                        <label style={{ fontSize: "800%", color: colorGreen }}>
                          <i
                            style={{ color: "gray" }}
                            className="fa-solid fa-hourglass-start"></i>
                        </label>
                        <br />
                        <br />
                        <label
                          style={{
                            fontSize: "120%",
                            width: "50%",
                            color: "gray",
                          }}>
                          Menu is not set for today.
                          <br />
                          Please try after sometime.
                        </label>
                      </div>
                    </center>
                    // <Alert
                    //   message="Message"
                    //   description="Menu not set for the selected date"
                    //   type="error"
                    //   closable
                    // />
                  )}
                </Col>
                <Col xs={24} xl={12} style={{ padding: "1%" }}>
                  {totalAshkash === 0 && status === 0 ? (
                    <Alert
                      message="Message"
                      description="Mohalla Count Not set"
                      type="error"
                      closable
                    />
                  ) : status < 1 &&
                    status !== -1 &&
                    reasonForChangingMenu !== "" ? (
                    <Alert
                      message="Menu changed set ingredients again."
                      description={"Reason: " + reasonForChangingMenu}
                      type="error"
                      closable
                    />
                  ) : status > 1 ? (
                    <Alert
                      message="Message"
                      description="Ingredient Items have already added"
                      type="success"
                      closable
                    />
                  ) : null}
                  {/* {(reasonForChangingMenu !== "" && status === -2) && (
                    <Alert
                      message="Menu changed please change ingredients"
                      description={"Reason: "+reasonForChangingMenu}
                      type="error"
                      closable
                    />
                  )} */}
                  {/* {status === -1 && (
                    <Alert
                      message="Message"
                      description="Menu not set for the selected date"
                      type="error"
                      closable
                    />
                  )}
                  {status < 1 ? (
                    <Alert
                      message="Menu changed set ingredients again."
                      description={"Reason: "+reasonForChangingMenu}
                      type="error"
                      closable
                    />
                  ): (
                    <Alert
                      message="Message"
                      description="Ingredient Items have already added"
                      type="success"
                      closable
                    />
                  )} */}
                  {/* {status >= 1 && (
                    
                  )} */}
                  {/* <Divider style={{ backgroundColor: "#000" }}></Divider> */}
                  {getFoodList && totalAshkash > 0 && (
                    <List
                      style={{
                        width: "100%",
                        maxHeight: "54vh",
                        overflowY: "scroll",
                      }}
                      itemLayout="horizontal"
                      dataSource={getFoodList}
                      renderItem={(item, index) => (
                        <List.Item style={{ padding: "10px 0" }}>
                          <Card
                            style={{
                              width: "100%",
                              backgroundColor: "transparent",
                              border: "none",
                            }}
                            bodyStyle={{ padding: "0" }}>
                            <Row
                              style={{
                                padding: 20,
                                display: "flex",
                                backgroundColor: "#fff",
                                borderRadius: 10,
                                // border: "2px solid darkred",
                                boxShadow: valueShadowBox,
                                width: "100%",
                              }}>
                              <Col
                                xs={16}
                                xl={16}
                                style={{
                                  display: "flex",
                                  columnGap: "5px",
                                  alignItems: "center",
                                  justifyContent: "flex-start",
                                  fontSize: "1.3rem",
                                  color: colorBlack,
                                  fontWeight: "600",
                                }}>
                                <span>Dish:</span>
                                <label style={{ color: colorGreen }}>
                                  {item.food_name}
                                </label>
                                {addedList.includes(item?.food_item_id) && (
                                  <span
                                    style={{
                                      marginLeft: "1rem",
                                      color: "lightgreen",
                                      padding: ".2rem .7rem",
                                      borderRadius: "1rem",
                                    }}>
                                    Added
                                  </span>
                                )}
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
                        boxShadow: valueShadowBox,
                      }}>
                      {status < 2 ? (
                        <div
                          style={{
                            fontSize: "200%",
                            color: colorBlack,
                            display: "flex",
                          }}
                          className="dongle-font-class">
                          <div>
                            <span>Select the ingredients for :</span>
                            <span
                              style={{ color: colorGreen, marginLeft: "8px" }}>
                              {selectedFoodName}
                            </span>
                            {addedList.includes(foodIndex) && (
                              <span
                                style={{
                                  marginLeft: "1rem",
                                  color: "lightgreen",
                                  padding: ".2rem .7rem",
                                  borderRadius: "1rem",
                                }}>
                                Added
                              </span>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div
                          style={{
                            fontSize: "200%",
                            color: colorBlack,
                            display: "flex",
                          }}
                          className="dongle-font-class">
                          <div>
                            <span>Selected ingredients :</span>
                            <span
                              style={{ color: colorGreen, marginLeft: "8px" }}>
                              {selectedFoodName}
                            </span>
                            {/* <span style={{marginLeft: '1rem', color: 'lightgreen', padding: '.2rem .7rem', boxShadow: valueShadowBox, borderRadius: '1rem'}}>Added</span> */}
                          </div>
                        </div>
                      )}
                      {status < 2 && foodIndex && (
                        <>
                          {/* <span style={{ fontSize: 16, color: colorGreen }}>
                        Add Ingredients:
                      </span> */}
                          <Row
                            style={{
                              padding: 5,
                              display: "flex",
                              width: "100%",
                            }}>
                            {finalArrayForData && (
                              <Col xs={18} xl={18}>
                                <Select
                                  showSearch
                                  id="ingredient-item-selected"
                                  style={{ width: "100%" }}
                                  options={
                                    finalArrayForData.length !== 0 &&
                                    finalArrayForData.map((item) => ({
                                      value: item.ingridient_name,
                                      id: item._id,
                                    }))
                                  }
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
                          </Row>
                        </>
                      )}
                      {ingredientItems.length !== 0 ? (
                        <List
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
                                boxShadow: valueShadowBox,
                                margin: "8px auto",
                                width: "98%",
                              }}>
                              <Card
                                style={{
                                  width: "100%",
                                  backgroundColor: "transparent",
                                  border: "none",
                                  display: "flex",
                                  flexDirection: "column",
                                  justifyContent: "center",
                                }}
                                bodyStyle={{ padding: "10px 24px" }}>
                                <Row>
                                  <Col
                                    xs={12}
                                    xl={8}
                                    style={{ alignSelf: "center" }}>
                                    <span
                                      style={{
                                        fontSize: "1.3rem",
                                        textTransform: "capitalize",
                                      }}>
                                      {item.ingredient_name}
                                    </span>
                                  </Col>
                                  <Col
                                    xs={12}
                                    xl={7}
                                    style={{ alignSelf: "center" }}>
                                    <span style={{ fontSize: "1.3rem" }}>
                                      Per person:
                                    </span>
                                  </Col>
                                  <Col
                                    xs={12}
                                    xl={9}
                                    style={{
                                      display: "flex",
                                      justifyContent: "center",
                                      columnGap: "5px",
                                      alignSelf: "center",
                                    }}>
                                    <div
                                      style={{
                                        display: "flex",
                                        columnGap: "4px",
                                        alignSelf: "center",
                                      }}>
                                      {status < 2 ? (
                                        <Input
                                          style={{ fontSize: "1.3rem" }}
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
                                        />
                                      ) : (
                                        <span style={{ fontSize: "1.3rem" }}>
                                          {item.perAshkash}
                                        </span>
                                      )}
                                      <span
                                        style={{
                                          fontSize: "1.3rem",
                                          textTransform: "capitalize",
                                          alignSelf: "center",
                                        }}>
                                        &nbsp;
                                        {inventoryItems.find(
                                          (inv) =>
                                            inv.ingridient_name ===
                                            item.ingredient_name
                                        )?.ingridient_measure_unit || "kg"}
                                      </span>
                                    </div>
                                    {status < 2 && (
                                      <Button
                                        type="primary"
                                        onClick={() =>
                                          OnDelete(item.inventory_item_id)
                                        }
                                        shape="circle"
                                        icon={<DeleteOutlined />}
                                        style={{
                                          margin: "0px 15px",
                                          alignSelf: "center",
                                        }}
                                        // size="large"
                                      />
                                    )}
                                  </Col>
                                </Row>
                              </Card>
                            </List.Item>
                          )}
                        />
                      ) : (
                        <div
                          style={{
                            width: "100%",
                            padding: 5,
                            height: "35vh",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            flexDirection: "column",
                          }}>
                          <i
                            style={{ fontSize: "6rem", color: colorGreen }}
                            className="fa-solid fa-square-xmark"></i>
                          <span
                            style={{ fontSize: "1.8rem", letterSpacing: 2 }}>
                            Add Ingredient or select food item
                          </span>
                        </div>
                      )}
                      {/* <IngredientList
                        ingredientItems={ingredientItems}
                        OnDelete={OnDelete}
                        inventoryItems={inventoryItems}
                        handlePerAshkashChange={handlePerAshkashChange}
                        foodIndex={foodIndex}
                      /> */}
                      {status < 2 && foodIndex && (
                        <Button
                          block
                          type="primary"
                          style={{ marginTop: 10 }}
                          onClick={logIngredientForFood}>
                          Confirm Menu
                        </Button>
                      )}
                    </Card>
                  )}
                </Col>
              </Row>
            </div>
            <center>
              {status < 2 && totalAshkash > 0 && (
                <Button
                  block
                  style={{
                    width: "90%",
                    height: 60,
                    fontSize: 18,
                    backgroundColor: colorGreen,
                  }}
                  type="primary"
                  onClick={updateOperationPipeliinIngridient}>
                  Request Ingredients
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
