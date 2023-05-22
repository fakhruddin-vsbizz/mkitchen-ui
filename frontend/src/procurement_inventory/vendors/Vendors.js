import React, { useEffect } from "react";
import { useState } from "react";
import { Row, Col, List, Card, Tag, Button, ConfigProvider, Input } from "antd";
import Header from "../../components/navigation/Header";
import Sidebar from "../../components/navigation/SideNav";
import DeshboardBg from "../../res/img/DeshboardBg.png";
import { Link, useNavigate } from "react-router-dom";

const Vendors = () => {
  const [vendors, setVendors] = useState([]);
  const [filteredVendors, setFilteredVendors] = useState([])
	const [filterByName, setFilterByName] = useState("");


  const data = [
    "Inventory",
    "Purchases",
    "Current Menu",
    "Vendors",
    "Damaged Goods",
  ];

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


  console.log("vendors: ", vendors);
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
          <Sidebar k="4" userType="pai" />

          <div style={{ width: "100%" }}>
            <Header
              title="Vendor"
              comp={<center>
                <Link to="/pai/vendors/new">
                  <Button style={{ backgroundColor: "white", color: "orange" }}>
                    <i class="fa-solid fa-circle-plus"></i> &nbsp;&nbsp;&nbsp;
                    Add Vendor
                  </Button>
                </Link>
              </center>}
            />
            <div style={{ width: "100%", padding: 0 }}>

            <Col xs={12} xl={12} style={{ padding: "2%" }}>
                <table style={{ width: "100%" }} cellPadding={10}>
                  <tr>
                    <td>
                      Ingredient name:
                      <br />
                      <Input value={filterByName} onChange={e => setFilterByName(e.target.value)} placeholder="Filter by name"></Input>
                    </td>
                    </tr>
                    </table>
                    </Col>
              <div style={{ width: "95%", padding: "2%" }}>
                <label
                  style={{ fontSize: "200%" }}
                  className="dongle-font-class"
                >
                  All vendors
                </label>
                {vendors && (
                  <List
                    dataSource={filteredVendors}
                    renderItem={(item) => (
                      <List.Item>
                        <Card
                          style={{
                            margin: 5,
                            width: "100%",

                            backgroundColor: "white",
                            padding: "2%",
                            borderRadius: 10,
                            borderBottom: "2px solid orange",
                          }}
                        >
                          <Row>
                            <Col xs={8} xl={8}>
                              <span>Vendor's Name:</span>
                              
                              <br />
                              <label style={{ color: "#e08003" }}>
                                <b>{item.vendor_name}</b>
                              </label>
                            </Col>
                            <Col xs={8} xl={8}>
                              Vendor's Address:
                              <br />
                              <label style={{ fontSize: "130%" }}>
                                {item.address}
                              </label>
                            </Col>
                            <Col xs={8} xl={8}>
                              <label style={{ color: "#e08003" }}>
                                Approval Status: <br />
                                <Tag
                                  color={item.approval_status ? "green" : "red"}
                                >
                                  {item.approval_status
                                    ? "Approved"
                                    : "Pending"}
                                </Tag>
                              </label>
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
