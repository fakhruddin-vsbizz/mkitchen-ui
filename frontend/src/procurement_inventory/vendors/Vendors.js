import React, { useEffect } from "react";
import { useState } from "react";
import { Row, Col, List, Card, Tag, Button, ConfigProvider } from "antd";
import Header from "../../components/navigation/Header";
import Sidebar from "../../components/navigation/SideNav";
import DeshboardBg from "../../res/img/DeshboardBg.png";
import { Link } from "react-router-dom";

const Vendors = () => {
  const [vendors, setVendors] = useState();

  const data = [
    "Inventory",
    "Purchases",
    "Current Menu",
    "Vendors",
    "Damaged Goods",
  ];

  //getting all the vendors

  useEffect(() => {
    const getVendors = async () => {
      const data = await fetch("http://localhost:5001/vendor");
      if (data) {
        const res = await data.json();
        setVendors(res);
      }
    };
    getVendors();
  }, []);

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
              comp=<center><Link to="/pai/vendors/new">
              <Button style={{backgroundColor: 'white', color: 'orange'}}>
                <i class="fa-solid fa-circle-plus"></i> &nbsp;&nbsp;&nbsp; Add
                Vendor
              </Button>
            </Link></center>
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
                    grid={{
                      gutter: 16,
                      xs: 1,
                      sm: 2,
                      md: 4,
                      lg: 4,
                      xl: 4,
                      xxl: 3,
                    }}
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
                          <label style={{color: '#e08003'}} >
                            <b>{item.vendor_name}</b>
                          </label>
                          <br />
                          <br />
                          Purchase quantity:
                          <br />
                          <label style={{ fontSize: "130%" }}>
                            {item.active_purchases}
                          </label>
                          <br />
                          <br />
                          Approval Status: <br />
                          <Tag color={item.is_approved ? "green" : "red"}>
                            {item.is_approved ? "Approved" : "Pending"}
                          </Tag>
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
