import { DatePicker } from "antd";
import React, { useEffect, useState } from "react";
import { Card, List, Row, Col } from "antd";

const ProcedureLogs = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [menuFoodId, setMenuFoodId] = useState();
  const [reviewData, setReviewData] = useState([]);
  const [ingridientList, setIngridientList] = useState([]);

  useEffect(() => {
    const getFood = async () => {
      if (menuFoodId) {
        const data = await fetch("http://localhost:5001/operation_pipeline", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type: "get_ingridient_list",
            menu_id: menuFoodId,
          }),
        });
        if (data) {
          const res = await data.json();
          console.log(res);
          if (res) {
            setIngridientList(res);
          }
        }
      }
    };
    getFood();
  }, [menuFoodId]);

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
          }
        }
      }
    };
    getFood();
  }, [selectedDate]);

  useEffect(() => {
    const getData = async () => {
      if (selectedDate && menuFoodId) {
        const data = await fetch("http://localhost:5001/review", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type: "get_review",
            // date: selectedDate,
            menu_id: menuFoodId,
          }),
        });

        if (data) {
          const res = await data.json();
          if (res) {
            console.log(res);
            setReviewData(res);
          }
        }
      }
    };
    getData();
  }, [selectedDate, menuFoodId]);

  const mohalla_user_data = [
    {
      mohalla_user: "Fakhri Mohalla",
      count: 240,
      total_daig_count: 12,
      total_weight: 2400,
      delivery_status: true,
      rating: 3,
      review: "N/A",
    },
    {
      mohalla_user: "Badshah Nagar",
      count: 240,
      total_daig_count: 12,
      total_weight: 2400,
      delivery_status: true,
      rating: 3,
      review: "N/A",
    },
    {
      mohalla_user: "Konark Pooram",
      count: 240,
      total_daig_count: 12,
      total_weight: 2400,
      delivery_status: false,
      rating: 3,
      review: "N/A",
    },
    {
      mohalla_user: "Hatimi Mohalla",
      count: 240,
      total_daig_count: 12,
      total_weight: 2400,
      delivery_status: false,
      rating: 3,
      review: "N/A",
    },
    {
      mohalla_user: "Taiyabi Mohalla",
      count: 240,
      total_daig_count: 12,
      total_weight: 2400,
      delivery_status: true,
      rating: 3,
      review: "N/A",
    },
  ];

  const ingredients_inventory = [
    {
      ingredient_name: "Goat Meat",
      required_amount: 1200,
      unit: "KG",
      per_unit_price: 12,
      left_item: 200,
    },
    {
      ingredient_name: "Pudina Masala",
      required_amount: 200,
      unit: "Packet",
      per_unit_price: 12,
      left_item: 200,
    },
    {
      ingredient_name: "Sunflower Oil",
      required_amount: 1200,
      unit: "L",
      per_unit_price: 12,
      left_item: 200,
    },
    {
      ingredient_name: "Rawa",
      required_amount: 1200,
      unit: "KG",
      per_unit_price: 12,
      left_item: 200,
    },
    {
      ingredient_name: "Govardhan Ghee",
      required_amount: 1200,
      unit: "KG",
      per_unit_price: 12,
      left_item: 200,
    },
    {
      ingredient_name: "Moong Dal",
      required_amount: 3500,
      unit: "KG",
      per_unit_price: 12,
      left_item: 200,
    },
    {
      ingredient_name: "Basmati Rice",
      required_amount: 3500,
      unit: "KG",
      per_unit_price: 12,
      left_item: 500,
    },
    {
      ingredient_name: "Eggs",
      required_amount: 12,
      unit: "Dozens",
      per_unit_price: 12,
      left_item: 0.5,
    },
  ];
  const handleDateChange = (date) => {
    console.log(date);
    const dateObj = new Date(date);
    const formattedDate = `${
      dateObj.getMonth() + 1
    }/${dateObj.getDate()}/${dateObj.getFullYear()}`;
    setSelectedDate(formattedDate);
  };

  return (
    <div>
      <Card style={{ padding: "1%", border: "1px solid grey" }} bordered={true}>
        <Row>
          <Col xs={12} xl={12} style={{ fontSize: "200%" }}>
            Process Log
          </Col>
          <Col xs={12} xl={12} style={{ textAlign: "right" }}>
            Select date for showing history: &nbsp;&nbsp;&nbsp;
            <DatePicker onChange={handleDateChange} />
          </Col>
        </Row>
      </Card>

      <br />
      <br />
      <br />
      <Card style={{ width: "85%", marginLeft: "4%" }}>
        <label style={{ fontSize: "150%" }}>
          <u>Menu Decision & Delivery</u>
        </label>
        <br />
        <br />
        {reviewData && (
          <List
            bordered
            dataSource={reviewData}
            renderItem={(item) => (
              <List.Item>
                <Card style={{ width: "100%" }}>
                  <Row>
                    <Col xs={12} xl={6}>
                      <label style={{ fontSize: "120%" }}>
                        <b>{item.username}</b>
                      </label>
                    </Col>
                    {/* <Col xs={12} xl={6}>
                    Total Daigs:
                    <br />
                    <b>{item.total_daig_count}</b>
                  </Col>
                  <Col xs={12} xl={6}>
                    Daigs weight (total):
                    <br />
                    <b>{item.total_weight}</b>
                  </Col> */}
                    <Col xs={12} xl={6}>
                      {item.review ? (
                        <div>
                          <i class="fa-solid fa-circle-check"></i> Delivered
                        </div>
                      ) : (
                        <div>
                          <i class="fa-regular fa-clock"></i> Pending
                        </div>
                      )}
                      <hr></hr>
                      <i class="fa-solid fa-star"></i> &nbsp;&nbsp;&nbsp;{" "}
                      {item.review}/5
                      <hr></hr>
                    </Col>
                  </Row>
                </Card>
              </List.Item>
            )}
          />
        )}
      </Card>

      <br />
      <Card style={{ width: "85%", marginLeft: "4%" }}>
        <label style={{ fontSize: "150%" }}>
          <u>Ingredients for the menu</u>
        </label>
        <br />
        <br />
        <br />
        {ingridientList && (
          <List
            bordered
            dataSource={ingridientList}
            renderItem={(item) => (
              <List.Item>
                <Card style={{ width: "100%" }}>
                  <Row>
                    <Col xs={12} xl={6}>
                      <center>
                        <label style={{ fontSize: "120%" }}>
                          {item.ingredient_name}
                        </label>
                      </center>
                    </Col>
                    <Col xs={12} xl={6}>
                      <center>
                        Required Amount:
                        <br />
                        <b>
                          {item.required_amount} {item.unit}
                        </b>
                      </center>
                    </Col>
                    <Col xs={12} xl={6}>
                      <center>
                        Leftover amount:
                        <br />
                        <b>
                          {item.left_item} {item.unit}
                        </b>
                      </center>
                    </Col>
                    <Col xs={12} xl={6}>
                      <center>
                        <label style={{ fontSize: "120%" }}>
                          Rs. {item.per_unit_price * item.required_amount}/-
                        </label>
                      </center>
                    </Col>
                  </Row>
                </Card>
              </List.Item>
            )}
          />
        )}
        <Card style={{ width: "100%" }}>
          <Row>
            <Col xs={12} xl={6}>
              <center>
                <label style={{ fontSize: "150%" }}>
                  <b>Total</b>
                </label>
              </center>
            </Col>
            <Col xs={12} xl={6}></Col>
            <Col xs={12} xl={6}></Col>
            <Col xs={12} xl={6}>
              <center>
                <b style={{ fontSize: "150%" }}>Rs. 60000/-</b>
              </center>
            </Col>
          </Row>
        </Card>
      </Card>
    </div>
  );
};

export default ProcedureLogs;
