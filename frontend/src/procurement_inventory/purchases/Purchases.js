import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  List,
  Card,
  Input,
  DatePicker,
  Slider,
  InputNumber,
  // Button, Divider, Skeleton,
  ConfigProvider,
  Button,
} from "antd";
// import InfiniteScroll from 'react-infinite-scroll-component';
import Header from "../../components/navigation/Header";
import Sidebar from "../../components/navigation/SideNav";
import DeshboardBg from "../../res/img/DeshboardBg.png";
import { Link, useNavigate } from "react-router-dom";
import { colorBlack, colorGreen } from "../../colors";

const Purchases = () => {
  const [purchases, setPurchases] = useState([]);
  const [filteredPurchases, setFilteredPurchases] = useState([]);
	const [filterByName, setFilterByName] = useState("");
  const [filterByDate, setFilterByDate] = useState(null);
	const [filterByVolume, setFilterByVolume] = useState(1)

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
      navigate("/pai/purchases");
    }
  }, [navigate]);

  /**************Restricting PandI Route************************* */

  useEffect(() => {
    const getPurchases = async () => {
      const data = await fetch(
        "/api/purchase/vendor_purchase"
      );
      if (data) {
        const res = await data.json();
        setPurchases(res.data);

        setFilteredPurchases(res.data)
      }
    };
    getPurchases();
  }, []);
  useEffect(() => {
		const filterList = () => {
      if (filterByName && filterByVolume !== 1 && filterByDate !== null) {
				return purchases.filter(item =>
					item.ingredient_name.toLowerCase().includes(filterByName.toLowerCase()) && item.total_amount <= filterByVolume && new Date(item.createdAt).toDateString() === new Date(filterByDate).toDateString()
				);
			} else if (filterByName && filterByVolume !== 1) {
				return purchases.filter(item =>
					item.ingredient_name.toLowerCase().includes(filterByName.toLowerCase()) && item.total_amount <= filterByVolume
				);
			} else if (filterByName && filterByDate !== null) {
				return purchases.filter(item =>
					item.ingredient_name.toLowerCase().includes(filterByName.toLowerCase()) && new Date(item.createdAt).toDateString() === new Date(filterByDate).toDateString()
				);
			} else if (filterByVolume !== 1 && filterByDate !== null) {
				return purchases.filter(item =>
					item.total_amount <= filterByVolume && new Date(item.createdAt).toDateString() === new Date(filterByDate).toDateString()
				);
			} else if (filterByName) {
				return purchases.filter(item =>
					item.ingredient_name.toLowerCase().includes(filterByName.toLowerCase()))
			} else if (filterByDate !== null) {
				return purchases.filter(item => new Date(item.createdAt).toDateString() === new Date(filterByDate).toDateString())
			} else if (filterByVolume !== 1) {
				return purchases.filter(item => item.total_amount <= filterByVolume
				);
			}
			return purchases
		};
		const filteredList = filterList();
		setFilteredPurchases(filteredList);
	}, [filterByName, filterByVolume, purchases, filterByDate]);


  return (
    <div
      style={{
        margin: 0,
        padding: 0,
        // backgroundImage: `url(${DeshboardBg})`,
        height: "100%",
        // overflowY: "hidden",
      }}
    >
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: colorGreen,
          },
        }}
      >
        <div style={{ display: "flex" }}>
          <Sidebar k="2" userType="pai" />

          <div style={{ width: "100%" }}>
            <Header comp={<center style={{display: 'flex', justifyContent: 'flex-end'}}>
                <Link to="/pai/purchases/new">
                  <Button style={{ backgroundColor: "white", color: colorGreen }}>
                    <i className="fa-solid fa-circle-plus"></i> &nbsp;&nbsp;&nbsp;
                    New Purchase
                  </Button>
                </Link>
              </center>} title="Purchases" />
            <div style={{ padding: 0 }}>
              <Col xs={24} xl={17} style={{ width: "100%", padding: "0 2% 2%" }}>
                <table cellPadding={10}>
                  <tbody>
                  <tr>
                  <td style={{paddingLeft: "0", fontSize: '20px', fontWeight: '600', paddingRight: '1rem'}}>
                    <span style={{marginBottom: '.5rem', display: 'block'}}>
                      Ingredient name:
                    </span>
                      <Input style={{marginTop: '5px', height: '40px', fontSize: '18px', border: `1px solid ${colorBlack}`, borderRadius: '5px'}} value={filterByName} onChange={e => setFilterByName(e.target.value)} placeholder="Filter by name"></Input>
                    </td>
                    <td style={{paddingLeft: "0", fontSize: '20px', fontWeight: '600', width: '21%'}}>
                      <span style={{marginBottom: '.5rem', display: 'block'}}>
                        Date of purchase:
                      </span>
                      <ConfigProvider
                        theme={{
                          token: {
                            colorPrimary: colorGreen,
                            colorLink: colorGreen
                          },
                        }}
                      >
                      <DatePicker style={{ fontSize: '18px', border: `1px solid ${colorBlack}`, borderRadius: '5px'}} onChange={value => setFilterByDate(value)} />
                    </ConfigProvider>
                    </td>
                    <td style={{paddingLeft: "10px", fontSize: '20px', fontWeight: '600', width: '24%'}}>
                      <span style={{marginBottom: '.5rem', display: 'block', marginTop: '1.6rem'}}>
                        Filter By Price: <span style={{color: colorGreen}}>
                        {filterByVolume !== 1 ? filterByVolume : null}
                          </span>
                      </span>
                      <Slider
                        value={filterByVolume}
                        style={{color: colorBlack}}
                        onChange={value => setFilterByVolume(value)}
                        min={1}
                        max={1000}
                      ></Slider>
                      <br />
                      
                      {/* <InputNumber
                        value={filterByVolume}
                        onChange={value => setFilterByVolume(value)}
                      ></InputNumber> */}
                    </td>
                  </tr>
                  </tbody>
                </table>

                <label
                  style={{ fontSize: "180%" }}
                  className="dongle-font-class"
                >
                  Recent Purchases
                </label>
                <br />
                {purchases && (
                  <List
                    style={{
                      height: "55vh",
                      width: "80vw",
                      overflowY: "scroll",
                      backgroundColor: "transparent",
                    }}
                    dataSource={filteredPurchases}
                    renderItem={(item) => (
                      <List.Item>
                        <Card style={{ width: "100%" }}>
                          <Row style={{ width: "100%", textAlign: "left" }}>
                            <Col xs={24} xl={24} style={{ fontSize: "150%" }}>
                              {item.ingredient_name}
                            </Col>
                            <Col xs={12} xl={6}>
                              Purchase Quantity: <br />
                              {item.quantity_loaded} units
                            </Col>
                            <Col xs={12} xl={6}>
                              Vendor Name: <br />
                              {item.vendorName}
                            </Col>
                            <Col xs={12} xl={6}>
                              Date of purchase: <br />
                              {new Date(item.createdAt).toDateString()}
                            </Col>
                            <Col xs={12} xl={6}>
                              Purchase cost: <br />
                              <label style={{ fontSize: "120%" }}>
                                <b>
                                  Rs.{" "}
                                  {item.rate_per_unit * item.quantity_loaded}/-
                                </b>
                              </label>
                            </Col>
                          </Row>
                        </Card>
                        {/* <Card>
                    <label>
                      <b>{item.ingredient_name}</b>
                    </label>
                    <br />
                    <br />
                    Purchase quantity:
                    <br />
                    <label style={{ fontSize: "130%" }}>
                      {item.rate_per_unit}
                    </label>
                    <br />
                    per unit:
                    <br />
                    <label style={{ fontSize: "130%" }}>
                      {item.rate_per_unit}
                    </label>
                  </Card> */}
                      </List.Item>
                    )}
                  />
                )}
                {/* <br />
                <br />
                <br /> */}
                {/* <label style={{ fontSize: "180%" }} className="dongle-font-class">
            Short-on ingredients
          </label> */}
                {/* <br />
                <br /> */}
                {/* <List
            grid={{
              gutter: 16,
              xs: 1,
              sm: 2,
              md: 4,
              lg: 4,
              xl: 4,
              xxl: 3,
            }}
            dataSource={inventory_grid}
            renderItem={(item) => (
              <List.Item>
                <Card>
                  <label>
                    <b>{item.item_name}</b>
                  </label>
                  <br />
                  <br />
                  In Inventory:
                  <br />
                  <label>
                    {item.total_quantity} {item.unit}
                  </label>
                  <br />
                  <br />
                  <Button type="primary">OPEN Purchase</Button>
                </Card>
              </List.Item>
            )}
          /> */}
              </Col>
            </div>
          </div>
        </div>
      </ConfigProvider>
    </div>
  );
};

export default Purchases;
