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
} from "antd";
import { useState } from "react";
import { RightSquareFilled } from "@ant-design/icons";

const Dispatch = () => {
  const data = ["Set Menu", "Cooking", "Dispatch"];
  const [visible, setVisible] = useState(false);

  const [selectedDate, setSelectedDate] = useState(null);
  const [menuFoodId, setMenuFoodId] = useState();
  const [getMohallaUsers, setGetMohallaUsers] = useState();
  const [foodList, setFoodList] = useState();
  const [daigs, setDaigs] = useState();
  const [totalWeight, setTotalWeight] = useState();
  const [foodId, setFoodId] = useState();
  const [update, setUpdate] = useState(false);

  const [mohallaUserId, setMohallaUserId] = useState();
  const [viewDispatchedData, setViewDispatchedData] = useState();
  const [finaldipatchData, setFinalDispatchData] = useState([]);
  const [statusOP, setStatusOP] = useState(false);

  const handleDateChange = (date) => {
    console.log(date);
    const dateObj = new Date(date);
    const formattedDate = `${
      dateObj.getMonth() + 1
    }/${dateObj.getDate()}/${dateObj.getFullYear()}`;
    setSelectedDate(formattedDate);
  };

  console.log(selectedDate);

  //get the dispatch data for mk -user.

  useEffect(() => {
    const getFood = async () => {
      if (menuFoodId && mohallaUserId) {
        const data = await fetch("http://localhost:5001/operation_pipeline", {
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
          console.log("mohalla user food data: ", res);
        }
      }
    };
    getFood();
  }, [menuFoodId, mohallaUserId]);

  //updating the dispatch delivery status.

  useEffect(() => {
    const getFood = async () => {
      if (menuFoodId && mohallaUserId) {
        const data = await fetch("http://localhost:5001/operation_pipeline", {
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
          console.log("mohalla user food updated: ", res);
        }
      }
    };
    getFood();
  }, [menuFoodId, mohallaUserId]);

  //getting the status from operational pipeline
  useEffect(() => {
    const getFood = async () => {
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
          console.log("operational pipeline status: ", res);
        }
      }
    };
    getFood();
  }, [menuFoodId]);

  //getting the dispatched data from the OP
  useEffect(() => {
    const getFood = async () => {
      if (menuFoodId) {
        const data = await fetch("http://localhost:5001/operation_pipeline", {
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
            console.log(res.dispatch);
            if (res.dispatch.length > 0) {
              setViewDispatchedData(res.dispatch);
            }
          }
        }
      }
    };
    getFood();
  }, [menuFoodId, visible, mohallaUserId]);

  console.log("dispatched View data: ", viewDispatchedData);
  console.log("dispatched View data object: ", finaldipatchData);

  //filtering the dispatched data based on the Mohalla admin
  useEffect(() => {
    if (viewDispatchedData) {
      console.log("inside data");
      const data = viewDispatchedData.filter(
        (item) => item.mk_id === mohallaUserId
      );
      if (data[0]) {
        console.log(data[0].dispatch);
        setFinalDispatchData(data[0].dispatch);
        console.log(
          "===========================FINAL DISPATCH DATA=================================\n\n",
          finaldipatchData
        );
      } else {
        setFinalDispatchData([]);
      }
    }
  }, [viewDispatchedData, mohallaUserId, getMohallaUsers]);

  useEffect(() => {
    const getFood = async () => {
      if (selectedDate) {
        const data = await fetch("http://localhost:5001/cooking/ingredients", {
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
          if (res) {
            setMenuFoodId(res[0]._id);
            setGetMohallaUsers(res[0].mohalla_wise_ashkhaas);
            setFoodList(res[0].food_list);
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
      console.log("inside");
      const data = await fetch("http://localhost:5001/operation_pipeline", {
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
        console.log("done");
        setVisible(true);
        setDaigs("");
        setTotalWeight("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  console.log("mohalla users: ", getMohallaUsers);
  console.log("menu id: ", menuFoodId);
  console.log("Food list: ", foodList);

  console.log("mohalla id: ", mohallaUserId);

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
          <p>Data Dispatched Successfully</p>
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
          <Card
            style={{ padding: "1%", border: "1px solid grey" }}
            bordered={true}
          >
            <Row>
              <Col xs={12} xl={8}>
                <label style={{ fontSize: "200%" }}>Dispatch</label>
              </Col>
              <Col xs={12} xl={8}>
                Select the date:
                <br />
                <DatePicker onChange={handleDateChange} />
              </Col>
              <Col xs={12} xl={8}>
                Select the client:
                <br />
                <Select
                  defaultValue={0}
                  style={{ width: "80%" }}
                  options={[
                    { value: 0, label: "MK" },
                    { value: 1, label: "Mohsin Ranapur" },
                    { value: 2, label: "Shk. Aliasgar Ranapur" },
                  ]}
                />
              </Col>
            </Row>
          </Card>
          <Row>
            <Col xs={24} xl={12}>
              <Divider style={{ backgroundColor: "#000" }}></Divider>
              {getMohallaUsers && (
                <List
                  style={{ width: "100&" }}
                  itemLayout="horizontal"
                  dataSource={getMohallaUsers}
                  renderItem={(item, index) => (
                    <List.Item>
                      <Card style={{ width: "100%" }}>
                        <Row>
                          <Col xs={12} xl={12}>
                            Food Name:
                            <br />
                            <label style={{ fontSize: "125%" }}>
                              {item.name}
                            </label>
                          </Col>
                          <Col xs={12} xl={12}>
                            <Button
                              type="ghost"
                              style={{ marginLeft: "30%", fontSize: "200%" }}
                              onClick={() => setMohallaDispatchData(item.mk_id)}
                            >
                              <i class="fa-solid fa-circle-chevron-right"></i>
                            </Button>
                          </Col>
                        </Row>
                      </Card>
                    </List.Item>
                  )}
                />
              )}
            </Col>
            <Col xs={24} xl={12} style={{ padding: "3%" }}>
              <Card>
                <label
                  style={{ fontSize: "200%" }}
                  className="dongle-font-class"
                >
                  Select the items
                </label>
                <hr></hr>
                {foodList && (
                  <List
                    size="small"
                    bordered
                    dataSource={foodList}
                    renderItem={(item, index) => (
                      <List.Item>
                        <Card title={item.food_name} bordered={false}>
                          <Row>
                            <Col xs={12} xl={12}>
                              Number of Daigs: <br />
                              <Input
                                placeholder="Eg: 2, 3, 15, etc."
                                onChange={(e) => setDaigs(e.target.value)}
                                style={{ fontSize: "140%", width: "70%" }}
                              ></Input>
                            </Col>
                            <Col xs={12} xl={12}>
                              Total Weight (units): <br />
                              <Input
                                placeholder="Eg: 2, 3, 15, etc."
                                style={{ fontSize: "140%", width: "70%" }}
                                onChange={(e) => setTotalWeight(e.target.value)}
                              ></Input>
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
                                            {item.total_weight}
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
                              Confirm Delivery: <br />
                              <Tag color="orange">Pending</Tag>
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
                )}
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default Dispatch;
