import React, { useEffect } from "react";
import {
  Row,
  Col,
  List,
  Tag,
  Divider,
  Calendar,
  Card,
  Button,
  AutoComplete,
  Modal,
  Tooltip,
  Input,
  Select,
  Space,
  Table,
  ConfigProvider,
} from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import DeshboardBg from "../../res/img/DeshboardBg.png";
import SideNav from "../../components/navigation/SideNav";
import Header from "../../components/navigation/Header";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const VerifyVendor = () => {
  const { Column, ColumnGroup } = Table;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newMohallaPopup, setNewMohallaPopup] = useState(false);
  const [update, setUpdate] = useState(false);

  const [vendors, setVendors] = useState();

  const navigate = useNavigate();

  /**************Restricting Admin Route************************* */

  useEffect(() => {
    const type = localStorage.getItem("type");

    if (!type) {
      navigate("/");
    }

    const typeAdmin = type === "mk admin" ? true : false;

    if (typeAdmin) {
      navigate("/admin/verifyvendor");
    }
    if (!typeAdmin && type && type === "Cooking") {
      navigate("/cooking/ingredients");
    }
    if (!typeAdmin && type && type === "Procurement Inventory") {
      navigate("/pai/inventory");
    }
  }, [navigate]);

  /**************Restricting Admin Route************************* */

  useEffect(() => {
    const getVendors = async () => {
      const data = await fetch("/vendor");
      if (data) {
        const res = await data.json();
        setVendors(res);
      }
    };
    getVendors();
  }, [update]);

  const markVendorVerified = async (id) => {
    try {
      const data = await fetch("/vendor", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "update_status",
          vendor_id: id,
          approval_status: 1,
        }),
      });
      if (data) {
        setUpdate((prev) => !prev);
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div
      style={{ margin: 0, padding: 0, backgroundImage: `url(${DeshboardBg})` }}
    >
      <div style={{ display: "flex" }}>
        <SideNav k="4" userType="admin" />
        <div style={{ width: "100%" }}>
          <Header title="Verify Vendors" />
          <div style={{ padding: "2%" }}>
            <Card style={{ width: "100%", backgroundColor: "transparent" }}>
              <ConfigProvider
                theme={{
                  token: {
                    colorPrimary: "orange",
                    colorDanger: "",
                  },
                }}
              >
                {vendors && (
                  <List
                    dataSource={vendors}
                    renderItem={(item) => (
                      <List.Item
                        style={{
                          width: "100%",
                          backgroundColor: "transparent",
                        }}
                      >
                        <Row
                          style={{
                            padding: 10,
                            display: "flex",
                            backgroundColor: "#fff",
                            borderRadius: 10,
                            borderBottom: "2px solid orange",
                            width: "100%",
                          }}
                        >
                          <Col
                            xs={6}
                            xl={6}
                            style={{ fontSize: "150%", color: "#E08003" }}
                          >
                            {item.vendor_name}
                          </Col>
                          <Col xs={6} xl={6}>
                            Shop timings: <br />
                            {item.opening_time} to {item.closing_time}
                          </Col>
                          {/* <Col xs={6} xl={6}>
                        Created on: <br />
                        Rs. {Date(item.createdAt)}/-
                      </Col> */}
                          <Col xs={6} xl={6}>
                            Address: <br />
                            {item.address}
                          </Col>
                          <Col xs={6} xl={6}>
                            <Tag
                              color={item.approval_status ? "green" : "orange"}
                            >
                              {!item.approval_status ? "PENDING" : "VERIFIED"}
                            </Tag>
                            &nbsp;&nbsp;&nbsp;
                            {!item.approval_status ? (
                              <Button
                                onClick={(e) => markVendorVerified(item._id)}
                              >
                                MARK VERIFIED
                              </Button>
                            ) : null}
                          </Col>
                        </Row>
                      </List.Item>
                    )}
                  />
                )}
              </ConfigProvider>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyVendor;
