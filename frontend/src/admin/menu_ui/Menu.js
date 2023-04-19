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
} from "antd";

const Menu = () => {
  const data = ["Menu", "Process History", "Vendor Management", "Reports"];

  const [dateValue, setDateValue] = useState();
  const [foodItems, setFoodItems] = useState([]);
  const [selectedFood, setSelectedFood] = useState("");

  const onSelectDate = (newValue) => {
    const dateObj = new Date(newValue);
    const formattedDate = `${
      dateObj.getMonth() + 1
    }/${dateObj.getDate()}/${dateObj.getFullYear()}`;

    setDateValue(formattedDate);
  };

  console.log(dateValue);
  console.log(selectedFood);
  /*
        REFERENCE FOR BACKEND ENGINEERING
        -----------------------------------
        The variable 'options' below must come from the database and if the option isn't present must be added in automatic format'
    */
  const options = [
    { value: "Mutton Biryani" },
    { value: "Mutton Kebab" },
    { value: "Moong Dal" },
    { value: "Dal" },
    { value: "Chawal" },
    { value: "Palidu" },
    { value: "Roti" },
    { value: "Manda" },
    { value: "Chicken Gravy" },
  ];

  useEffect(() => {
    const getFoodItems = async () => {
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
        console.log(data.json().then((data) => console.log(data)));
      }
    };
    getFoodItems();
  }, []);

  const removeFoodItems = (subject) => {
    var old_food_item_list = foodItems;
    old_food_item_list.pop(old_food_item_list.indexOf(subject));
  };

  const addFoodItem = async () => {
    setFoodItems([
      ...foodItems,
      document.getElementById("food-item-selected").value,
    ]);

    try {
      console.log("inside");
      const data = await fetch("http://localhost:5001/admin/menu", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mkuser_email: "admin@gmail.com",
          food_name: selectedFood,
          ingridient_list: "null",
          usage_counter: "null",
          add_type: "food_item",
        }),
      });

      if (data) {
        console.log(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  console.log(foodItems);

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
                    <td>
                      <AutoComplete
                        id="food-item-selected"
                        style={{ width: "100%" }}
                        options={options}
                        onCha
                        placeholder="Eg: Roti, Chawal, Daal, etc"
                        filterOption={(inputValue, option) =>
                          option.value
                            .toUpperCase()
                            .indexOf(inputValue.toUpperCase()) !== -1
                        }
                        onChange={(value) => setSelectedFood(value)}
                      />
                    </td>
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
                          {item}
                        </Col>
                        <Col xs={12} xl={12}>
                          <center>
                            <Button type="secondary" size="small" key={item}>
                              <i class="fa-solid fa-trash"></i>
                            </Button>
                          </center>
                        </Col>
                      </Row>
                    </List.Item>
                  )}
                />
                <Button type="primary" style={{ marginTop: "50px" }}>
                  Set The Menu
                </Button>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default Menu;
