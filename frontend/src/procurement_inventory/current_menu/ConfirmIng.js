import React, { useEffect, useState } from "react";
import { Row, Col, List, Input, Card, Button, DatePicker, Modal } from "antd";

const ConfirmIng = () => {
  const [menuFoodId, setMenuFoodId] = useState();
  const [selectedDate, setSelectedDate] = useState(null);
  const [procureIngridients, setProcureIngridients] = useState([]);
  const [visible, setVisible] = useState(false);
  const [operationalPipelineStatus, setOperationalPipelineStatus] = useState();

  const data = [
    "Inventory",
    "Purchases",
    "Current Menu",
    "Vendors",
    "Damaged Goods",
  ];

  const handleDateChange = (date) => {
    const dateObj = new Date(date);
    const formattedDate = `${
      dateObj.getMonth() + 1
    }/${dateObj.getDate()}/${dateObj.getFullYear()}`;
    setSelectedDate(formattedDate);
  };

  useEffect(() => {
    const getStatus = async () => {
      if (menuFoodId) {
        const data = await fetch("http://localhost:5001/operation_pipeline", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type: "get_status_op",
            menu_id: menuFoodId,
          }),
        });
        if (data) {
          const res = await data.json();
          console.log(res);
          if (res) {
            setOperationalPipelineStatus(res);
          }
        }
      }
    };
    getStatus();
  }, [menuFoodId, selectedDate]);

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
    const getInventory = async () => {
      if (menuFoodId) {
        try {
          console.log("inside");
          const data = await fetch("http://localhost:5001/pai/procurement", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              menu_id: menuFoodId,
              type: "get_procure_data",
            }),
          });

          if (data) {
            const res = await data.json();
            if (res) {
              setProcureIngridients(res);
            }
          }
        } catch (error) {
          console.log(error);
        }
      }
    };
    getInventory();
  }, [menuFoodId]);

  console.log("date: ", selectedDate);
  console.log("menu id: ", menuFoodId);
  console.log("procure items: ", procureIngridients);
  console.log("status: ", operationalPipelineStatus);

  const markProcureIngridients = async () => {
    try {
      const data = await fetch("http://localhost:5001/pai/procurement", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          documents: procureIngridients,
          menu_id: menuFoodId,
          type: "procure_ingridient",
        }),
      });

      if (data) {
        const res = await data.json();
        if (res) {
          console.log(res);
          setVisible(true);
          setSelectedDate("");
          setMenuFoodId("");
        }
      }
    } catch (err) {
      console.log(err);
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
          <p>Ingridients Procured Successfully</p>
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
          <label style={{ fontSize: "300%" }} className="dongle-font-class">
            Confirm Ingredient
          </label>
          <hr></hr>
          <DatePicker onChange={handleDateChange} />
          {procureIngridients && (
            <List
              size="small"
              bordered
              dataSource={procureIngridients}
              renderItem={(item) => (
                <List.Item>
                  <div
                    style={{
                      width: "100%",
                      backgroundColor: item.sufficient ? "lightgreen" : "pink",
                      padding: "2%",
                    }}
                  >
                    <label style={{ fontSize: "140%" }}>
                      <u>{item.ingridientName}</u>
                    </label>
                    <br />
                    <Row>
                      <Col xs={12} xl={12}>
                        Search vendor: <br />
                        <label style={{ fontSize: "120%" }}>
                          {item.total_quantity} {item.unit}
                        </label>
                      </Col>
                      <Col xs={12} xl={12}>
                        {!item.sufficient ? (
                          <></>
                        ) : (
                          <div>
                            <i class="fa-solid fa-circle-check"></i>
                            &nbsp;&nbsp;&nbsp;FULFILLED THROUGH INVENTORY
                          </div>
                        )}
                      </Col>
                    </Row>
                  </div>
                </List.Item>
              )}
            />
          )}

          <br />
          <br />
          {operationalPipelineStatus && operationalPipelineStatus < 2 && (
            <Button
              onClick={markProcureIngridients}
              block
              type="primary"
              style={{ fontSize: "200%", height: "10%" }}
            >
              FINALIZE AND PUSH TO INVENTORY
            </Button>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default ConfirmIng;
