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
} from "antd";

const Menu = () => {
  const data = ["Menu", "Process History", "Vendor Management", "Reports"];

  const [dateValue, setDateValue] = useState();

  const [dataAdded, setDataAdded] = useState(false);

  const [foodItems, setFoodItems] = useState([]);
  const [foodItemId, setFoodItemId] = useState();

  const [selectedFood, setSelectedFood] = useState("");
  const [AddedFoodItems, setAddedFoodItems] = useState();

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
        console.log(id);
        const newFoodItem = {
          food_item_id: id,
          no_of_deigs: 0,
          total_weight: 0,
          food_name: selectedFood,
        };
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
            no_of_deigs: 0,
            total_weight: 0,
            food_name: selectedFood,
          };
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
          status: list,
          reorder_logs: list,
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
          date: "4/21/2023",
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
              date_of_cooking: "4/21/2023",
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
      total_ashkhaas: value2,
    };
    setMohallaAshkash([...mohallaAshkash, obj]);
    setUpdate(true);
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
          <p>Menu Created Successfully</p>
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
        <Col xs={24} xl={20} style={{ padding: "1%" }}>
          <Row>
            <Col xs={24} xl={12} style={{ padding: "3%" }}>
              <label style={{ fontSize: "200%" }} className="dongle-font-class">
                Menu Setting
              </label>
              <Divider style={{ backgroundColor: "#000" }}></Divider>
              <Calendar mode="month" onSelect={onSelectDate} />
            </Col>
            <Col xs={24} xl={12} style={{ padding: "3%" }}>
              <Card
                bordered={true}
                style={{ width: "100%", border: "2px solid #FF3003" }}
                className="dongle-font-class"
              >
                <label style={{ fontSize: "150%" }}>
                  Item for 24th April, 2022
                </label>
                <Button
                  type="primary"
                  size="small"
                  style={{ marginLeft: "40%" }}
                >
                  Add Menu
                </Button>
                <Divider style={{ backgroundColor: "#000" }}></Divider>
                <table style={{ width: "100%" }}>
                  <tr>
                    <td>Search menu by name:</td>
                    {AddedFoodItems && (
                      <td>
                        <AutoComplete
                          id="food-item-selected"
                          style={{ width: "100%" }}
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
                      </td>
                    )}
                    <td>
                      <Button
                        type="secondary"
                        size="small"
                        onClick={addFoodItem}
                      >
                        <i class="fa-solid fa-circle-plus"></i>
                      </Button>
                    </td>
                  </tr>
                </table>
                <br />
                <br />

                <List
                  size="small"
                  bordered
                  dataSource={foodItems}
                  renderItem={(item) => (
                    <List.Item>
                      <Row style={{ width: "100%" }}>
                        <Col xs={12} xl={12}>
                          {item.food_name}
                        </Col>
                        <Col xs={12} xl={12}>
                          <center>
                            <Button
                              type="secondary"
                              size="small"
                              onClick={() => deleteItem(item)}
                            >
                              <i class="fa-solid fa-trash"></i>
                            </Button>
                          </center>
                        </Col>
                      </Row>
                    </List.Item>
                  )}
                />
                <Button
                  onClick={createMenu}
                  type="primary"
                  style={{ marginTop: "50px" }}
                >
                  Set The Menu
                </Button>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
      <div
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
      </div>
    </div>
  );
};

export default Menu;
