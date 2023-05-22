import React, { useEffect } from "react";
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
  Tag,
  DatePicker,
  Modal,
  ConfigProvider,
  Alert,
} from "antd";
import { useState } from "react";
import { CaretRightOutlined, RightSquareFilled } from "@ant-design/icons";
import Header from "../components/navigation/Header";
import Sidebar from "../components/navigation/SideNav";
import DeshboardBg from "../res/img/DeshboardBg.png";
import { useNavigate } from "react-router-dom";

const Dispatch = () => {
  const data = ["Set Menu", "Cooking", "Dispatch"];
  const [visible, setVisible] = useState(false);

  const [selectedDate, setSelectedDate] = useState(
    `${
      new Date().getMonth() + 1
    }/${new Date().getDate()}/${new Date().getFullYear()}`
  );
  const [menuFoodId, setMenuFoodId] = useState();
  const [getMohallaUsers, setGetMohallaUsers] = useState();
  const [foodList, setFoodList] = useState();
  const [daigs, setDaigs] = useState();
  const [totalWeight, setTotalWeight] = useState();
  const [foodId, setFoodId] = useState();
  const [update, setUpdate] = useState(false);
  const [isSelected, setIsSelected] = useState(false);

  const [mohallaUserId, setMohallaUserId] = useState();
  const [viewDispatchedData, setViewDispatchedData] = useState();
  const [finaldipatchData, setFinalDispatchData] = useState([]);
  const [statusOP, setStatusOP] = useState(false);

  //validation stats
  const [userSelectedError, setUserSelectedError] = useState(false);
  const [inputError, setInputError] = useState(false);

  const [status, setStatus] = useState();

  const navigate = useNavigate();

  /**************Restricting Cooking Route************************* */

  useEffect(() => {
    const type = localStorage.getItem("type");

    if (!type) {
      navigate("/login");
    }

    const typeAdmin = type === "mk admin" ? true : false;

    if (typeAdmin) {
      navigate("/admin/menu");
    }
    if (!typeAdmin && type && type === "Cooking") {
      navigate("/cooking/dispatch");
    }
    if (!typeAdmin && type && type === "Procurement Inventory") {
      navigate("/pai/inventory");
    }
  }, [navigate]);

  /**************Restricting Cooking Route************************* */

  //getting the status from operational pipeline
  useEffect(() => {
    const getFood = async () => {
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
          setStatus(res);
        }
      }
    };
    getFood();
  }, [menuFoodId]);

  const handleDateChange = (date) => {
    const dateObj = new Date(date);
    const formattedDate = `${
      dateObj.getMonth() + 1
    }/${dateObj.getDate()}/${dateObj.getFullYear()}`;

    setSelectedDate(formattedDate);

    setIsSelected(false);
  };

  //get the dispatch data for mk -user.

  useEffect(() => {
    const getFood = async () => {
      if (menuFoodId && mohallaUserId) {
        const data = await fetch("/api/operation_pipeline", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type: "get_mohalla_dispatch_data",
            menu_id: menuFoodId,
            mk_id: mohallaUserId,
          }),
        });
        if (data) {
          const res = await data.json();
        }
      }
    };
    getFood();
  }, [menuFoodId, mohallaUserId]);

  //updating the dispatch delivery status.

  useEffect(() => {
    const getFood = async () => {
      if (menuFoodId && mohallaUserId) {
        const data = await fetch("/api/operation_pipeline", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type: "update_dispatch_delivery_status",
            menu_id: menuFoodId,
            mk_id: mohallaUserId,
            food_item_id: "6440fb6d4f57047f11926b0f",
          }),
        });
        if (data) {
          const res = await data.json();
        }
      }
    };
    getFood();
  }, [menuFoodId, mohallaUserId]);

  //getting the status from operational pipeline
  useEffect(() => {
    const getFood = async () => {
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
        }
      }
    };
    getFood();
  }, [menuFoodId]);

  //getting the dispatched data from the OP
  useEffect(() => {
    const getFood = async () => {
      if (menuFoodId) {
        const data = await fetch("/api/operation_pipeline", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type: "get_dispatch_data",
            menu_id: menuFoodId,
          }),
        });
        if (data) {
          const res = await data.json();
          if (res) {
            if (res.dispatch.length > 0) {
              setViewDispatchedData(res.dispatch);
            }
          }
        }
      }
    };
    getFood();
  }, [menuFoodId, visible, mohallaUserId]);

  //filtering the dispatched data based on the Mohalla admin
  useEffect(() => {
    if (viewDispatchedData) {
      const data = viewDispatchedData.filter(
        (item) => item.mk_id === mohallaUserId
      );
      if (data[0]) {
        setFinalDispatchData(data[0].dispatch);
      } else {
        setFinalDispatchData([]);
      }
    }
  }, [viewDispatchedData, mohallaUserId, getMohallaUsers]);

  useEffect(() => {
    const getFood = async () => {
      if (selectedDate) {
        const data = await fetch("/api/cooking/ingredients", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type: "get_mohalla_users",
            mkuser_id: "",
            date: selectedDate,
          }),
        });
        if (data) {
          const res = await data.json();
          if (res[0]) {
            setMenuFoodId(res[0]._id);
            setGetMohallaUsers(res[0].mohalla_wise_ashkhaas);
            setFoodList(res[0].food_list);
          } else {
            setGetMohallaUsers([]);
            setInputError(false);
          }
        }
      }
    };
    getFood();
  }, [selectedDate]);

  const setMohallaDispatchData = async (mkId) => {
    setMohallaUserId(mkId);
  };

  const dispatchData = async (food_id, name) => {
    try {
      const data = await fetch("/api/operation_pipeline", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "post_dispatch_data",
          menu_id: menuFoodId,
          food_item_id: food_id,
          total_weight: totalWeight,
          no_of_deigh: daigs,
          mk_id: mohallaUserId,
          food_name: name,
          delivery_status: "pending",
        }),
      });

      if (data) {
        const res = await data.json();

        if (res.invalidData) {
          setInputError(true);
        } else {
          setVisible(true);
          setDaigs("");
          setTotalWeight("");
          setInputError(false);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  const DispatchDone = async () => {
    try {
      const data = await fetch("/api/operation_pipeline", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "update_operation_pipeline_status",
          menu_id: menuFoodId,
          status: 4,
        }),
      });

      if (data) {
        const res = await data.json();
        setVisible(true);
      }
    } catch (error) {
      console.log(error);
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
          <p>Ingridient Added Successfully</p>
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
          <Sidebar k="3" userType="cooking" />

          <div style={{ width: "100%" }}>
            <Header
              title="Dispatch"
              comp=<Row>
                <Col xs={24} xl={12}>
                  Select the date:
                  <br />
                  <DatePicker onChange={handleDateChange} />
                </Col>
                {/* <Col xs={24} xl={12}>
                  Select the client:
                  <br />
                  <Select
                    defaultValue={0}
                    style={{ width: "70%" }}
                    options={[
                      { value: 0, label: "MK" },
                      { value: 1, label: "Mohsin Ranapur" },
                      { value: 2, label: "Shk. Aliasgar Ranapur" },
                    ]}
                  />
                </Col> */}
              </Row>
            />

            {status < 3 && (
              <tr>
                <td colSpan={2}>
                  <br />
                  <Alert
                    message="Menu Not Procured"
                    description="This Menu is Not Cooked"
                    type="error"
                    closable
                  />
                </td>
              </tr>
            )}
            {status === 4 && (
              <tr>
                <td colSpan={2}>
                  <br />
                  <Alert
                    message="Menu Not Procured"
                    description="This Menu is already dispatched"
                    type="success"
                    closable
                  />
                </td>
              </tr>
            )}
            <Row style={{ padding: 10 }}>
              <Col xs={24} xl={12}>
                {getMohallaUsers &&
                  status !== 0 &&
                  status !== 1 &&
                  status !== 2 && (
                    <List
                      style={{ width: "100&" }}
                      itemLayout="horizontal"
                      dataSource={getMohallaUsers}
                      renderItem={(item, index) => (
                        <List.Item>
                          <Card
                            style={{
                              width: "100%",
                              backgroundColor: "transparent",
                              border: "none",
                            }}
                          >
                            <Row
                              style={{
                                padding: 20,
                                display: "flex",
                                backgroundColor: "#fff",
                                borderRadius: 10,
                                borderBottom: "2px solid orange",
                                width: "100%",
                              }}
                            >
                              <Col xs={16} xl={16}>
                                Food Name:
                                <br />
                                <label style={{ fontSize: "125%" }}>
                                  {item.name}
                                </label>
                              </Col>
                              <Col xs={8} xl={8}>
                                <Button
                                  type="primary"
                                  id={"set_index_" + item.index}
                                  onClick={() => {
                                    setMohallaDispatchData(item.mk_id);
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
              <Col xs={24} xl={12}>
                {inputError && (
                  <tr>
                    <td colSpan={2}>
                      <br />
                      <Alert
                        message="Warning"
                        description="Enter weight and daig"
                        type="error"
                        closable
                      />
                    </td>
                  </tr>
                )}
                {isSelected ? (
                  <Card style={{ backgroundColor: "transparent" }}>
                    {/* <label
                    style={{ fontSize: "200%" }}
                    className="dongle-font-class"
                  >
                    Select the items
                  </label>
        */}
                    <List
                      size="small"
                      style={{
                        width: "100%",
                        padding: 5,
                        height: "60vh",
                        overflowY: "scroll",
                        overflowX: "hidden",
                        // backgroundColor: '#fff6ed'
                      }}
                      dataSource={foodList}
                      renderItem={(item, index) => (
                        <List.Item
                          style={{
                            margin: 5,
                            padding: 0,
                            display: "flex",
                            backgroundColor: "#fff",
                            borderRadius: 10,
                            borderBottom: "2px solid orange",
                            width: "98%",
                          }}
                        >
                          <Card
                            title={item.food_name}
                            style={{
                              width: "100%",
                              backgroundColor: "transparent",
                              border: "none",
                            }}
                            bordered={false}
                          >
                            <Row>
                              {finaldipatchData &&
                              finaldipatchData.filter(
                                (batch) =>
                                  batch.food_item_id === item.food_item_id
                              ).length <= 0 ? (
                                <>
                                  <Col xs={12} xl={12}>
                                    Number of Daigs: <br />
                                    <Input
                                      placeholder="Eg: 2, 3, 15, etc."
                                      onChange={(e) => setDaigs(e.target.value)}
                                      style={{ fontSize: "140%", width: "70%" }}
                                    ></Input>
                                  </Col>
                                  <Col xs={12} xl={12}>
                                    Total Weight (Kg): <br />
                                    <Input
                                      placeholder="Eg: 2, 3, 15, etc."
                                      style={{ fontSize: "140%", width: "70%" }}
                                      onChange={(e) =>
                                        setTotalWeight(e.target.value)
                                      }
                                    ></Input>
                                  </Col>
                                </>
                              ) : null}

                              <Col xs={12} xl={12} style={{ padding: "1%" }}>
                                <br />
                                <br />
                                {finaldipatchData &&
                                  finaldipatchData
                                    .filter(
                                      (batch) =>
                                        batch.food_item_id === item.food_item_id
                                    )
                                    .map((item) => (
                                      <div>
                                        <Row>
                                          <Col xs={24} xl={12}>
                                            Number of Daigs: <br />
                                            <label style={{ fontSize: "150%" }}>
                                              {item.no_of_deigh}
                                            </label>
                                          </Col>
                                          <Col xs={24} xl={12}>
                                            Total Weight: <br />
                                            <label style={{ fontSize: "150%" }}>
                                              {item.total_weight} Kg
                                            </label>
                                          </Col>
                                        </Row>
                                      </div>
                                    ))}
                                {finaldipatchData &&
                                finaldipatchData.filter(
                                  (batch) =>
                                    batch.food_item_id === item.food_item_id
                                ).length <= 0 ? (
                                  <Button
                                    type="primary"
                                    onClick={(e) =>
                                      dispatchData(
                                        item.food_item_id,
                                        item.food_name
                                      )
                                    }
                                  >
                                    Dispatch Food
                                  </Button>
                                ) : (
                                  <label>
                                    <br />
                                    <Tag color="green">DISPATCHED</Tag>
                                  </label>
                                )}
                              </Col>
                              <Col xs={12} xl={12} style={{ padding: "1%" }}>
                                <br />
                                <br />
                                {finaldipatchData &&
                                  finaldipatchData
                                    .filter(
                                      (batch) =>
                                        batch.food_item_id === item.food_item_id
                                    )
                                    .map((ele) => (
                                      <div>
                                        <Row>
                                          <Col xs={24} xl={12}>
                                            {ele.delivery_status ===
                                            "completed" ? (
                                              <div>
                                                Confirm Delivery: <br />
                                                <Tag color="green">
                                                  Confirmed
                                                </Tag>
                                              </div>
                                            ) : (
                                              <div>
                                                Confirm Delivery: <br />
                                                <Tag color="orange">
                                                  Pending
                                                </Tag>
                                              </div>
                                            )}
                                          </Col>
                                        </Row>
                                      </div>
                                    ))}
                              </Col>
                            </Row>
                            {/* <Row>
                            <Col xs={12} xl={12}>
                              Number of Daigs:
                              <br />
                              <br />
                                {finaldipatchData &&
                                  finaldipatchData
                                    .filter(
                                      (batch) =>
                                        batch.food_item_id === item.food_item_id
                                    )
                                    .map((item) => (
                                      <h3 style={{ color: "green" }}>
                                        {" "}
                                        {item.total_weight}{" "}
                                        <label style={{ color: "red" }}>
                                          {" "}
                                          Dispatched
                                        </label>
                                      </h3>
                                    ))}
                              <Input
                                style={{ marginTop: "20px" }}
                                onChange={(e) => setDaigs(e.target.value)}
                                placeholder="Eg: 2,3,etc"
                              ></Input>
                            </Col>
                            <Col xs={12} xl={12}>
                              Total Daig weight:
                              <br />
                              <br />
                              <label style={{ paddingTop: "80px" }}>
                                {finaldipatchData &&
                                  finaldipatchData
                                    .filter(
                                      (batch) =>
                                        batch.food_item_id === item.food_item_id
                                    )
                                    .map((item) => (
                                      <h3 style={{ color: "green" }}>
                                        {item.no_of_deigh}
                                        <label style={{ color: "red" }}>
                                          {" "}
                                          Dispatched
                                        </label>
                                      </h3>
                                    ))}
                              </label>
                              <Input
                                style={{ marginTop: "20px" }}
                                onChange={(e) => setTotalWeight(e.target.value)}
                                placeholder="Eg: 2,3,etc"
                              ></Input>
                            </Col>
                            <Col xs={12} xl={12}>
                              <Button
                                onClick={(e) => dispatchData(item.food_item_id)}
                                type="primary"
                              >
                                DISPATCH
                              </Button>
                            </Col>
                            <Col xs={12} xl={12}>
                              Confirm Delivery?
                              <Tag color="gold">PENDING</Tag>
                            </Col>
                          </Row> */}
                          </Card>
                        </List.Item>
                      )}
                    />
                  </Card>
                ) : null}
              </Col>
              {getMohallaUsers &&
                getMohallaUsers.length > 0 &&
                status === 3 && (
                  <Button
                    block
                    style={{ height: "160%", fontSize: "200%" }}
                    type="primary"
                    onClick={DispatchDone}
                  >
                    Mark Dispatch Done
                  </Button>
                )}
            </Row>
          </div>
        </div>
      </ConfigProvider>
    </div>
  );
};

export default Dispatch;
