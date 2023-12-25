import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  List,
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
import { useLocation, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import {
  colorBackgroundColor,
  colorBlack,
  colorGreen,
  colorNavBackgroundColor,
  valueShadowBox,
} from "../../colors";
import { baseURL } from "../../constants";

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

const ConfirmIng = () => {
  const [menuFoodId, setMenuFoodId] = useState();
  const [selectedDate, setSelectedDate] = useState(newTodaysDate);
  const [procureIngridients, setProcureIngridients] = useState([]);
  const [visible, setVisible] = useState(false);
  const [operationalPipelineStatus, setOperationalPipelineStatus] = useState();
  const [reasonForChangingMenu, setReasonForChangingMenu] = useState("");

  const [finalizeBtnVisible, setFinalizeBtnVisible] = useState(false);

  const navigate = useNavigate();

  const location = useLocation();

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

  const onRestock = (id) => {
    navigate(`/pai/purchases/new/${id}`, {
      state: { prevPath: location.pathname },
    });
    // console.log(id);
  };

  useEffect(() => {
    const getFood = async () => {
      if (selectedDate) {
        const data = await fetch("/api/cooking/ingredients", {
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
          console.log("res", res);
          if (res?.message) {
            setMenuFoodId("");
            return;
          } else if (res[0]) {
            setMenuFoodId(res[0]?._id || "");
            setOperationalPipelineStatus(res?.status);
            setReasonForChangingMenu(res?.reason_for_reconfirming_menu);
          }
        }
      }
    };
    getFood();
  }, [selectedDate]);

  useEffect(() => {
    const getStatus = async () => {
      if (menuFoodId) {
        const data = await fetch("/api/operation_pipeline", {
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
          // console.log("ressss", res);
          if (res?.message) {
            // setOperationalPipelineStatus(-1);
            // console.log(res);
            return;
          } else if (res) {
            setOperationalPipelineStatus(res);
          }
        }
      } else {
        setOperationalPipelineStatus(-1);
      }
    };
    getStatus();
  }, [menuFoodId]);

  useEffect(() => {
    const getInventory = async () => {
      // console.log(menuFoodId);
      if (!menuFoodId) {
        setProcureIngridients([]);
        return;
      } else if (selectedDate && menuFoodId) {
        try {
          const data = await fetch("/api/pai/procurement", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              date: selectedDate,
              menu_id: menuFoodId,
              type: "get_procure_history",
            }),
          });

          if (data) {
            const res = await data.json();
            // console.log(res);
            console.log("170 res", res);
            if (res?.message) {
              try {
                if (menuFoodId) {
                  try {
                    const data = await fetch("/api/pai/procurement", {
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
                      console.log("220 res", res);

                      if (res) {
                        setProcureIngridients(res);
                      }
                    }
                  } catch (error) {
                    console.log(error);
                  }
                }
              } catch (error) {
                console.log(error);
              }
              // if (menuFoodId) {
              //   try {
              //     const data = await fetch("/api/pai/procurement", {
              //       method: "POST",
              //       headers: {
              //         "Content-Type": "application/json",
              //       },
              //       body: JSON.stringify({
              //         menu_id: menuFoodId,
              //         type: "get_procure_data",
              //       }),
              //     });

              //     if (data) {
              //       const res = await data.json();
              //       if (res) {
              //         setProcureIngridients(res);
              //       }
              //     }
              //   } catch (error) {
              //     console.log(error);
              //   }
              // }
            } else if (res._id) {
              setProcureIngridients(res?.procure_items);
            }
          }
        } catch (error) {
          console.log(error);
        }
      } else {
      }
    };
    getInventory();
  }, [menuFoodId]);

  const markProcureIngridients = async () => {
    console.log(procureIngridients);
    try {
      const data = await fetch("/api/pai/procurement", {
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
          procured_status: true,
        }),
      });

      if (data) {
        const res = await data.json();
        console.log("proc res", res);
        setOperationalPipelineStatus(2);
        // if (res) {
        //   setVisible(true);
        //   // setSelectedDate("");
        //   // setMenuFoodId("");
        // }
      }
    } catch (err) {
      console.log(err);
    }
  };

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
              setFinalizeBtnVisible(true);
              setVisible(false);
            }}>
            OK
          </Button>,
        ]}>
        <div style={{ textAlign: "center" }}>
          <h2 style={{ color: "#52c41a" }}>Success!</h2>
          <p>Ingridients Procured Successfully</p>
        </div>
      </Modal>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: colorGreen,
          },
        }}>
        <div
          style={{ display: "flex", backgroundColor: colorNavBackgroundColor }}>
          {localStorage.getItem("type") === "mk superadmin" ? (
            <Sidebar k="11" userType="superadmin" />
          ) : (
            <Sidebar k="3" userType="pai" />
          )}

          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              backgroundColor: colorBackgroundColor,
            }}>
            <Header
              title="Confirm Ingredient"
              comp={
                <Row style={{ justifyContent: "flex-end" }}>
                  <Col xs={24} xl={12}>
                    <span style={{ fontSize: "1.1rem" }}>
                      Select the date:&nbsp;
                    </span>
                    <DatePicker
                      defaultValue={dayjs(TodaysDate, "MM/DD/YYYY")}
                      onChange={handleDateChange}
                      // disabledDate={(current) => current - 1 > dayjs().endOf('day')}
                    />
                  </Col>
                </Row>
              }
            />
            {operationalPipelineStatus < 0 && (
              <center>
                <div
                  style={{ marginTop: "8%", marginBottom: "8%", width: "30%" }}>
                  <label style={{ fontSize: "800%", color: colorGreen }}>
                    <i
                      style={{ color: "gray" }}
                      className="fa-solid fa-hourglass-start"></i>
                  </label>
                  <br />
                  <br />
                  <label
                    style={{ fontSize: "120%", width: "50%", color: "gray" }}>
                    Menu is not set for today.
                    <br />
                    Please try after sometime.
                  </label>
                </div>
              </center>
              // <Alert
              //   style={{ margin: "0.5rem" }}
              //   message="Message"
              //   description="Menu is not set for today"
              //   type="error"
              //   closable
              // />
            )}
            {operationalPipelineStatus === 0 && (
              <center>
                <div
                  style={{ marginTop: "8%", marginBottom: "8%", width: "32%" }}>
                  <label style={{ fontSize: "800%", color: colorGreen }}>
                    <i
                      style={{ color: "gray" }}
                      className="fa-solid fa-hourglass-start"></i>
                  </label>
                  <br />
                  <br />
                  <label
                    style={{ fontSize: "120%", width: "50%", color: "gray" }}>
                    Ingridients not set for the selected date.
                    <br />
                    Please try after sometime.
                  </label>
                </div>
              </center>
              // <Alert
              //   style={{ margin: "0.5rem" }}
              //   message="Message"
              //   description="Ingridients not set for the selected date"
              //   type="error"
              //   closable
              // />
            )}
            {operationalPipelineStatus >= 2 && (
              <Alert
                style={{ margin: "0.5rem" }}
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
                    locale={{ emptyText: " " }}
                    style={{
                      maxHeight: "70vh",
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
                            padding: "1%",
                            borderRadius: 10,
                            // border: "2px solid darkred",
                            boxShadow: valueShadowBox,
                          }}>
                          <Row>
                            <Col xs={8} xl={4}>
                              <label style={{ fontSize: "140%" }}>
                                <span>{item.ingridientName}</span>
                              </label>
                            </Col>
                            <Col xs={8} xl={6}>
                              Total Quantity:{" "}
                              <label
                                style={{
                                  color: item.sufficient ? "green" : "red",
                                  fontSize: "130%",
                                }}>
                                {(
                                  Number(item.total_quantity) +
                                  Number(item.requiredVolume)
                                ).toFixed(2)}{" "}
                                {item.unit}
                              </label>
                            </Col>
                            <Col xs={8} xl={6}>
                              Require Quantity:{" "}
                              <label
                                style={{
                                  color: item.sufficient ? "green" : "red",
                                  fontSize: "130%",
                                }}>
                                {Number(item.requiredVolume.toFixed(2))}{" "}
                                {item.unit}
                              </label>
                            </Col>
                            <Col
                              xs={8}
                              xl={8}
                              style={{
                                color: item.sufficient ? "green" : "red",
                              }}>
                              {!item.sufficient ? (
                                // <div style={{ fontSize: "120%" }}>
                                //   <MinusCircleFilled
                                //     style={{ fontSize: "130%" }}
                                //   />
                                //   &nbsp;&nbsp;&nbsp;FULFILLED THROUGH NEGATIVE
                                //   INVENTORY
                                // </div>
                                <div
                                  style={{
                                    color: "darkred",
                                    display: "flex",
                                    columnGap: "1rem",
                                    alignItems: "center",
                                    rowGap: "5px",
                                  }}>
                                  <span>
                                    <i className="fa-solid fa-circle-exclamation"></i>{" "}
                                    You are short on items
                                  </span>
                                  <Button
                                    onClick={() =>
                                      onRestock(item?.inventoryItemId)
                                    }
                                    style={{
                                      backgroundColor: "green",
                                    }}
                                    type="primary">
                                    Restock Ingredient
                                  </Button>
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
              </div>
            </div>
            {/* {reasonForChangingMenu !== "" && operationalPipelineStatus >= 2 ? (<>
            <Button>Collect previos</Button>
            </>) : */}
            {operationalPipelineStatus === 1 && menuFoodId && (
              <Button
                onClick={markProcureIngridients}
                disabled={
                  finalizeBtnVisible ||
                  (procureIngridients.length !== 0 &&
                    procureIngridients.filter(
                      (item) => item?.sufficient === false
                    ).length !== 0)
                }
                block
                type="primary"
                style={{
                  fontSize: "200%",
                  height: "10%",
                  width: "97%",
                  alignSelf: "center",
                }}>
                Hand Over To Cooking Department
              </Button>
            )}
          </div>
        </div>
      </ConfigProvider>
    </div>
  );
};

export default ConfirmIng;
