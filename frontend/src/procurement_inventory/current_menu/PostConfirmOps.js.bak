import React, { useEffect, useState } from "react";
import { Row, Col, List, Input, Card, Button, Tag, DatePicker } from "antd";

const PostConfirmOps = () => {
  const [menuFoodId, setMenuFoodId] = useState();
  const [selectedDate, setSelectedDate] = useState(null);
  const [foodItems, setFoodItems] = useState(null);
  const [reorderLogs, setReorderLogs] = useState([]);
  const [update, setUpdate] = useState(true);

  const data = [
    "Inventory",
    "Purchases",
    "Current Menu",
    "Vendors",
    "Damaged Goods",
  ];

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
          if (res) {
            setMenuFoodId(res[0]._id);
            setFoodItems(res[0].food_list);
          }
        }
      }
    };
    getFood();
  }, [selectedDate]);

  useEffect(() => {
    const getData = async () => {
      if (selectedDate && menuFoodId) {
        const data = await fetch("http://localhost:5001/operation_pipeline", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type: "get_reorder_data",
            date: selectedDate,
            menu_id: menuFoodId,
          }),
        });

        if (data) {
          const res = await data.json();
          if (res) {
            setReorderLogs(res.reorder_logs);
          }
        }
      }
    };
    getData();
  }, [selectedDate, menuFoodId, update]);

  const updateReorderStatus = async (id) => {
    try {
      console.log("inside");
      const data = await fetch("http://localhost:5001/operation_pipeline", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          menu_id: menuFoodId,
          type: "update_operation_pipeline_reorder_status",
          inventory_id: id,
        }),
      });

      if (data) {
        const res = await data.json();
        if (res) {
          console.log(res);
          setUpdate((prev) => !prev);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  console.log("menu: ", menuFoodId);
  console.log("food items: ", foodItems);
  console.log("reorder logs: ", reorderLogs);

  const handleDateChange = (date) => {
    const dateObj = new Date(date);
    const formattedDate = `${
      dateObj.getMonth() + 1
    }/${dateObj.getDate()}/${dateObj.getFullYear()}`;
    setSelectedDate(formattedDate);
  };
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
        <Col xs={24} xl={20} style={{ padding: "3%" }}>
          <label style={{ fontSize: "300%" }} className="dongle-font-class">
            Post-Procument Ops
          </label>
          <hr></hr>
          <DatePicker onChange={handleDateChange} />

          <br />
          <label style={{ fontSize: "180%" }} className="dongle-font-class">
            Food Item Cooking Status
          </label>
          {foodItems && (
            <List
              grid={{
                gutter: 16,
                xs: 1,
                sm: 2,
                md: 4,
                lg: 4,
                xl: 6,
                xxl: 3,
              }}
              dataSource={foodItems}
              renderItem={(item) => (
                <List.Item>
                  <Card title={item.food_name}>
                    Cooking Status:{" "}
                    {item.status === "COOKING" ? (
                      <Tag color="gold">Cooking</Tag>
                    ) : (
                      <Tag color="green">Ready for Dispatch</Tag>
                    )}
                  </Card>
                </List.Item>
              )}
            />
          )}
          <br />
          <br />
          <label style={{ fontSize: "180%" }} className="dongle-font-class">
            Re-order Logs
          </label>
          {reorderLogs && (
            <List
              bordered
              dataSource={reorderLogs}
              renderItem={(item) => (
                <List.Item>
                  <Card style={{ width: "100%" }}>
                    <Row>
                      <Col xs={8} xl={8}>
                        {item.ingridient_name}
                      </Col>
                      <Col xs={8} xl={8}>
                        Required quantity: {item.quantity_requireds} {item.unit}
                      </Col>
                      <Col xs={8} xl={8}>
                        {item.reorder_delivery_status ? (
                          <>
                            <Button
                              onClick={(e) =>
                                updateReorderStatus(item.inventory_id)
                              }
                              type="primary"
                            >
                              FULLFILL ORDER
                            </Button>
                          </>
                        ) : (
                          <Tag color="green">FULFILLED</Tag>
                        )}
                      </Col>
                    </Row>
                  </Card>
                </List.Item>
              )}
            />
          )}
        </Col>
      </Row>
    </div>
  );
};

export default PostConfirmOps;
