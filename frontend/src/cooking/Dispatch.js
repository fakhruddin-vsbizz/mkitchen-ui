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

  const [dipatchData, setDispatchData] = useState([]);

  const handleDateChange = (date) => {
    console.log(date);
    const dateObj = new Date(date);
    const formattedDate = `${
      dateObj.getMonth() + 1
    }/${dateObj.getDate()}/${dateObj.getFullYear()}`;
    setSelectedDate(formattedDate);
  };

  console.log(selectedDate);

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

  const dispatchData = async (food_id) => {
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
  console.log("Dispatch Data: ", dipatchData);
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
          <Row>
            <Col xs={12} xl={12}>
              <p>
                <label
                  style={{ fontSize: "300%" }}
                  className="dongle-font-class"
                >
                  Dispatch
                </label>
              </p>
              Select Client: &nbsp;&nbsp;&nbsp;
              <Select
                defaultValue={0}
                style={{ width: "80%" }}
                options={[
                  { value: 0, label: "MK" },
                  { value: 1, label: "Mohsin Ranapur" },
                  { value: 2, label: "Shk. Aliasgar Ranapur" },
                ]}
              />
              <DatePicker
                style={{ marginTop: "50px" }}
                onChange={handleDateChange}
              />
              <Divider style={{ backgroundColor: "#000" }}></Divider>
              {getMohallaUsers && (
                <List
                  style={{ width: "100&" }}
                  itemLayout="horizontal"
                  dataSource={getMohallaUsers}
                  renderItem={(item, index) => (
                    <List.Item>
                      {item.name}
                      <Button
                        type="ghost"
                        style={{ marginLeft: "30%" }}
                        onClick={() => setMohallaDispatchData(item.mk_id)}
                      >
                        <RightSquareFilled />
                      </Button>
                    </List.Item>
                  )}
                />
              )}
            </Col>
            <Col xs={12} xl={12} style={{ padding: "3%" }}>
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
                              Number of Daigs:
                              <br />
                              <Input
                                onChange={(e) => setDaigs(e.target.value)}
                                placeholder="Eg: 2,3,etc"
                              ></Input>
                            </Col>
                            <Col xs={12} xl={12}>
                              Total Daig weight:
                              <br />
                              <Input
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
                          </Row>
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

// const food_item_list = [
//   {
//     mohalla_id: 0,
//     food_dispatch_log: [
//       {
//         food: "Mutton Biryani",
//         ingredient_list: [],
//         idx: 1,
//       },
//       {
//         food: "Mutton Kebab",
//         ingredient_list: [],
//         idx: 2,
//       },
//       {
//         food: "Daal Gosht",
//         ingredient_list: [],
//         idx: 3,
//       },
//       {
//         food: "Jira Masala",
//         ingredient_list: [],
//         idx: 4,
//       },
//     ],
//   },
//   {
//     mohalla_id: 1,
//     food_dispatch_log: [
//       {
//         food: "Mutton Biryani",
//         ingredient_list: [],
//         idx: 1,
//       },
//       {
//         food: "Mutton Kebab",
//         ingredient_list: [],
//         idx: 2,
//       },
//       {
//         food: "Daal Gosht",
//         ingredient_list: [],
//         idx: 3,
//       },
//       {
//         food: "Jira Masala",
//         ingredient_list: [],
//         idx: 4,
//       },
//     ],
//   },
// ];
