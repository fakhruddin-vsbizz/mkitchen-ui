import React, { useContext, useEffect, useState } from "react";
import "./menu.css";

import {
  Row,
  Col,
  List,
  Tag,
  Divider,
  Calendar,
  Card,
  Button,
  AutoComplete,
  Modal,
  Input,
  ConfigProvider,
  theme,
} from "antd";
import Sidebar from "../../components/navigation/SideNav.js";
import DeshboardBg from "../../res/img/DeshboardBg.png";

import styles from "../admin.module.css";
import Header from "../../components/navigation/Header.js";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../components/context/auth-context.js";
import TextArea from "antd/es/input/TextArea";
import {
  colorBackgroundColor,
  colorBlack,
  colorGreen,
  colorNavBackgroundColor,
  valueShadowBox,
} from "../../colors";
import { baseURL } from "../../constants";
const { useToken } = theme;
const Menu = () => {
  const data = ["Menu", "Process History", "Vendor Management", "Reports"];

  const [dateValue, setDateValue] = useState(
    `${
      new Date().getMonth() + 1
    }/${new Date().getDate()}/${new Date().getFullYear()}`
  );

  const [dataAdded, setDataAdded] = useState(false);

  const [foodItems, setFoodItems] = useState([]);
  const [foodItemId, setFoodItemId] = useState();

  const [selectedFood, setSelectedFood] = useState("");
  const [AddedFoodItems, setAddedFoodItems] = useState([]);
  const [isMenu, setIsMenu] = useState(false);
  const [status, setStatus] = useState();
  const [reasonForReconfirmingMenu, setReasonForReconfirmingMenu] =
    useState("");

  const [ingridientList, setIngridientList] = useState([]);
  const [menuConfimStatus, setMenuConfimStatus] = useState(false);

  const [visible, setVisible] = useState(false);

  const navigate = useNavigate();
  const authCtx = useContext(AuthContext);
  const emailAdmin = authCtx.userEmail;

  /**************Restricting Admin Route************************* */

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

  /**************Restricting Admin Route************************* */

  const onSelectDate = (newValue) => {
    const dateObj = new Date(newValue);
    const formattedDate = `${
      dateObj.getMonth() + 1
    }/${dateObj.getDate()}/${dateObj.getFullYear()}`;
    setDateValue(formattedDate);
  };

  /*
        REFERENCE FOR BACKEND ENGINEERING
        -----------------------------------
        The variable 'options' below must come from the database and if the option isn't present must be added in automatic format'
    */

  // useEffect(() => {
  //   const getFood = async () => {
  //     if (dateValue) {
  //       const data = await fetch("/api/cooking/ingredients", {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({
  //           type: "get_food_Item",
  //           // mkuser_id: getMkUserId,
  //           date: dateValue,
  //         }),
  //       });
  //       if (data) {
  //         const res = await data.json();
  //         if (data?.message) {
  //           setStatus(-1);
  //           return;
  //         }
  //         if (res[0]) {
  //           setStatus(res?.status);
  //         } else {
  //           setStatus(-1);
  //         }
  //       }
  //     }
  //   };
  //   getFood();
  // }, [dateValue]);

  useEffect(() => {
    const getIngridients = async () => {
      const data = await fetch("/api/cooking/ingredients");

      if (data) {
        const res = await data.json();
        if (res) {
          setIngridientList(res);
        }
      }
    };
    getIngridients();
  }, []);

  useEffect(() => {
    const getFood = async () => {
      await fetch("/api/cooking/ingredients", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "get_food_Item",
          // mkuser_id: getMkUserId,
          date: dateValue,
        }),
      })
        .then((res) => {
          const data = res.json();
          return data;
        })
        .then((data) => {
          if (data?.message) {
            setIsMenu(false);
            setFoodItems([]);
            setStatus(-1);
          } else {
            setFoodItems(data[0].food_list);
            setReasonForReconfirmingMenu(data[0]?.reason_for_reconfirming_menu);
            setIsMenu(true);
            if (data[0]) {
              setStatus(data?.status);
            } else {
              setStatus(-1);
            }
          }
        })
        .catch((err) => console.log("cooking/ingredients: error", err));
    };

    getFood();
  }, [dateValue]);

  useEffect(() => {
    const getFoodItems = async () => {
      await fetch("/api/admin/menu/get_food_item", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setAddedFoodItems(data);
        });
    };
    getFoodItems();
  }, [dateValue]);

  const addFoodItem = async () => {
    const itemExists = foodItems.find(
      (item) => item.food_name === selectedFood
    );

    if (selectedFood === "" || itemExists) {
      setSelectedFood("");
      return;
    } else {
      if (AddedFoodItems.find((item) => item.name === selectedFood)) {
        await fetch("/api/admin/menu/get_food_item_id", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            selected_food: selectedFood,
          }),
        })
          .then((res) => res.json())
          .then((data) => {
            let id = data._id;
            const newFoodItem = {
              food_item_id: id,
              // no_of_deigs: 0,
              // total_weight: 0,
              food_name: selectedFood
                .toLowerCase()
                .split(" ")
                .map(function (word) {
                  return word[0].toUpperCase() + word.substring(1);
                })
                .join(" "),
            };
            setFoodItems([newFoodItem, ...foodItems]);
          });
      } else {
        try {
          await fetch("/api/admin/menu/food_item", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              mkuser_email: emailAdmin,
              food_name: selectedFood
                .toLowerCase()
                .split(" ")
                .map(function (word) {
                  return word[0].toUpperCase() + word.substring(1);
                })
                .join(" "),
              ingridient_list: [],
              usage_counter: 0,
            }),
          })
            .then((res) => res.json())
            .then((data) => {
              setDataAdded((prev) => !prev);

              const newFoodItem = {
                food_item_id: data._id,
                // no_of_deigs: 0,
                // total_weight: 0,
                food_name: selectedFood
                  .toLowerCase()
                  .split(" ")
                  .map(function (word) {
                    return word[0].toUpperCase() + word.substring(1);
                  })
                  .join(" "),
              };
              setFoodItems([newFoodItem, ...foodItems]);
            });
        } catch (error) {
          console.log(error);
        }
      }
      setSelectedFood("");
    }
  };

  const reCreateMenu = async () => {
    try {
      await fetch("/api/admin/menu/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          add_type: "add_menu",
          food_list: foodItems,
          total_ashkhaas: 0,
          date_of_cooking: dateValue,
          client_name: "mk admin",
          jaman_coming: true,
          reason_for_undelivered: null,
          mohalla_wise_ashkhaas: [],
          ingridient_list: [],
          status: 0,
          reorder_logs: [],
          reason_for_reconfirming_menu: reasonForReconfirmingMenu,
          dispatch: [],
          leftover: [],
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          setVisible(true);
          setStatus(0);
          setFoodItemId("");
        });
    } catch (error) {
      console.log(error);
    }
  };

  const createMenu = async () => {
    try {
      await fetch("/api/admin/menu/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          add_type: "add_menu",
          food_list: foodItems,
          total_ashkhaas: 0,
          date_of_cooking: dateValue,
          client_name: "mk admin",
          jaman_coming: true,
          reason_for_undelivered: null,
          mohalla_wise_ashkhaas: [],
          ingridient_list: [],
          status: 0,
          reorder_logs: [],
          dispatch: [],
          leftover: [],
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          setReasonForReconfirmingMenu(
            data?.foodMenu?.reason_for_reconfirming_menu
          );
          setVisible(true);
          setStatus(0);
          setFoodItemId("");
        });
    } catch (error) {
      console.log(error);
    }
  };

  const deleteItem = (item) => {
    const filteredItems = foodItems.filter(
      (foodItem) => foodItem.food_item_id !== item.food_item_id
    );
    setFoodItems(filteredItems);
  };

  //test code for ashkash update mohall wisee-----------*TESTING*-----------------

  const [value1, setValue1] = useState("");
  const [value2, setValue2] = useState("");
  const [update, setUpdate] = useState(false);
  const [mohallaAshkash, setMohallaAshkash] = useState([]);

  useEffect(() => {
    const getData = async () => {
      const data = await fetch("/api/admin/menu", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          add_type: "get_mohalla_ashkash",
          date: dateValue,
        }),
      });

      if (data) {
        const res = await data.json();
        if (res) {
          if (res?.mk_id) {
            setMohallaAshkash(res);
          }
        }
      }
    };
    getData();
  }, [dateValue]);

  useEffect(() => {
    const updateMohallaWiseCount = async () => {
      if (mohallaAshkash && update)
        try {
          const data = await fetch("/api/admin/menu", {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              data: mohallaAshkash,
              date_of_cooking: "5/3/2023",
            }),
          });

          if (data) {
            const res = await data.json();
            setUpdate(false);
          }
        } catch (error) {
          console.log(error);
        }
    };
    updateMohallaWiseCount();
  }, [update, mohallaAshkash]);

  const updateAshkash = async () => {
    const obj = {
      mk_id: value1,
      total_ashkhaas: +value2,
      name: "Mohalla Bhopal",
    };
    setMohallaAshkash([...mohallaAshkash, obj]);
    setUpdate(true);
  };

  const { token } = useToken();

  return (
    <div style={{ margin: 0, padding: 0 }}>
      <Modal
        open={visible}
        onOk={() => setVisible(false)}
        onCancel={() => setVisible(false)}
        footer={[
          <Button
            key="ok"
            type="primary"
            onClick={() => {
              setMenuConfimStatus(true);
              setVisible(false);
            }}>
            OK
          </Button>,
        ]}>
        <div style={{ textAlign: "center" }}>
          <h2 style={{ color: "#52c41a" }}>Success!</h2>
          <p>Menu Created Successfully</p>
        </div>
      </Modal>
      {/* <Row>
        <Col xs={0} xl={4} style={{ padding: "1%" }}> */}
      {/* <List
            bordered
            dataSource={data}
            renderItem={(item) => <List.Item>{item}</List.Item>}
          /> */}
      {/* </Col> */}
      <div
        style={{ display: "flex", backgroundColor: colorNavBackgroundColor }}>
        {localStorage.getItem("type") === "mk superadmin" ? (
          <Sidebar k="1" userType="superadmin" />
        ) : (
          <Sidebar k="1" userType="admin" />
        )}

        <div style={{ width: "100%", backgroundColor: colorBackgroundColor }}>
          <Header title="Set Today's Menu" />
          <Row>
            <Col xs={12} xl={12} style={{ padding: "3%" }}>
              {/* <label style={{ fontSize: "200%" }} className="dongle-font-className">
                Menu Setting
              </label>
              <Divider style={{ backgroundColor: "#000" }}></Divider> */}

              <ConfigProvider
                theme={{
                  token: {
                    colorPrimary: colorGreen,
                  },
                }}>
                <Calendar
                  style={{
                    // border: "1px solid lightgray",
                    backgroundColor: colorGreen,
                    boxShadow: valueShadowBox,
                  }}
                  onSelect={onSelectDate}
                  fullscreen={false}
                />
              </ConfigProvider>
            </Col>
            <Col xs={12} xl={12} style={{ padding: "0 2% 0 0" }}>
              <Card
                bordered={true}
                className="w-full"
                style={{
                  border: "1px solid lightgray",
                  minHeight: "55vh",
                  boxShadow: valueShadowBox,
                }}
                bodyStyle={{ padding: "24px 24px 10px" }}>
                <Row
                  style={{
                    backgroundColor: colorGreen,
                    padding: "2%",
                    color: "white",
                    borderRadius: 5,
                  }}>
                  <Col xs={24} xl={12}>
                    Menu for:
                    <br />
                    <i className="fa-solid fa-calendar"></i> &nbsp;&nbsp;{" "}
                    <span style={{ fontSize: "1.2rem" }}>
                      {" "}
                      {new Date(dateValue).toDateString()}{" "}
                    </span>
                  </Col>
                  {/* <Col xs={24} xl={12}>
                    <Button
                      style={{
                        marginLeft: "60%",
                        backgroundColor: "white",
                        color: "orange",
                        fontWeight: 600,
                      }}
                    >
                      Add Menu
                    </Button>
                  </Col> */}
                </Row>
                <hr className="separator"></hr>

                {/* <Divider style={{ backgroundColor: "#000" }}></Divider> */}
                {(new Date(dateValue) >
                  new Date().setDate(new Date().getDate() - 1) &&
                  status < 2) ||
                localStorage.getItem("type") === "mk superadmin" ? (
                  <>
                    <div
                      style={{
                        marginTop: 10,
                        marginBottom: 20,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "baseline",
                      }}>
                      <div
                        style={{
                          width: "83%",
                          display: "flex",
                          columnGap: "6px",
                        }}>
                        <label className="label">Menu:</label> &nbsp;&nbsp;
                        <AutoComplete
                          id="food-item-selected"
                          style={{
                            width: "50%",
                            // border: "2px solid darkred",
                            boxShadow: valueShadowBox,
                            flexGrow: 1,
                            borderRadius: 8,
                          }}
                          value={selectedFood}
                          options={
                            AddedFoodItems.length !== 0 &&
                            AddedFoodItems.map((item) => ({
                              value: item.name,
                            }))
                          }
                          onChange={(value) => setSelectedFood(value)}
                          placeholder="Enter a food item"
                          filterOption={(inputValue, option) =>
                            option.value
                              .toUpperCase()
                              .indexOf(inputValue.toUpperCase()) !== -1
                          }
                        />
                      </div>
                      <div
                        style={{
                          width: "fit-content",
                          display: "flex",
                          alignContent: "center",
                          justifyContent: "center",
                          alignItems: "flex-end",
                        }}>
                        <Button
                          style={{
                            backgroundColor: "black",
                            borderRadius: 50,
                            color: "white",
                            fontSize: 14,
                            height: "auto",
                          }}
                          onClick={addFoodItem}>
                          <i className="fa-solid fa-plus"></i>&nbsp;&nbsp;Add
                        </Button>
                      </div>
                    </div>
                  </>
                ) : null}

                <List
                  // size="small"
                  // bordered
                  style={{
                    overflowY: "scroll",
                    height: "33vh",
                    padding: ".5rem .3rem",
                  }}
                  dataSource={foodItems}
                  renderItem={(item) => (
                    <div
                      style={{
                        padding: 15,
                        display: "flex",
                        alignItems: "center",
                        // backgroundColor: "rgb(255 246 237)",
                        borderRadius: 5,
                        marginBottom: ".5rem",
                        // border: "2px solid darkred",
                        boxShadow: valueShadowBox,
                      }}>
                      <div style={{ width: "60%" }}>
                        <div
                          style={{
                            fontSize: "140%",
                            display: "flex",
                            columnGap: "1rem",
                          }}>
                          <span>
                            <i className="fa-solid fa-bowl-rice"></i>
                          </span>
                          <span>{item.food_name}</span>
                        </div>
                        <br />
                        {/* {ingridientList &&
                          ingridientList
                            .filter((it) => it.name === item.food_name)
                            .map((newItem, index) => (
                              <div key={index}>
                                Ingredients:
                                {newItem.ingridient_list.map(
                                  (ing, ingIndex) => (
                                    <Tag color="darkred" key={ingIndex}>
                                      {ing.ingredient_name}
                                    </Tag>
                                    // <span key={ingIndex}>
                                    //   {ing.ingredient_name},{" "}
                                    // </span>
                                  )
                                )}
                              </div>
                            ))} */}
                      </div>
                      <div
                        style={{
                          width: "100%",
                          display: "flex",
                          alignContent: "left",
                          justifyContent: "left",
                          alignItems: "left",
                        }}>
                        {ingridientList.length !== 0 &&
                          ingridientList
                            .filter((it) => it.name === item.food_name)
                            .map((newItem, index) => (
                              <div key={index}>
                                {newItem?.ingridient_list.length !== 0 &&
                                  newItem.ingridient_list.map(
                                    (ing, ingIndex) => (
                                      <Tag color={colorGreen} key={ingIndex}>
                                        <i className="fa-solid fa-plate-wheat"></i>{" "}
                                        &nbsp;
                                        {ing.ingredient_name}
                                      </Tag>
                                      // <span key={ingIndex}>
                                      //   {ing.ingredient_name},{" "}
                                      // </span>
                                    )
                                  )}
                              </div>
                            ))}
                      </div>
                      {(new Date(dateValue) >
                        new Date().setDate(new Date().getDate() - 1) &&
                        status < 2) ||
                      localStorage.getItem("type") === "mk superadmin" ? (
                        <div
                          style={{
                            width: "20%",
                            display: "flex",
                            alignContent: "center",
                            justifyContent: "center",
                            alignItems: "center",
                          }}>
                          <Button
                            style={{
                              backgroundColor: "red",
                              borderRadius: 50,
                              color: "white",
                              fontSize: 9,
                              height: "auto",
                            }}
                            onClick={() => deleteItem(item)}>
                            <i className="fa-solid fa-trash"></i>
                          </Button>
                        </div>
                      ) : null}
                    </div>

                    // <List.Item>
                    //   <Row style={{ width: "100%" ,border: '2px solid orange', borderRadius: 5, padding:10 }}>
                    //     <Col xs={12} xl={12}>
                    //       <label style={{ fontSize: "120%" }}>
                    //         {item.food_name}
                    //       </label>
                    //       <br />
                    //       {ingridientList &&
                    //         ingridientList
                    //           .filter((it) => it.name === item.food_name)
                    //           .map((newItem, index) => (
                    //             <div key={index}>
                    //               Ingredients:
                    //               {newItem.ingridient_list.map(
                    //                 (ing, ingIndex) => (
                    //                   <span key={ingIndex}>
                    //                     {ing.ingredient_name},{" "}
                    //                   </span>
                    //                 )
                    //               )}
                    //             </div>
                    //           ))}

                    //       {/* Ingredients: Bread, Honey, Sugar, Ghee. */}
                    //     </Col>
                    //     <Col xs={12} xl={12}>
                    //       <center>
                    //         <Button
                    //           type="secondary"
                    //           size="small"
                    //           onClick={() => deleteItem(item)}
                    //         >
                    //           <i className="fa-solid fa-trash"></i>
                    //         </Button>
                    //       </center>
                    //     </Col>
                    //   </Row>
                    // </List.Item>
                  )}
                />
                <hr className="separator"></hr>
                {(status >= 3 ||
                  new Date(dateValue) <
                    new Date().setDate(new Date().getDate() - 1)) &&
                (status >= 3 ||
                  localStorage.getItem("type") !== "mk superadmin") ? (
                  <p className="done-tag">Food Already Cooked</p>
                ) : (
                  <>
                    {foodItems.length !== 0 ? (
                      /*status === -1 &&*/
                      <>
                        {" "}
                        {status < 0 ? (
                          <div style={{ width: "100%", textAlign: "right" }}>
                            <Button
                              onClick={createMenu}
                              // disabled={menuConfimStatus}
                              style={{
                                width: "100%",
                                backgroundColor: colorGreen,
                                color: "white",
                                height: "170%",
                                fontSize: "120%",
                                fontWeight: 600,
                              }}>
                              Confirm Menu
                            </Button>
                          </div>
                        ) : (
                          status < 2 && (
                            <div
                              style={{
                                width: "100%",
                                textAlign: "left",
                                marginTop: "1rem",
                              }}>
                              <label htmlFor="reason" className="label">
                                Reason for changing menu :{" "}
                              </label>
                              <TextArea
                                rows={2}
                                name="reason"
                                id="reason"
                                style={{
                                  marginBlock: ".5rem",
                                  fontSize: "1.1rem",
                                }}
                                value={reasonForReconfirmingMenu}
                                onChange={(e) =>
                                  setReasonForReconfirmingMenu(e.target.value)
                                }
                              />
                              <Button
                                onClick={reCreateMenu}
                                disabled={!reasonForReconfirmingMenu}
                                style={{
                                  width: "100%",
                                  backgroundColor: colorGreen,
                                  color: "white",
                                  height: "170%",
                                  fontSize: "120%",
                                  fontWeight: 600,
                                }}>
                                Change Menu
                              </Button>
                            </div>
                          )
                        )}
                      </>
                    ) : null}
                  </>
                )}
              </Card>
            </Col>
          </Row>
        </div>
      </div>
      {/* </Row> */}
      {/* <div
        style={{
          width: "500px",
          position: "absolute",
          margin: "10px",
          marginBottom: "50px",
          paddingBottom: "50px",
        }}
      >
        <h4>This is to test the mohall wise ashkash api</h4>
        <Input
          placeholder="Enter Email"
          value={value1}
          onChange={(e) => setValue1(e.target.value)}
        />
        <Input
          placeholder="Enter Ashkash"
          value={value2}
          onChange={(e) => setValue2(e.target.value)}
        />
        <Button onClick={updateAshkash}>submit</Button>
      </div> */}
    </div>
  );
};

export default Menu;
