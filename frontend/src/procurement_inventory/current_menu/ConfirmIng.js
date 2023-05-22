import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  List,
  Input,
  Card,
  Button,
  DatePicker,
  ConfigProvider,
  Modal,
  Alert,
} from "antd";
import Header from "../../components/navigation/Header";
import Sidebar from "../../components/navigation/SideNav";
import DeshboardBg from "../../res/img/DeshboardBg.png";
import { MinusCircleFilled, PlusCircleFilled } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

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

  const navigate = useNavigate();
  /**************Restricting PandI Route************************* */

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
      navigate("/pai/procurement");
    }
  }, [navigate]);

  /**************Restricting PandI Route************************* */

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
        const data = await fetch("/operation_pipeline", {
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
        const data = await fetch("/cooking/ingredients", {
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
            setOperationalPipelineStatus(res.status);
          }
        }
      }
    };
    getFood();
  }, [selectedDate]);

  useEffect(() => {
    const getInventory = async () => {
      if (selectedDate) {
        try {
          const data = await fetch("/pai/procurement", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              date: selectedDate,
              type: "get_procure_history",
            }),
          });

          if (data) {
            const res = await data.json();
            console.log(res, "ressss");
            if (res._id) {

              setProcureIngridients(res.procure_items);
              
            }
            if (res.message) {

              if (menuFoodId) {
                try {
                  const data = await fetch(
                    "/pai/procurement",
                    {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        menu_id: menuFoodId,
                        type: "get_procure_data",
                      }),
                    }
                  );

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
            }
          }
        } catch (error) {
          console.log(error);
        }
      }
    };
    getInventory();
  }, [menuFoodId, selectedDate]);



  const markProcureIngridients = async () => {
    try {
      const data = await fetch("/pai/procurement", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          documents: procureIngridients,
          menu_id: menuFoodId,
          type: "procure_ingridient",
          date: selectedDate,
          procure_items: procureIngridients,
        }),
      });

      if (data) {
        const res = await data.json();
        if (res) {
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
          <p>Ingridients Procured Successfully</p>
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
          <Sidebar k="3" userType="pai" />

          <div style={{ width: "100%" }}>
            <Header
              title="Confirm Ingredient"
              comp={<DatePicker onChange={handleDateChange} />}
            />
            {operationalPipelineStatus === 0 && (
              <Alert
                message="Message"
                description="Ingridients not set for the selected date"
                type="error"
                closable
              />
            )}
            {operationalPipelineStatus >= 2 && (
              <Alert
                message="Menu Procured"
                description="This Menu is been Procured"
                type="success"
                closable
              />
            )}
            <div style={{ width: "100%", padding: 0 }}>
              <div style={{ width: "95%", padding: "2%" }}>
                {procureIngridients && (
                  <List
                    size="small"
                    style={{
                      height: "75vh",
                      width: "100%",
                      overflowY: "scroll",
                      backgroundColor: "transparent",
                    }}
                    dataSource={procureIngridients}
                    renderItem={(item) => (
                      <List.Item>
                        <div
                          style={{
                            margin: 5,
                            width: "100%",

                            backgroundColor: "white",
                            padding: "2%",
                            borderRadius: 10,
                            borderBottom: "2px solid orange",
                          }}
                        >
                          <br />
                          <Row>
                            <Col xs={8} xl={8}>
                              <label style={{ fontSize: "140%" }}>
                                <span>{item.ingridientName}</span>
                              </label>
                            </Col>
                            <Col xs={8} xl={8}>
                              Amount Procured: <br />
                              <label
                                style={{
                                  color: item.sufficient ? "green" : "red",
                                  fontSize: "130%",
                                }}
                              >
                                {item.total_quantity} {item.unit}
                              </label>
                            </Col>
                            <Col
                              xs={8}
                              xl={8}
                              style={{
                                color: item.sufficient ? "green" : "red",
                              }}
                            >
                              {!item.sufficient ? (
                                <div style={{ fontSize: "120%" }}>
                                  <MinusCircleFilled
                                    style={{ fontSize: "130%" }}
                                  />
                                  &nbsp;&nbsp;&nbsp;FULFILLED THROUGH NEGATIVE
                                  INVENTORY
                                </div>
                              ) : (
                                <div style={{ fontSize: "120%" }}>
                                  <PlusCircleFilled
                                    style={{ fontSize: "130%" }}
                                  />
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

                {operationalPipelineStatus &&
                  operationalPipelineStatus < 2 &&
                  operationalPipelineStatus !== 0 && (
                    <Button
                      onClick={markProcureIngridients}
                      block
                      type="primary"
                      style={{ fontSize: "200%", height: "10%" }}
                    >
                      FINALIZE AND PUSH TO INVENTORY
                    </Button>
                  )}
              </div>
            </div>
          </div>
        </div>
      </ConfigProvider>
    </div>
  );
};

export default ConfirmIng;
