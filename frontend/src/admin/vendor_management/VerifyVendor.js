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
import { colorBackgroundColor, colorBlack, colorGreen, colorNavBackgroundColor, valueShadowBox } from "../../colors";
import { baseURL } from "../../constants";

const VerifyVendor = () => {
  const { Column, ColumnGroup } = Table;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newMohallaPopup, setNewMohallaPopup] = useState(false);
  const [update, setUpdate] = useState(false);
	const [filterByName, setFilterByName] = useState("");
  const [filteredVendors, setFilteredVendors] = useState([])
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
        setFilteredVendors(res);
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
      style={{ margin: 0, padding: 0 }}
    >
      <div style={{ display: "flex", backgroundColor: colorNavBackgroundColor }}>
        {localStorage.getItem("type") === "mk superadmin" ? <SideNav k="4" userType="superadmin" /> :
        <SideNav k="4" userType="admin" />}
        <div style={{ width: "100%", backgroundColor: colorBackgroundColor }}>
          <Header title="Verify Vendors" />
          <div style={{ padding: "0 2% 2%" }}>
            <Card style={{ width: "100%", backgroundColor: "transparent" }} bodyStyle={{padding: '0'}}>
              <ConfigProvider
                theme={{
                  token: {
                    colorPrimary: colorGreen,
                    colorDanger: "",
                  },
                }}
              >
                <Col xs={12} xl={12} style={{ padding: "0" }}>
                <table style={{ width: "100%" }} cellPadding={10}>
                  <tbody>
                  <tr>
                    <td style={{paddingLeft: "0", fontSize: '20px', fontWeight: '600'}}>
                      Vendor name:
                      <br />
                      <Input style={{marginTop: '5px', height: '45px', fontSize: '18px', border: `1px solid ${colorBlack}`, borderRadius: '5px'}} value={filterByName} onChange={e => setFilterByName(e.target.value)} placeholder="Filter by name"></Input>
                    </td>
                  </tr>
                  </tbody>
                    </table>
            </Col>
                {vendors && (
                  <List
                    dataSource={filteredVendors.filter(item => {
                      if (localStorage.getItem("type") === "mk admin") {
                        return item.approval_status === true
                      }else{
                        return true
                      }
                    })}
                    style={{height: "65vh",
                    overflowY: 'scroll'}}
                    renderItem={(item) => (
                      <List.Item
                        style={{
                          // width: "100%",
                          backgroundColor: "transparent",
                          padding: '0px',
                          margin: '8px 15px'
                        }}
                      >
                        <Row
                          style={{
                            padding: 10,
                            display: "flex",
                            backgroundColor: "#fff",
                            borderRadius: 10,
                            // border: "2px solid darkred",
                            boxShadow: valueShadowBox,
                            width: "100%",
                            marginBottom:'4px'
                          }}
                        >
                          <Col
                            xs={24}
                            xl={5}
                            style={{ fontSize: "150%", padding:'0 20px 5px', display: 'flex', alignItems: 'center' }}
                          >
                            <i class="fa-solid fa-store"></i>&nbsp;<span style={{textTransform: 'capitalize'}}>{item.vendor_name}</span>
                          </Col>
                          <Col xs={12} xl={3} style={{marginLeft: '17px' }}>
                            Shop opening time: <br />
                            <label style={{ fontSize:'120%' }}><i class="fa-solid fa-door-open"></i>&nbsp;{item.opening_time}</label>
                          </Col>
                          <Col xs={12} xl={3} >
                            Shop closing time: <br />
                            <label style={{ fontSize:'120%'}}><i class="fa-solid fa-door-closed"></i>&nbsp;{item.closing_time}</label>
                          </Col>
                          {/* <Col xs={6} xl={6}>
                        Created on: <br />
                        Rs. {Date(item.createdAt)}/-
                      </Col> */}
                          <Col xs={12} xl={6}>
                            Address: <br />
                            <label style={{ fontSize:'120%' }}><i class="fa-solid fa-location-dot"></i>&nbsp;{item.address}</label>
                          </Col>
                          <Col xs={12} xl={6}>
                            Approval Status: <br/>
                            {!item.approval_status ? 
                            <label style={{ fontSize:"120%", color: colorGreen }}><i class="fa-solid fa-spinner"></i>&nbsp;&nbsp;Pending&nbsp;&nbsp;|</label> : 
                            <label style={{ fontSize:"120%", color:'green' }}><i class="fa-solid fa-person-circle-check"></i>&nbsp;Verified</label>}
                            
                              
                            
                            &nbsp;&nbsp;&nbsp;
                            {!item.approval_status? (
                              <Button
                                onClick={(e) => markVendorVerified(item._id)}
                                style={{ backgroundColor:'lightgreen' }}
                              >
                                <i class="fa-solid fa-list-check"></i> &nbsp;&nbsp;Confirm and Verify
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
