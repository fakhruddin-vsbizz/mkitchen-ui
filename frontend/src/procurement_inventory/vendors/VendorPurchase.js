import React, { useEffect } from "react";
import { useState } from "react";
import {
  Card,
  Row,
  Col,
  Button,
  List,
  Tag,
  Input,
  DatePicker,
  Select,
  Slider,
  InputNumber,
  ConfigProvider,
} from "antd";
import Header from "../../components/navigation/Header";
import Sidebar from "../../components/navigation/SideNav";
import DeshboardBg from "../../res/img/DeshboardBg.png";
import { useNavigate } from "react-router-dom";
import { colorBackgroundColor, colorBlack, colorNavBackgroundColor } from "../../colors";
import { baseURL } from "../../constants";

const VendorPurchase = () => {
  const [purchaseList, setPurchaseList] = useState();

  const [filteredPurchases, setFilteredPurchases] = useState([]);
	const [filterByName, setFilterByName] = useState("");
  const [filterByDate, setFilterByDate] = useState(null);
  const [filterByStatus, setFilterByStatus] = useState("all")
  const [inventoryItems, setInventoryItems] = useState([]);
  
  const [inputValue, setInputValue] = useState(1);
  const [update, setUpdate] = useState(false);

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
      navigate("/pai/vendors/purchases");
    }
  }, [navigate]);

  /**************Restricting PandI Route************************* */

  //getting all purchase data
  useEffect(() => {
    const getPurchaseData = async () => {
      try {
        const data = await fetch(
          "/api/purchase/vendor_purchase"
        );
        const res = await data.json();

        if (res) {
          setPurchaseList(res.data);
        }
      } catch (e) {
        console.log(e);
      }
    };
    getPurchaseData();
  }, [update]);


  useEffect(() => {
		const filterList = () => {
      if (filterByName && filterByStatus !== "all" && filterByDate !== null) {
				return purchaseList.filter(item =>
					item.ingredient_name.toLowerCase().includes(filterByName.toLowerCase()) && item.paid === filterByStatus && new Date(item.createdAt).toDateString() === new Date(filterByDate).toDateString()
				);
			} else if (filterByName && filterByStatus !== "all") {
				return purchaseList.filter(item =>
					item.ingredient_name.toLowerCase().includes(filterByName.toLowerCase()) && item.paid === filterByStatus
				);
			} else 
      if (filterByName && filterByDate !== null) {
				return purchaseList.filter(item =>
					item.ingredient_name.toLowerCase().includes(filterByName.toLowerCase()) && new Date(item.createdAt).toDateString() === new Date(filterByDate).toDateString()
				);
			} else 
      if (filterByStatus !== "all" && filterByDate !== null) {
				return purchaseList.filter(item =>
					item.paid === filterByStatus && new Date(item.createdAt).toDateString() === new Date(filterByDate).toDateString()
				);
			} else 
      if (filterByName) {
				return purchaseList.filter(item =>
					item.ingredient_name.toLowerCase().includes(filterByName.toLowerCase()))
			} else if (filterByDate !== null) {
				return purchaseList.filter(item => new Date(item.createdAt).toDateString() === new Date(filterByDate).toDateString())
			} 
      else if (filterByStatus !== "all") {
				return purchaseList.filter(item => item.paid === filterByStatus
				);
			}
			return purchaseList
		};
		const filteredList = filterList();
		setFilteredPurchases(filteredList);
	}, [filterByName, purchaseList, filterByDate, filterByStatus]);


  useEffect(() => {
    const getInventory = async () => {
      try {
        const data = await fetch("/api/cooking/ingredients", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type: "get_inventory_ingridients",
          }),
        });

        if (data) {
          const res = await data.json();
          if (res) {
            setInventoryItems(res);
          }
        }
      } catch (error) {
        console.log(error);
      }
    };
    getInventory();
  }, []);

  const payPurchaseItem = async (id) => {
    try {
      const data = await fetch("/api/purchase", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          purchase_id: id,
          paid: true,
        }),
      });
      if (data) {
        setUpdate((prev) => !prev);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const onChange = (newValue) => {
    setInputValue(newValue);
  };

  return (
    <div
      style={{ margin: 0, padding: 0}}
    >
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "orange",
          },
        }}
      >
        <div style={{ display: "flex", backgroundColor: colorNavBackgroundColor }}>
          {localStorage.getItem("type") === "mk superadmin" ? <Sidebar k="12" userType="superadmin" /> :
          <Sidebar k="4" userType="pai" />}

          <div style={{ width: "100%", backgroundColor: colorBackgroundColor }}>
            <Header
              title="Vendor"
              // comp={<center>
              //   <Button style={{ backgroundColor: "white", color: "orange" }}>
              //     Cancel
              //   </Button>
              // </center>}
            />
            <div style={{ width: "100%", padding: 0 }}>
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
                      Paid status: <br />
                      <Select
                        defaultValue="all"
                        value={filterByStatus}
                        onChange={value => setFilterByStatus(value)}
                        style={{ width: "70%" }}
                        options={[
                          { value: true, label: "PAID" },
                          { value: false, label: "UNPAID" },
                          { value: "all", label: "ALL" },
                        ]}
                      ></Select>
                    </Col>
                    {/* <Col xs={12} xl={6}>
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
                    </Col> */}
                  </Row>
                </Card>
                {purchaseList && (
                  <List
                    style={{
                      width: "100%",
                      height: "60vh",
                      width: "85vw",
                      overflowY: "scroll",
                    }}
                    dataSource={filteredPurchases}
                    renderItem={(item) => (
                      <List.Item
                        style={{
                          margin: 10,
                          padding: 20,
                          display: "flex",
                          backgroundColor: "#fff",
                          borderRadius: 10,
                          borderBottom: "2px solid orange",
                          width: "98%",
                        }}
                      >
                        <Row
                          style={{
                            width: "100%",
                            textAlign: "left",
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <Col xs={8} xl={6} style={{ fontSize: "150%" }}>
                            {item.ingredient_name}
                          </Col>
                          <Col xs={8} xl={4}>
                            Required quantity: <br />
                            {item.quantity_loaded}{" "}
                            {inventoryItems.length !== 0 &&
                              inventoryItems
                                .filter(
                                  (itemNew) => itemNew.ingridient_name === item.ingredient_name
                                )[0]?.ingridient_measure_unit}
                          </Col>
                          <Col xs={8} xl={4}>
                            Total Amount: <br />
                            Rs. {item.total_amount}/-
                          </Col>
                          <Col xs={12} xl={4}>
                            Date of purchase: <br />
                            {new Date(item.createdAt).toDateString()}
                          </Col>
                          <Col xs={12} xl={6}>
                            <Tag color={item.paid ? "green" : "red"}>
                              {item.paid ? "PAID" : "UNPAID"}
                            </Tag>
                            &nbsp;&nbsp;&nbsp;
                            {!item.paid ? (
                              <Button
                                onClick={(e) => payPurchaseItem(item._id)}
                              >
                                MARK PAID
                              </Button>
                            ) : null}
                          </Col>
                        </Row>
                      </List.Item>
                    )}
                  />
                )}
              </center>
            </div>
          </div>
        </div>
      </ConfigProvider>
    </div>
  );
};

export default VendorPurchase;
