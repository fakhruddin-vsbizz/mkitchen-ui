import React, { useEffect } from "react";
import { useState } from "react";
import { Row, Col, List, Card, Tag, Button, ConfigProvider } from "antd";
import Header from "../../components/navigation/Header";
import Sidebar from "../../components/navigation/SideNav";
import DeshboardBg from "../../res/img/DeshboardBg.png";
import { Link, useNavigate } from "react-router-dom";

const Vendors = () => {
  const [vendors, setVendors] = useState();

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
      navigate("/login");
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
      const data = await fetch("http://localhost:5001/vendor/totalpurchase");
      if (data) {
        const res = await data.json();
        setVendors(res);
      }
    };
    getVendors();
  }, []);

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
              comp=<center>
                <Link to="/pai/vendors/new">
                  <Button style={{ backgroundColor: "white", color: "orange" }}>
                    <i class="fa-solid fa-circle-plus"></i> &nbsp;&nbsp;&nbsp;
                    Add Vendor
                  </Button>
                </Link>
              </center>
            />
            <div style={{ width: "100%", padding: 0 }}>
              <div style={{ width: "95%", padding: "2%" }}>
                <label
                  style={{ fontSize: "200%" }}
                  className="dongle-font-class"
                >
                  All vendors
                </label>
                {vendors && (
                  <List
                    dataSource={vendors}
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
                              <label style={{ color: "#e08003" }}>
                                <b>{item.vendor_name}</b>
                              </label>
                            </Col>
                            <Col xs={8} xl={8}>
                              Purchase quantity:
                              <br />
                              <label style={{ fontSize: "130%" }}>
                                {item.totalPurchases}
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
