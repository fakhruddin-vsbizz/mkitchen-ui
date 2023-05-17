import React, { useEffect, useState } from "react";
import {
  List,
  Card,
  Row,
  Col,
  Slider,
  DatePicker,
  Tag,
  Button,
  Input,
  InputNumber,
  Select,
  Modal,
  ConfigProvider,
} from "antd";
import Header from "../../components/navigation/Header";
import Sidebar from "../../components/navigation/SideNav";
import DeshboardBg from "../../res/img/DeshboardBg.png";
import { useNavigate } from "react-router-dom";
const DamagedGoodsList = () => {
  const [todayDate, setTodayDate] = useState("");

  const [inventoryId, setInventoryId] = useState();
  const [purchaseId, setPurchaseId] = useState();
  const [quantityLoaded, setQuantityLoaded] = useState();
  const [update, setUpdate] = useState(false);

  const [inputValue, setInputValue] = useState(1);
  const [days, setDays] = useState(1);
  const [expiredItems, setExpiredItems] = useState([]);

  useEffect(() => {
    const currentDate = new Date();
    const formattedDate = `${
      currentDate.getMonth() + 1
    }/${currentDate.getDate()}/${currentDate.getFullYear()}`;
    setTodayDate(formattedDate);
  }, []);

  console.log("todays date: ", todayDate);

  const navigate = useNavigate();

  /**************Restricting PandI Route************************* */

  useEffect(() => {
    console.log("in");

    const type = localStorage.getItem("type");

    console.log("ttt=>", type);

    if (!type) {
      console.log("second in");
      navigate("/login");
    }

    const typeAdmin = type === "mk admin" ? true : false;

    if (typeAdmin) {
      console.log("second in");
      navigate("/admin/menu");
    }
    if (!typeAdmin && type && type === "Cooking") {
      navigate("/cooking/ingredients");
    }
    if (!typeAdmin && type && type === "Procurement Inventory") {
      navigate("/pai/expiries");
    }
  }, [navigate]);

  /**************Restricting PandI Route************************* */

  //getting all purchase data
  useEffect(() => {
    const getPurchaseData = async () => {
      if (todayDate) {
        try {
          const data = await fetch("http://localhost:5001/purchase");
          const res = await data.json();

          if (res) {
            const filterData = res.filter((item) => {
              const expiryDate = new Date(item.expiry_date);
              const today = new Date(todayDate);
              return item.unshelf === false && expiryDate < today;
            });
            setExpiredItems(filterData);
            console.log(filterData);
          }
        } catch (e) {
          console.log(e);
        }
      }
    };

    getPurchaseData();
  }, [todayDate, update]);

  const onChange = (newValue) => {
    setInputValue(newValue);
  };

  const onChangeDayValue = (newValue) => {
    setDays(newValue);
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const getIds = async (inventory_id, purchase_id, quantity_loaded) => {
    setIsModalOpen(true);
    setInventoryId(inventory_id);
    setPurchaseId(purchase_id);
    setQuantityLoaded(quantity_loaded);
  };

  const unshelfAndRemoveItem = async () => {
    console.log(inventoryId);
    console.log(purchaseId);
    console.log(quantityLoaded);

    //update unshelf in purchase
    try {
      const data = await fetch("http://localhost:5001/purchase/update_shelf", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          purchase_id: purchaseId,
          shelf: true,
        }),
      });
      if (data) {
        console.log(data);
      }
    } catch (e) {
      console.log(e);
    }
    //update total volume in inventory

    try {
      const data = await fetch(
        "http://localhost:5001/inventory/addinventory/update_volume",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            inventory_id: inventoryId,
            quantity: +quantityLoaded,
          }),
        }
      );
      if (data) {
        console.log(data);
      }
    } catch (e) {
      console.log(e);
    }
    setUpdate((prev) => !prev);
    setIsModalOpen(false);
  };

  return (
    <div
      style={{ margin: 0, padding: 0, backgroundImage: `url(${DeshboardBg})` }}
    >
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "orange",
          },
        }}
      >
        <div style={{ display: "flex" }}>
          <Sidebar k="5" userType="pai" />

          <div style={{ width: "100%" }}>
            <Header title="Expries" />
            <div style={{ width: "100%", padding: "20px 0px" }}>
              <div style={{ width: "100%" }}>
                <center>
                  <Card
                    style={{
                      width: "85%",
                      textAlign: "left",
                      backgroundColor: "transparent",
                    }}
                  >
                    <Row style={{ width: "100%" }}>
                      <Col xs={12} xl={6}>
                        Filter by Ingredients: <br />
                        <Input
                          placeholder="Filter by ingredients. Eg: Chicken meat, Goat meat"
                          style={{ width: "70%" }}
                        ></Input>
                      </Col>
                      <Col xs={12} xl={6}>
                        Date of Purchase: <br />
                        <DatePicker></DatePicker>
                      </Col>
                      <Col xs={12} xl={6}>
                        Expiry Period: <br />
                        <Row>
                          <Col xs={6} xl={3}>
                            <InputNumber
                              min={1}
                              value={days}
                              onChange={onChangeDayValue}
                            ></InputNumber>
                          </Col>
                          <Col xs={6} xl={3}>
                            <Select
                              defaultValue={0}
                              options={[
                                { value: 0, label: "Days" },
                                { value: 1, label: "Months" },
                                { value: 2, label: "Years" },
                              ]}
                            ></Select>
                          </Col>
                        </Row>
                      </Col>
                      <Col xs={12} xl={6}>
                        Price Range: <br />
                        <Row>
                          <Col xs={12} xl={12}>
                            <Slider
                              style={{ width: "70%" }}
                              min={1}
                              max={100000}
                              onChange={onChange}
                              value={
                                typeof inputValue === "number" ? inputValue : 0
                              }
                            />
                          </Col>
                          <Col xs={12} xl={12}>
                            <InputNumber
                              min={1}
                              max={100000}
                              style={{ margin: "0 16px" }}
                              value={inputValue}
                              onChange={onChange}
                            />
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </Card>
                  {expiredItems && (
                    <List
                      style={{ width: "85%" }}
                      dataSource={expiredItems}
                      renderItem={(item, idx) => (
                        <List.Item>
                          <Row
                            style={{
                              margin: 5,
                              width: "100%",
                              backgroundColor: "white",
                              padding: "2%",
                              borderRadius: 10,
                              borderBottom: "2px solid orange",
                            }}
                          >
                            <Col
                              xs={24}
                              xl={6}
                              style={{ fontSize: "150%", color: "#e08003" }}
                            >
                              {item.ingredient_name}
                            </Col>
                            <Col xs={12} xl={4}>
                              Expired on: <br />
                              {item.expiry_date}
                            </Col>
                            <Col xs={12} xl={4}>
                              Date of purchase: <br />
                              {item.createdAt}
                            </Col>
                            <Col xs={12} xl={6}>
                              Days from expired date: <br />
                              {idx + 1} days
                            </Col>
                            <Col xs={12} xl={4}>
                              <Button
                                type="primary"
                                onClick={(e) =>
                                  getIds(
                                    item.inventory_id,
                                    item._id,
                                    item.quantity_loaded
                                  )
                                }
                              >
                                TAKE ACTION
                              </Button>
                            </Col>
                          </Row>
                        </List.Item>
                      )}
                    />
                  )}
                  <Modal
                    open={isModalOpen}
                    onOk={handleOk}
                    onCancel={handleCancel}
                    footer={[]}
                  >
                    <label style={{ fontSize: "140%" }}>
                      Unshelf this Item?
                    </label>
                    <br />
                    <br />
                    Its been noted that its been over the specified expiry
                    period. What action should we take for the ingredient stock
                    here?
                    <br />
                    <br />
                    <br />
                    <Row>
                      <Col xs={12} xl={12}>
                        <Button type="primary">KEEP IN INVENTORY</Button>
                      </Col>
                      <Col xs={12} xl={12}>
                        <Button
                          type="primary"
                          onClick={unshelfAndRemoveItem}
                          danger
                        >
                          UNSHELF AND REMOVE AMOUNT
                        </Button>
                      </Col>
                    </Row>
                  </Modal>
                </center>
              </div>
            </div>
          </div>
        </div>
      </ConfigProvider>
    </div>
  );
};

export default DamagedGoodsList;
