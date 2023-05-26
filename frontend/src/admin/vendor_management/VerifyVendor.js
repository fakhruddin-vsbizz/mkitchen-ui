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
      const data = await fetch("/api/vendor");
      if (data) {
        const res = await data.json();
        setVendors(res);
      }
    };
    getVendors();
  }, [update]);

  const markVendorVerified = async (id) => {
    try {
      const data = await fetch("/api/vendor", {
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
                          padding: '0px'
                        }}
                      >
                        <Row
                          style={{
                            padding: 10,
                            display: "flex",
                            backgroundColor: "#fff",
                            borderRadius: 10,
                            border: "2px solid orange",
                            width: "100%",
                            marginBottom:'4px'
                          }}
                        >
                          <Col
                            xs={24}
                            xl={24}
                            style={{ fontSize: "150%", padding:'1%' }}
                          >
                            <i class="fa-solid fa-store"></i> &nbsp;&nbsp; {item.vendor_name}
                          </Col>
                          <Col xs={12} xl={6}>
                            Shop opening time: <br />
                            <label style={{ fontSize:'120%' }}><i class="fa-solid fa-door-open"></i> &nbsp;&nbsp;{item.opening_time}</label>
                          </Col>
                          <Col xs={12} xl={6}>
                            Shop closing time: <br />
                            <label style={{ fontSize:'120%' }}><i class="fa-solid fa-door-closed"></i> &nbsp;&nbsp;{item.closing_time}</label>
                          </Col>
                          {/* <Col xs={6} xl={6}>
                        Created on: <br />
                        Rs. {Date(item.createdAt)}/-
                      </Col> */}
                          <Col xs={12} xl={6}>
                            Address: <br />
                            <label style={{ fontSize:'120%' }}><i class="fa-solid fa-location-dot"></i>&nbsp;&nbsp;{item.address}</label>
                          </Col>
                          <Col xs={12} xl={6}>
                            Approval Status: <br/>
                            {!item.approval_status ? 
                            <label style={{ fontSize:"120%", color:'orange' }}><i class="fa-solid fa-spinner"></i>&nbsp;&nbsp;Pending&nbsp;&nbsp;&nbsp;|</label> : 
                            <label style={{ fontSize:"120%", color:'green' }}><i class="fa-solid fa-person-circle-check"></i>&nbsp;&nbsp;Verified</label>}
                            
                              
                            
                            &nbsp;&nbsp;&nbsp;
                            {!item.approval_status ? (
                              <Button
                                onClick={(e) => markVendorVerified(item._id)}
                                style={{ backgroundColor:'lightgreen' }}
                              >
                                <i class="fa-solid fa-list-check"></i> &nbsp;&nbsp; Confirm and Verify
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
