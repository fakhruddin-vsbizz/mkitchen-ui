import React, { useEffect } from "react";
import { useState } from "react";
import { Row, Col, List, Card, Tag, Button, ConfigProvider, Input } from "antd";
import Header from "../../components/navigation/Header";
import Sidebar from "../../components/navigation/SideNav";
import DeshboardBg from "../../res/img/DeshboardBg.png";
import { Link, useNavigate } from "react-router-dom";
import { colorBackgroundColor, colorBlack, colorGreen, colorNavBackgroundColor } from "../../colors";
import { baseURL } from "../../constants";

const Vendors = () => {
  const [vendors, setVendors] = useState([]);
  const [filteredVendors, setFilteredVendors] = useState([])
	const [filterByName, setFilterByName] = useState("");

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
      navigate("/pai/vendors");
    }
  }, [navigate]);

  /**************Restricting PandI Route************************* */

  //getting all the vendors
  useEffect(() => {
    const getVendors = async () => {
      const data = await fetch("/api/vendor/totalpurchase");
      if (data) {
        const res = await data.json();
        setVendors(res);
        console.log(res);
        setFilteredVendors(res)
      }
    };
    getVendors();
  }, []);


  useEffect(() => {
		const filterList = () => {
      if (filterByName) {
				return vendors.filter(item =>
					item.vendor_name.toLowerCase().includes(filterByName.toLowerCase()))
			} 
			return vendors
		};
		const filteredList = filterList();
		setFilteredVendors(filteredList);
	}, [filterByName, vendors]);

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
          {localStorage.getItem("type") === "mk superadmin" ? <Sidebar k="13" userType="superadmin" /> :
          <Sidebar k="5" userType="pai" />}

          <div style={{ width: "100%", backgroundColor: colorBackgroundColor }}>
            <Header
              title="Vendor"
              comp={<center style={{display: 'flex', justifyContent: 'flex-end'}}>
                <Link to="/pai/vendors/new">
                  <Button style={{ backgroundColor: "white", color: colorGreen }}>
                    <i className="fa-solid fa-circle-plus"></i> &nbsp;&nbsp;&nbsp;
                    Add Vendor
                  </Button>
                </Link>
              </center>}
            />
            <div style={{ width: "100%", padding: 0 }}>

            <Col xs={12} xl={12} style={{ padding: "0 2% 0" }}>
                <table style={{ width: "100%" }} cellPadding={10}>
                  <tbody>
                  <tr>
                    <td style={{fontWeight: '600', fontSize: '20px'}}>
                      Vendor name:
                      <br />
                      <Input style={{marginTop: '12px', border: `1px solid ${colorBlack}`, borderRadius: '5px'}} value={filterByName} onChange={e => setFilterByName(e.target.value)} placeholder="Filter By Name"></Input>
                    </td>
                  </tr>
                  </tbody>
                    </table>
            </Col>
              <div style={{ width: "95%", padding: "0 2% 2%" }}>
                <label
                  style={{ fontSize: "42px", marginLeft: '10px' }}
                  className="dongle-font-class"
                >
                  All Vendors
                </label>
                {vendors && (
                  <List
                  style={{
                    height: "60vh",
                    width: "100%",
                    overflowY: "scroll",
                    backgroundColor: "transparent",
                  }}
                    dataSource={filteredVendors}
                    renderItem={(item) => (
                      <List.Item style={{padding: '4px 0'}}>
                        <Card
                          style={{
                            margin: "8px 10px",
                            width: "100%",
                            backgroundColor: "white",
                            borderRadius: 10,
                            // border: "2px solid darkred",
                            boxShadow: '1px 1px 4px 4px lightgray',
                          }}
                          bodyStyle={{padding: "10px", borderRadius: '0'}}
                        >
                          <Row style={{padding: "10px", borderRadius: '0'}}>
                            <Col xs={4} xl={4}>
                              <span>Vendor's Name:</span>
                              <br />
                              {/* #e08003 */}
                              <label style={{ color: colorGreen, fontSize: "130%", textTransform: 'capitalize' }}>
                                <b>{item.vendor_name}</b>
                              </label>
                            </Col>
                            <Col xs={4} xl={4}>
                              Address:
                              <br />
                              <label style={{ fontSize: "130%" }}>
                                {item.address}
                              </label>
                            </Col>
                            <Col xs={4} xl={4}>
                              Opening Time:
                              <br />
                              <label style={{ fontSize: "120%" }}>
                                {item.opening_time}
                              </label>
                            </Col>
                            <Col xs={4} xl={4}>
                              Closing Time:
                              <br />
                              <label style={{ fontSize: "120%" }}>
                                {item.closing_time}
                              </label>
                            </Col>
                            <Col xs={4} xl={4}>
                              Number Of Orders:
                              <br />
                              <label style={{ fontSize: "120%" }}>
                                {item.totalPurchases} Orders
                              </label>
                            </Col>
                            <Col xs={4} xl={4}>
                              
                                Approval Status:
                                
                                 <br />
                                <Tag
                                  color={item.approval_status ? "green" : "red"}
                                  style={{marginLeft: '15px', marginTop: '4px'}}
                                >
                                  {item.approval_status
                                    ? "Approved"
                                    : "Pending"}
                                </Tag>
                              
                            </Col>
                          </Row>
                        </Card>
                      </List.Item>
                    )}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </ConfigProvider>
    </div>
  );
};

export default Vendors;
