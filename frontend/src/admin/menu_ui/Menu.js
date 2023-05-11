import React, { useEffect, useState } from "react";

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
  const [AddedFoodItems, setAddedFoodItems] = useState();
  const [isMenu, setIsMenu] = useState(false);

  const [ingridientList, setIngridientList] = useState([]);

  const [visible, setVisible] = useState(false);

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

  const getIngridients = async () => {
    const data = await fetch("http://localhost:5001/cooking/ingredients");

    if (data) {
      console.log(data, "Data");
      const res = await data.json();
      if (res) {
        setIngridientList(res);
      }
    }
  };

  useEffect(() => {
    getIngridients();
  }, []);

  console.log(ingridientList);

  useEffect(() => {
    const getFood = async () => {
      if (dateValue) {
        const data = await fetch("http://localhost:5001/cooking/ingredients", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type: "get_food_Item",
            // mkuser_id: getMkUserId,
            date: dateValue,
          }),
        });
        if (data) {
          const res = await data.json();
          if (res) {
            if (res[0]) {
              console.log(res[0].food_list);
              setFoodItems(res[0].food_list);
              setIsMenu(true);
            } else {
              console.log("no menu");
              setIsMenu(false);
              setFoodItems([]);
            }
          }
        }
      }
    };
    getFood();
  }, [dateValue]);

  useEffect(() => {
    const getFoodItems = async () => {
      console.log("inside");
      const data = await fetch("http://localhost:5001/admin/menu", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          add_type: "get_food_item",
        }),
      });
      if (data) {
        console.log(data.json().then((data) => setAddedFoodItems(data)));
        console.log("=============> FOOD ITEMS", AddedFoodItems);
      }
    };
    getFoodItems();
  }, [dataAdded]);

  const addFoodItem = async () => {
    if (AddedFoodItems.some((item) => item.name === selectedFood)) {
      console.log("Item exists");
      //getting the food item id

      const data = await fetch("http://localhost:5001/admin/menu", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          add_type: "get_food_item_id",
          selected_food: selectedFood,
        }),
      });
      if (data) {
        let id = await data.json().then((data) => data._id);
        const newFoodItem = {
          food_item_id: id,
          // no_of_deigs: 0,
          // total_weight: 0,
          food_name: selectedFood,
        };
        console.log("FIRST SPREADER");
        setFoodItems([...foodItems, newFoodItem]);
      }
    } else {
      try {
        let list = [];
        console.log("inside");
        const data = await fetch("http://localhost:5001/admin/menu", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            mkuser_email: "admin@gmail.com",
            food_name: selectedFood,
            ingridient_list: list,
            usage_counter: 0,
            add_type: "food_item",
          }),
        });

        if (data) {
          console.log(data);
          const res = await data.json();

          setDataAdded((prev) => !prev);

          const newFoodItem = {
            food_item_id: res._id,
            // no_of_deigs: 0,
            // total_weight: 0,
            food_name: selectedFood,
          };
          console.log("SECOND SPREADER");
          setFoodItems([...foodItems, newFoodItem]);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const createMenu = async () => {
    try {
      let list = [];
      console.log("inside");
      const data = await fetch("http://localhost:5001/admin/menu", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          food_list: foodItems,
          total_ashkhaas: 0,
          date_of_cooking: dateValue,
          client_name: "mk admin",
          jaman_coming: true,
          reason_for_undelivered: null,
          mohalla_wise_ashkhaas: list,
          add_type: "add_menu",
          ingridient_list: list,
          status: 0,
          reorder_logs: list,
          dispatch: list,
        }),
      });

      if (data) {
        console.log(data);
        setVisible(true);
        setFoodItemId("");
        setFoodItems([]);
        const res = await data.json();
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    console.log(
      ingridientList
        .filter((it) => it.name === "Haldi")
        .map(
          (newItem, indexEle) =>
            newItem.ingridient_list[indexEle].ingredient_name
        )
    );
  }, [ingridientList]);

  const deleteItem = (item) => {
    const filteredItems = foodItems.filter(
      (foodItem) => foodItem.food_item_id !== item.food_item_id
    );
    setFoodItems(filteredItems);
  };
  console.log("food list: ", foodItems);

  //test code for ashkash update mohall wisee-----------*TESTING*-----------------

  const [value1, setValue1] = useState("");
  const [value2, setValue2] = useState("");
  const [update, setUpdate] = useState(false);
  const [mohallaAshkash, setMohallaAshkash] = useState([]);

  useEffect(() => {
    const getData = async () => {
      const data = await fetch("http://localhost:5001/admin/menu", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          add_type: "get_mohalla_ashkash",
          date: "5/3/2023",
        }),
      });

      if (data) {
        const res = await data.json();
        console.log(res);
        if (res) {
          console.log(res);

          if (res[0].mk_id) {
            setMohallaAshkash(res);
          }
        }
      }
    };
    getData();
  }, []);

  console.log(mohallaAshkash);

  useEffect(() => {
    const updateMohallaWiseCount = async () => {
      if (mohallaAshkash && update)
        try {
          console.log("inside");
          const data = await fetch("http://localhost:5001/admin/menu", {
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
            console.log(data);
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
    console.log("THIRD SPREADER");
    setMohallaAshkash([...mohallaAshkash, obj]);
    setUpdate(true);
  };

  const { token } = useToken();

  return (
    <div
      style={{ margin: 0, padding: 0, backgroundImage: `url(${DeshboardBg})` }}
    >
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
      <div style={{ display: "flex" }}>
        <Sidebar k='1' userType='admin' />

        <div>
          <Header title="Set Today's Menu" />
          <Row>
            <Col xs={12} xl={12} style={{ padding: "3%" }}>
              {/* <label style={{ fontSize: "200%" }} className="dongle-font-class">
                Menu Setting
              </label>
              <Divider style={{ backgroundColor: "#000" }}></Divider> */}

              <ConfigProvider
                theme={{
                  token: {
                    colorPrimary: "orange",
                  },
                }}
              >
                <Calendar
                  style={{
                    border: "1px solid lightgray",
                    backgroundColor: "orange",
                  }}
                  mode="month"
                  onSelect={onSelectDate}
                  fullscreen={false}
                />
              </ConfigProvider>
            </Col>
            <Col xs={12} xl={12} style={{ padding: "2%" }}>
              <Card
                bordered={true}
                className="w-full"
                style={{ border: "1px solid lightgray" }}
              >
                <Row
                  style={{
                    backgroundColor: "orange",
                    padding: "2%",
                    color: "white",
                    borderRadius: 5,
                  }}
                >
                  <Col xs={24} xl={12}>
                    <label style={{ fontSize: "120%", fontWeight: 600 }}>
                      Item for {dateValue}
                    </label>
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

                {/* <Divider style={{ backgroundColor: "#000" }}></Divider> */}
                <div
                  style={{ marginTop: 10, marginBottom: 20, display: "flex" }}
                >
                  <div style={{ width: "80%" }}>
                    <h3>Search menu by name:</h3>
                    {AddedFoodItems && (
                      <AutoComplete
                        id="food-item-selected"
                        style={{
                          width: "100%",
                          border: "2px solid orange",
                          borderRadius: 8,
                        }}
                        value={selectedFood}
                        options={AddedFoodItems.map((item) => ({
                          value: item.name,
                        }))}
                        onChange={(value) => setSelectedFood(value)}
                        placeholder="Enter a food item"
                        filterOption={(inputValue, option) =>
                          option.value
                            .toUpperCase()
                            .indexOf(inputValue.toUpperCase()) !== -1
                        }
                      />
                    )}
                  </div>
                  <div
                    style={{
                      width: "20%",
                      display: "flex",
                      alignContent: "center",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Button
                      style={{
                        backgroundColor: "orange",
                        borderRadius: 50,
                        color: "white",
                        fontSize: 26,
                        height: "auto",
                      }}
                      onClick={addFoodItem}
                    >
                      <i class="fa-solid fa-plus"></i>
                    </Button>
                  </div>
                </div>

                <List
                  // size="small"
                  // bordered
                  dataSource={foodItems}
                  renderItem={(item) => (
                    <div
                      style={{
                        marginTop: 10,
                        marginBottom: 20,
                        padding: 10,
                        display: "flex",
                        backgroundColor: "rgb(255 246 237)",
                        borderRadius: 10,
                        borderBottom: "2px solid orange",
                      }}
                    >
                      <div style={{ width: "80%" }}>
                        <label style={{ fontSize: "120%" }}>
                          {item.food_name}
                        </label>
                        <br />
                        {ingridientList &&
                          ingridientList
                            .filter((it) => it.name === item.food_name)
                            .map((newItem, index) => (
                              <div key={index}>
                                Ingredients:
                                {newItem.ingridient_list.map(
                                  (ing, ingIndex) => (
                                    <span key={ingIndex}>
                                      {ing.ingredient_name},{" "}
                                    </span>
                                  )
                                )}
                              </div>
                            ))}
                      </div>
                      <div
                        style={{
                          width: "20%",
                          display: "flex",
                          alignContent: "center",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Button
                          style={{
                            backgroundColor: "#E86800",
                            borderRadius: 50,
                            color: "white",
                            fontSize: 14,
                            height: "auto",
                          }}
                          onClick={() => deleteItem(item)}
                        >
                          <i class="fa-solid fa-trash"></i>
                        </Button>
                      </div>
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
                    //           <i class="fa-solid fa-trash"></i>
                    //         </Button>
                    //       </center>
                    //     </Col>
                    //   </Row>
                    // </List.Item>
                  )}
                />
                {!isMenu && (
                  <center>
                    <Button
                      onClick={createMenu}
                      style={{
                        width: "40%",
                        backgroundColor: "orange",
                        color: "white",
                        fontWeight: 600,
                      }}
                    >
                      Set The Menu
                    </Button>
                  </center>
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
