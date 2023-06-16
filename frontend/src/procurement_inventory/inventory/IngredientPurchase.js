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
import { Link, useNavigate, useParams } from "react-router-dom";
import Header from "../../components/navigation/Header";
import Sidebar from "../../components/navigation/SideNav";
import DeshboardBg from "../../res/img/DeshboardBg.png";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { colorBackgroundColor, colorBlack, colorGreen, colorNavBackgroundColor } from "../../colors";
import { baseURL } from "../../constants";

const IngredientPurchase = () => {
  const [itemPurchase, setItemPurchase] = useState();
  const [vendors, setVendors] = useState([]);
  const [filteredPurchases, setFilteredPurchases] = useState([]);
	const [filterByName, setFilterByName] = useState("");
  const [filterByDate, setFilterByDate] = useState(null);
  const [filterByStatus, setFilterByStatus] = useState(null);
  const [inventoryItems, setInventoryItems] = useState([]);
  const [paidStatusUpdated, setPaidStatusUpdated] = useState(true);

  const { id } = useParams();

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
    // if (!typeAdmin && type && type === "Procurement Inventory") {
    //   navigate("/pai/inventory/purchases/:id");
    // }
  }, [navigate]);

  /**************Restricting PandI Route************************* */

  useEffect(() => {
    const getInventory = async () => {
      const data = await fetch("/api/vendor");
      if (data) {
        const res = await data.json();
        if (res) {
          if (res) {
            setVendors(res);
          }
        }
      }
    };
    getInventory();
  }, []);

  useEffect(() => {
    const getInventory = async () => {
      const data = await fetch("/api/purchase");
      if (data && id) {
        const res = await data.json();
        if (res) {
          if (res) {
            let purchaseData = res.length !== 0 && res.filter(
              (item, index) => item.inventory_id === id
            );
            setItemPurchase(purchaseData);
            setFilteredPurchases(purchaseData);
            console.log(purchaseData);
          }
        }
      }
    };
    getInventory();
  }, [id, paidStatusUpdated]);



  useEffect(() => {
		const filterList = () => {
      if (filterByName && filterByStatus !== null && filterByDate !== null) {
				return itemPurchase.filter(item =>
					getVendor(item.vendor_id).toLowerCase().includes(filterByName.toLowerCase()) && item.paid === filterByStatus && new Date(item.createdAt).toDateString() === new Date(filterByDate).toDateString()
				);
			} else if (filterByName && filterByStatus !== null) {
				return itemPurchase.filter(item =>
					getVendor(item.vendor_id).toLowerCase().includes(filterByName.toLowerCase()) && item.paid === filterByStatus
				);
			} else 
      if (filterByName && filterByDate !== null) {
				return itemPurchase.filter(item =>
					getVendor(item.vendor_id).toLowerCase().includes(filterByName.toLowerCase()) && new Date(item.createdAt).toDateString() === new Date(filterByDate).toDateString()
				);
			} else 
      if (filterByStatus !== null && filterByDate !== null) {
				return itemPurchase.filter(item =>
					item.paid === filterByStatus && new Date(item.createdAt).toDateString() === new Date(filterByDate).toDateString()
				);
			} else 
      if (filterByName) {
				return itemPurchase.filter(item =>
					getVendor(item.vendor_id).toLowerCase().includes(filterByName.toLowerCase()))
			} else if (filterByDate !== null) {
				return itemPurchase.filter(item => new Date(item.createdAt).toDateString() === new Date(filterByDate).toDateString())
			} 
      else if (filterByStatus !== null) {
				return itemPurchase.filter(item => item.paid === filterByStatus
				);
			}
			return itemPurchase
		};
		const filteredList = filterList();
		setFilteredPurchases(filteredList);
	}, [filterByName, itemPurchase, filterByDate, filterByStatus]);


  // const vendorPurchaseList = [
  //   {
  //     vendor_name: "V.K. General store",
  //     quantity_ordered: 130,
  //     rate: 600,
  //     unit: "KG",
  //     is_paid: false,
  //     created_on: "24-06-2023",
  //   },
  //   {
  //     vendor_name: "Brahma Stores",
  //     quantity_ordered: 400,
  //     rate: 40,
  //     unit: "KG",
  //     is_paid: true,
  //     created_on: "24-06-2023",
  //   },
  //   {
  //     vendor_name: "Mustali Stores",
  //     quantity_ordered: 500,
  //     rate: 25,
  //     unit: "KG",
  //     is_paid: false,
  //     created_on: "24-06-2023",
  //   },
  //   {
  //     vendor_name: "Supermarket Stores",
  //     quantity_ordered: 200,
  //     rate: 100,
  //     unit: "L",
  //     is_paid: true,
  //     created_on: "24-06-2023",
  //   },
  // ];

  const [inputValue, setInputValue] = useState(1);

  const onChange = (newValue) => {
    setInputValue(newValue);
  };

  const getVendor = (vendor_id) => {
    return vendors.filter((itemNew) => itemNew._id === vendor_id)[0]?.vendor_name
  }

  const paymentDone = (id) => {
    fetch("/api/purchase/payment_done", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: id
      }),
    }).then(res => res.json()).then(data => setPaidStatusUpdated(prev => !prev))
   
  }

  return (
    <div
      style={{ margin: 0, padding: 0}}
    >
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: colorGreen,
          },
        }}
      >
        <div style={{ display: "flex", backgroundColor: colorNavBackgroundColor }}>
        {localStorage.getItem("type") === "mk superadmin" ? <Sidebar k="9" userType="superadmin" /> :
          <Sidebar k="1" userType="pai" />}

          <div style={{ width: "100%", backgroundColor: colorBackgroundColor }}>
            <Header
              title={<p>
                <Link
                  to="/pai/inventory"
                  style={{ color: "white", textDecoration: "none" }}
                >
                  <ArrowLeftOutlined />
                </Link>{" "}
                Purchase Inventory
              </p>}
            />
            <div style={{ padding: 0 }}>
              <center>
                <Card
                  style={{
                    width: "95%",
                    textAlign: "left",
                    backgroundColor: "transparent",
                  }}
                >
                  <Row style={{ width: "100%" }}>
                    <Col xs={12} xl={6}>
                      Filter by vendor name: <br />
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
                      Payment status: <br />
                      <Select
                        defaultValue={null}
                        value={filterByStatus}
                        onChange={value => setFilterByStatus(value)}
                        style={{ width: "70%" }}
                        options={[
                          { value: true, label: "PAID" },
                          { value: false, label: "UNPAID" },
                          { value: null, label: "ALL" },
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
                            max={10000}
                            style={{ margin: "0 16px" }}
                            value={inputValue}
                            onChange={onChange}
                          />
                        </Col>
                      </Row>
                    </Col> */}
                  </Row>
                </Card>
                {itemPurchase && (
                  <List
                    style={{
                      padding: "0px 20px",
                      margin: "10px 0px",
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
                          // borderBottom: "2px solid orange",
                          boxShadow: '1px 1px 4px 4px lightgray',
                          width: "98%",
                        }}
                      >
                        <Row style={{ width: "100%", textAlign: "left", alignItems: 'center' }}>
                          <Col
                            xs={24}
                            xl={5}
                            style={{ fontSize: "150%", color: colorGreen }}
                          >
                            {vendors &&
                              getVendor(item.vendor_id)}
                          </Col>
                          <Col xs={8} xl={5}>
                            Ordered quantity:&nbsp;
                            {item.quantity_loaded} {item.unit}
                          </Col>
                          <Col xs={8} xl={4}>
                            Price: ₹{item.quantity_loaded * item.rate_per_unit}
                          </Col>
                          <Col xs={8} xl={5}>
                            Date of purchase:&nbsp;<br />
                            {new Date(item.createdAt).toDateString()}
                          </Col>
                          <Col xs={10} xl={5}>
                            {item?.paid === true ? <Tag color="green">
                              PAID
                            </Tag>: <div>
                            <Tag color="red">
                              UNPAID
                            </Tag>
                            <Button onClick={() => paymentDone(item._id)}>
                              Payment Done
                            </Button>
                            </div>}
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

export default IngredientPurchase;
