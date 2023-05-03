import React, { useEffect } from "react";
import { useState } from "react";
import { Row, Col, List, Card, Tag, Button } from "antd";

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
    <div>
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
              <label style={{ fontSize: "300%" }} className="dongle-font-class">
                Vendors
              </label>
            </Col>
            <Col xs={12} xl={12}>
              <center>
                <Button type="primary">New Vendor</Button>
              </center>
            </Col>
          </Row>

          <hr></hr>
          <br />
          <label style={{ fontSize: "200%" }} className="dongle-font-class">
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
                  <Card>
                    <label>
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
        </Col>
      </Row>
    </div>
  );
};

export default Vendors;
