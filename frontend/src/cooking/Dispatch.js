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
  Dropdown,
} from "antd";
import { useState } from "react";
import { CaretRightOutlined, RightSquareFilled } from "@ant-design/icons";
import Header from "../components/navigation/Header";
import Sidebar from "../components/navigation/SideNav";
import DeshboardBg from "../res/img/DeshboardBg.png";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

const dateFormatterForToday = () => {
  const dateObj = new Date();
  const formattedDate = `${
    (dateObj.getMonth() + 1) < 10
      ? `0${dateObj.getMonth() + 1}`
      : dateObj.getMonth() + 1
  }/${(dateObj.getDate()) < 10
    ? `0${dateObj.getDate()}`
    : dateObj.getDate()}/${dateObj.getFullYear()}`;
  console.log(formattedDate);
  return formattedDate;
};

const dateFormatter = () => {
  const dateObj = new Date();
  const formattedDate = `${
    (dateObj.getMonth() + 1 < 10) ? `${dateObj.getMonth() + 1}` : dateObj.getMonth() + 1
  }/${dateObj.getDate()}/${dateObj.getFullYear()}`;
  return formattedDate
}

const TodaysDate = dateFormatterForToday()
const  newTodaysDate = dateFormatter()

const Dispatch = () => {
  const data = ["Set Menu", "Cooking", "Dispatch"];
  const [visible, setVisible] = useState(false);

  const [selectedDate, setSelectedDate] = useState(newTodaysDate);
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
  const [dispatchDoneStatus, setDispatchDoneStatus] = useState(false)

  //validation stats
  const [userSelectedError, setUserSelectedError] = useState(false);
  const [inputError, setInputError] = useState(false);
  const [unitValueType, setUnitValueType] = useState("")
  const [containerType, setContainerType] = useState("")

  const [status, setStatus] = useState();

  const navigate = useNavigate();


  const handleChange = (value) => {
    setUnitValueType(value)
  }

  /**************Restricting Cooking Route************************* */

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
          unitValueType,
          containerType,
          no_of_deigh: daigs,
          mk_id: mohallaUserId,
          food_name: name,
          delivery_status: "pending",
        }),
      });

      if (data) {
        const res = await data.json();

        setFinalDispatchData(res.data)
        console.log(res);


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
        setDispatchDoneStatus(true)
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
        open={visible}
        onOk={() => setVisible(false)}
        onCancel={() => setVisible(false)}
        footer={[
          <Button key="ok" type="primary" onClick={() => {
            setVisible(false)}}>
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
            colorPrimary: "darkred",
          },
        }}
      >
        <div style={{ display: "flex" }}>
          <Sidebar k="3" userType="cooking" />

          <div style={{ width: "100%" }}>
            <Header
              title="Dispatch"
              comp={<Row>
                <Col xs={24} xl={12}>
                  Select the date:
                  <br />
                  <DatePicker defaultValue={dayjs(TodaysDate, 'MM/DD/YYYY')} onChange={handleDateChange} />
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
              </Row>}
            />

            {status < 3 && (
              <center>
                <div style={{ marginTop: '8%', marginBottom: '8%', width:'30%' }}>
                  <label style={{ fontSize: '800%', color: 'darkred' }}>
                    <i class="fa-solid fa-hourglass-start"></i>
                  </label>
                  <br/><br/>
                  <label style={{ fontSize: '120%', width:'50%' }}>Cooking has not been done yet. Please wait while cooking department has confirmed dispatch.</label>
                </div>
              </center>
            )}
            {status === 4 && (
              <table>
              <tbody>
              <tr>
                <td colSpan={2}>
                  <br />
                  <Alert style={{marginLeft: "2rem"}}
                    message="Menu Not Procured"
                    description="This Menu is already dispatched"
                    type="success"
                    closable
                  />
                </td>
              </tr>
              </tbody>
              </table>
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
                                border: "2px solid darkred",
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
                  <table>
                  <tbody>
                  <tr>
                    <td colSpan={2}>
                      <br />
                      <Alert style={{marginLeft: "2rem"}}
                        message="Warning"
                        description="Enter weight and daig"
                        type="error"
                        closable
                      />
                    </td>
                  </tr>
                  </tbody>
                  </table>
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
                            border: "2px solid darkred",
                            width: "98%",
                          }}
                        >
                          <Card
                            style={{
                              width: "100%",
                              backgroundColor: "transparent",
                              border: "none",
                            }}
                            bodyStyle={{padding: '10px 10px 10px'}}
                            bordered={false}
                          >
                            <span style={{ fontSize: '1.5rem', margin: '1rem .5rem'}}>{item.food_name}</span>
                            <Row>
                              {finaldipatchData &&
                              finaldipatchData.filter(
                                (batch) =>
                                  batch.food_item_id === item.food_item_id
                              ).length <= 0 ? (
                                <>
                                  <Col xs={12} xl={12}>
                                    <span style={{fontSize: '1.1rem'}}>
                                    Number of 
                                    </span>
                                    <Input 
                                    placeholder="container"
                                    style={{width: '40%', margin: '8px', border: "none", borderBottom: '2px solid darkred'}}
                                    onChange={(e) => setContainerType(e.target.value)}
                                    />
                                    :<br />
                                    <Input
                                      placeholder="Eg: 2, 3, 15, etc."
                                      onChange={(e) => setDaigs(e.target.value)}
                                      style={{ fontSize: "140%", width: "70%" }}
                                    ></Input>
                                  </Col>
                                  <Col xs={12} xl={12}>
                                    <span style={{fontSize: '1.1rem'}}>
                                    Total
                                    </span>
                                    <Select
                                        defaultValue="weight"
                                        onChange={handleChange}
                                        style={{
                                          width: 120, margin: '8px 1px',
                                          borderBottom: '2px solid darkred',
                                          borderRadius: "10px"
                                        }}
                                        bordered={false}
                                        options={[
                                          {
                                            value: 'weight',
                                            label: 'Weight (Kg)',
                                          },
                                          {
                                            value: 'count',
                                            label: 'Count',
                                          },
                                        ]}
                                      />
                                    : <br />
                                    <Input
                                      placeholder="Eg: 2, 3, 15, etc."
                                      style={{ fontSize: "140%", width: "70%" }}
                                      onChange={(e) =>
                                        setTotalWeight(e.target.value)
                                      }
                                    ></Input>
                                  </Col>
                                </>
                              ) : <Col xs={12} xl={12} style={{ padding: "1%" }}>
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
                                          Number of {item?.containerType}: <br />
                                          <label style={{ fontSize: "150%" }}>
                                            {item.no_of_deigh}
                                          </label>
                                        </Col>
                                        <Col xs={24} xl={12}>
                                          Total {item?.unitValueType}: <br />
                                          <label style={{ fontSize: "150%" }}>
                                            {item.total_weight} Kg
                                          </label>
                                        </Col>
                                      </Row>
                                    </div>
                                  ))}
                                  </Col>}
                                  <Col xs={12} xl={12} style={{ padding: "1%" }}>
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
                              <Col xs={24} xl={24}>
                              
                              {finaldipatchData &&
                              finaldipatchData.filter(
                                (batch) =>
                                  batch.food_item_id === item.food_item_id
                              ).length <= 0 ? (
                                  <Button
                                  type="primary"
                                  style={{marginTop: '10px'}}
                                  onClick={(e) =>
                                    {
                                      if (!daigs && !totalWeight) {
                                        return;
                                      }
                                      dispatchData(
                                      item.food_item_id,
                                      item.food_name
                                    )}
                                  }
                                >
                                  Pack Food
                                </Button>
                              ) : (
                                <label >
                                  <Tag 
                                  style={{marginTop: '10px'}} color="green">Food Packed</Tag>
                                </label>
                              )}
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
                    disabled={dispatchDoneStatus}
                    style={{ height: "160%", fontSize: "200%" }}
                    type="primary"
                    onClick={DispatchDone}
                  >
                    Sent for Delivery
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
