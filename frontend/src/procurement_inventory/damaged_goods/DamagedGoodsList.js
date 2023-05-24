import React, { useEffect, useState } from "react";
import {
  List,
  Card,
  Row,
  Col,
  Slider,
  DatePicker,
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
  const [filteredExpiredItems, setFilteredExpiredItems] = useState([]);
	const [filterByName, setFilterByName] = useState("");
  const [filterByDate, setFilterByDate] = useState(null);
  const [filterByDaysAfterExpiry, setFilterByDaysAfterExpiry] = useState(0)

  const daysAfterExpiry = (expiry_date) => {
    return (new Date(new Date(expiry_date).getDate() - new Date().getDate()).getDate())+1
  }

  useEffect(() => {
    const currentDate = new Date();
    const formattedDate = `${
      currentDate.getMonth() + 1
    }/${currentDate.getDate()}/${currentDate.getFullYear()}`;
    setTodayDate(formattedDate);
  }, []);

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
      navigate("/pai/expiries");
    }
  }, [navigate]);

  /**************Restricting PandI Route************************* */

  //getting all purchase data
  // useEffect(() => {
  //   const getPurchaseData = async () => {
  //     if (todayDate) {
  //       try {
  //         const data = await fetch("/api/purchase");
  //         const res = await data.json();

  //         if (res) {
  //           const filterData = res.filter((item) => {
  //             const expiryDate = new Date(item.expiry_date);
  //             const today = new Date(todayDate);
  //             return item.unshelf === false && expiryDate < today;
  //           });
  //           setExpiredItems(filterData);
  //           console.log(filterData);
  //         }
  //       } catch (e) {
  //         console.log(e);
  //       }
  //     }
  //   };

  //   getPurchaseData();
  // }, [todayDate, update]);



  useEffect(() => {
		const filterList = () => {
      if (filterByName && filterByDaysAfterExpiry !== 0 && filterByDate !== null) {
				return expiredItems.filter(item =>
					item.ingredient_name.toLowerCase().includes(filterByName.toLowerCase()) && daysAfterExpiry(item.expiry_date) <= filterByDaysAfterExpiry && new Date(item.createdAt).toDateString() === new Date(filterByDate).toDateString()
				);
			} else 
      if (filterByName && filterByDaysAfterExpiry !== 0) {
				return expiredItems.filter(item =>
					item.ingredient_name.toLowerCase().includes(filterByName.toLowerCase()) && daysAfterExpiry(item.expiry_date) <= filterByDaysAfterExpiry
				);
			} else 
      if (filterByName && filterByDate !== null) {
				return expiredItems.filter(item =>
					item.ingredient_name.toLowerCase().includes(filterByName.toLowerCase()) && new Date(item.createdAt).toDateString() === new Date(filterByDate).toDateString()
				);
			} else 
      if (filterByDaysAfterExpiry !== 0 && filterByDate !== null) {
				return expiredItems.filter(item =>
					daysAfterExpiry(item.expiry_date) <= filterByDaysAfterExpiry && new Date(item.createdAt).toDateString() === new Date(filterByDate).toDateString()
				);
			} else 
      if (filterByName) {
				return expiredItems.filter(item =>
					item.ingredient_name.toLowerCase().includes(filterByName.toLowerCase()))
			} else if (filterByDate !== null) {
				return expiredItems.filter(item => new Date(item.createdAt).toDateString() === new Date(filterByDate).toDateString())
			} else 
      if (filterByDaysAfterExpiry !== 0 ) {
				return expiredItems.filter(item => daysAfterExpiry(item.expiry_date) <= filterByDaysAfterExpiry
				);
			}
			return expiredItems
		};
		const filteredList = filterList();
		setFilteredExpiredItems(filteredList);
	}, [filterByName, expiredItems, filterByDate, filterByDaysAfterExpiry]);


  console.log(todayDate);
  
  useEffect(() => {
    const getPurchaseData = async () => {
      if (todayDate) {
        const data = await fetch(
          "/api/purchase/expired_items",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              date: todayDate,
            }),
          }
        );
        if (data) {
          const res = await data.json();
          if (res) {
            setExpiredItems(res);

            setFilteredExpiredItems(res);

          }
        }
      }
    };
    getPurchaseData();
  }, [todayDate, update]);

  // const onChange = (newValue) => {
  //   setInputValue(newValue);
  // };

  // const onChangeDayValue = (newValue) => {
  //   setDays(newValue);
  // };

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
    //update unshelf in purchase
    try {
      const data = await fetch("/api/purchase/update_shelf", {
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
      }
    } catch (e) {
      console.log(e);
    }
    //update total volume in inventory

    try {
      const data = await fetch(
        "/api/inventory/addinventory/update_volume",
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
                        value={filterByName}
                        onChange={e => setFilterByName(e.target.value)}
                          placeholder="Filter by ingredients. Eg: Chicken meat, Goat meat"
                          style={{ width: "70%" }}
                        ></Input>
                      </Col>
                      <Col xs={12} xl={6}>
                        Date of Purchase: <br />
                        <DatePicker onChange={value => setFilterByDate(value)}></DatePicker>
                      </Col>
                      <Col xs={12} xl={6}>
                        Days After Expiry: <br />
                        <Row>
                          <Col xs={6} xl={3}>
                            <InputNumber
                              min={0}
                              value={filterByDaysAfterExpiry}
                              onChange={value => setFilterByDaysAfterExpiry(value)}
                            />
                          </Col>
                          {/* <Col xs={6} xl={3}>
                            <Select
                              defaultValue={0}
                              options={[
                                { value: 0, label: "Days" },
                                { value: 1, label: "Months" },
                                { value: 2, label: "Years" },
                              ]}
                            ></Select>
                          </Col> */}
                        </Row>
                      </Col>
                    </Row>
                  </Card>
                  {expiredItems && (
                    <List
                      style={{ width: "85%" }}
                      dataSource={filteredExpiredItems}
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
                              {new Date(item.expiry_date).toDateString()}
                            </Col>
                            <Col xs={12} xl={4}>
                              Date of purchase: <br />
                              {new Date(item.createdAt).toDateString()}
                            </Col>
                            <Col xs={12} xl={6}>
                              Days after expiry: <br />
                              {(new Date( (new Date(item.expiry_date).getDate()) - (new Date().getDate()))).toDateString()} days
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
