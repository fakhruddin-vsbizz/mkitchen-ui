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
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  colorBackgroundColor,
  colorBlack,
  colorGreen,
  colorNavBackgroundColor,
  valueShadowBox,
} from "../../colors";
import { baseURL } from "../../constants";

const info = (vendor) => {
  Modal.info({
    title: "Vendor Details",
    content: (
      <div style={{ fontSize: "1.1rem" }}>
        <p>
          Name : <span>{vendor?.vendor_name}</span>
        </p>
        <p>
          Address : <span>{vendor?.address}</span>
        </p>
        <p>
          Email : <span>{vendor?.email}</span>
        </p>
        {vendor?.email2 && (
          <p>
            Email2 : <span>{vendor?.email2}</span>
          </p>
        )}
        <p>
          Phone : <span>{vendor?.phone}</span>
        </p>
        {vendor?.phone2 && (
          <p>
            Phone2 : <span>{vendor?.phone2}</span>
          </p>
        )}
        <p>
          GSTIN : <span>{vendor?.gstin}</span>
        </p>
        <p>
          POC :{" "}
          <span style={{ textTransform: "capitalize" }}>
            {vendor?.contact_person}
          </span>
        </p>
      </div>
    ),
    onOk() {},
  });
};

const VerifyVendor = () => {
  const { Column, ColumnGroup } = Table;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newMohallaPopup, setNewMohallaPopup] = useState(false);
  const [update, setUpdate] = useState(false);
  const [filterByName, setFilterByName] = useState("");
  const [filteredVendors, setFilteredVendors] = useState([]);
  const [ingredientsList, setIngredientsList] = useState([]);
  const [selectedIngredient, setSelectedIngredient] = useState("");
  const [vendors, setVendors] = useState();

  const navigate = useNavigate();
  const location = useLocation();

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

  // useEffect(() => {
  //   const getVendors = async () => {
  //     const data = await fetch("/api/vendor");
  //     if (data) {
  //       const res = await data.json();
  //       setVendors(res);
  //       setFilteredVendors(res);
  //     }
  //   };
  //   getVendors();
  // }, [update]);

  useEffect(() => {
    const getVendors = async () => {
      const vendors = await fetch("/api/vendor/");
      if (vendors) {
        const vendorJson = await vendors.json();
        setVendors([...vendorJson].reverse());
        console.log(vendorJson);
        setFilteredVendors([...vendorJson].reverse());
      }

      const ingredients = await fetch("/api/inventory/addinventory/");
      if (ingredients) {
        const ingredientJson = await ingredients.json();
        setIngredientsList([
          { ingridient_name: "", _id: "" },
          ...ingredientJson,
        ]);
        console.log(ingredientJson);
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
          approval_status: "verified",
        }),
      });
      if (data) {
        setUpdate((prev) => !prev);
      }
    } catch (e) {
      console.log(e);
    }
  };

  //not verification
  const markUnVendorVerified = async (id) => {
    try {
      const data = await fetch("/api/vendor", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "update_status",
          vendor_id: id,
          approval_status: "unverified",
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
        return vendors.filter((item) =>
          item.vendor_name.toLowerCase().includes(filterByName.toLowerCase())
        );
      }
      return vendors;
    };
    const filteredList = filterList();
    setFilteredVendors(filteredList);
  }, [filterByName, vendors]);

  const handleSelect = async (value, option) => {
    const vendors = await fetch("/api/vendor/" + option.id);
    if (vendors) {
      const vendorJson = await vendors.json();
      setVendors(vendorJson);
      console.log(vendorJson);
      setFilteredVendors([...vendorJson].reverse());
    }
  };

  return (
    <div style={{ margin: 0, padding: 0 }}>
      <div
        style={{ display: "flex", backgroundColor: colorNavBackgroundColor }}>
        {localStorage.getItem("type") === "mk superadmin" ? (
          <SideNav k="4" userType="superadmin" />
        ) : (
          <SideNav k="4" userType="admin" />
        )}

        <div style={{ width: "100%", backgroundColor: colorBackgroundColor }}>
          <Modal open={isModalOpen} onOk={(e) => setIsModalOpen(false)}></Modal>
          <Header
            title="Verify Vendors"
            comp={
              <center style={{ display: "flex", justifyContent: "flex-end" }}>
                <Link
                  to="/pai/vendors/new"
                  state={{ prevPath: location.pathname }}>
                  <Button
                    style={{ backgroundColor: "white", color: colorGreen }}>
                    <i className="fa-solid fa-circle-plus"></i>{" "}
                    &nbsp;&nbsp;&nbsp; Add Vendor
                  </Button>
                </Link>
              </center>
            }
          />
          <div style={{ padding: "0 2% 2%" }}>
            <Card
              style={{ width: "100%", backgroundColor: "transparent" }}
              bodyStyle={{ padding: "0" }}>
              <ConfigProvider
                theme={{
                  token: {
                    colorPrimary: colorGreen,
                    colorDanger: "",
                  },
                }}>
                <Col xs={12} xl={12} style={{ padding: "0 2% 0" }}>
                  <table style={{ width: "100%" }} cellPadding={10}>
                    <tbody>
                      <tr
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          columnGap: "1rem",
                        }}>
                        <td
                          style={{
                            fontWeight: "600",
                            display: "flex",
                            fontSize: "20px",
                            rowGap: "1rem",
                            flexDirection: "column",
                            flexGrow: 1,
                          }}>
                          <span>Vendor Name:</span>
                          <Input
                            style={{
                              border: `1px solid ${colorBlack}`,
                              borderRadius: "5px",
                            }}
                            value={filterByName}
                            onChange={(e) => setFilterByName(e.target.value)}
                            placeholder="Filter By Name"></Input>
                        </td>

                        <td
                          style={{
                            fontWeight: "600",
                            display: "flex",
                            fontSize: "20px",
                            rowGap: "1rem",
                            flexDirection: "column",
                            flexGrow: 1,
                          }}>
                          <span>Ingredient Name:</span>
                          <Select
                            showSearch
                            id="ingredient-item-selected"
                            style={{ width: "100%" }}
                            options={
                              ingredientsList.length !== 0 &&
                              ingredientsList.map((item) => ({
                                value: item.ingridient_name,
                                id: item._id,
                              }))
                            }
                            value={selectedIngredient}
                            onChange={(value) => setSelectedIngredient(value)}
                            onSelect={handleSelect}
                            placeholder="Eg: Roti, Chawal, Daal, etc"
                            filterOption={(inputValue, option) =>
                              option.value
                                .toUpperCase()
                                .indexOf(inputValue.toUpperCase()) !== -1
                            }
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </Col>
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
                      <List.Item style={{ padding: "4px 0" }}>
                        <Card
                          style={{
                            margin: "8px 10px",
                            width: "100%",
                            backgroundColor: "white",
                            borderRadius: 10,
                            // border: "2px solid darkred",
                            boxShadow: valueShadowBox,
                          }}
                          bodyStyle={{ padding: "10px", borderRadius: "0" }}>
                          <Row style={{ padding: "10px", borderRadius: "0" }}>
                            <Col xs={4} xl={3}>
                              <span>Vendor's Name:</span>
                              <br />
                              {/* #e08003 */}
                              <label
                                style={{
                                  color: colorGreen,
                                  fontSize: "130%",
                                  textTransform: "capitalize",
                                }}>
                                <b>{item.vendor_name}</b>
                              </label>
                            </Col>
                            {/* <Col xs={4} xl={4}>
                              Address:
                              <br />
                              <label style={{ fontSize: "130%" }}>
                                {item.address}
                              </label>
                            </Col> */}
                            <Col
                              xs={4}
                              xl={3}
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "flex-start",
                              }}>
                              Phone:
                              <br />
                              <div
                                style={{
                                  display: "flex",
                                  columnGap: ".5rem",
                                  alignItems: "flex-start",
                                  justifyContent: "center",
                                  flexDirection: "column",
                                }}>
                                <span style={{ fontSize: "1.1rem" }}>
                                  {item?.phone}
                                </span>
                                {item?.phone2 && (
                                  <>
                                    <span style={{ fontSize: "1.1rem" }}>
                                      {item?.phone2}
                                    </span>
                                  </>
                                )}
                              </div>
                            </Col>
                            <Col
                              xs={4}
                              xl={4}
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "flex-start",
                              }}>
                              Email:
                              <br />
                              <div
                                style={{
                                  display: "flex",
                                  columnGap: ".5rem",
                                  alignItems: "flex-start",
                                  justifyContent: "center",
                                  flexDirection: "column",
                                }}>
                                <span style={{ fontSize: "1.1rem" }}>
                                  {item?.email}
                                </span>
                                {item?.email2 && (
                                  <>
                                    <span style={{ fontSize: "1.1rem" }}>
                                      {item?.email2}
                                    </span>
                                  </>
                                )}
                              </div>
                            </Col>
                            <Col
                              xs={4}
                              xl={4}
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "flex-start",
                              }}>
                              <span>Contact Person:</span>
                              <label
                                style={{
                                  fontSize: "1.1rem",
                                  textTransform: "capitalize",
                                }}>
                                {item?.contact_person}
                              </label>
                            </Col>
                            <Col xs={12} xl={6}>
                              Approval Status: <br />
                              {item.approval_status === "unverified" ? (
                                <>
                                  <label
                                    style={{
                                      fontSize: "120%",
                                      color: "lightcoral",
                                    }}>
                                    <i class="fa-solid fa-xmark"></i>
                                    &nbsp;&nbsp;Unverified&nbsp;&nbsp;|
                                  </label>
                                  <Button
                                    onClick={(e) =>
                                      markVendorVerified(item._id)
                                    }
                                    style={{
                                      color: "black",
                                      backgroundColor: "deepskyblue",
                                      marginLeft: ".7rem",
                                    }}>
                                    <i class="fa-solid fa-exclamation"></i>{" "}
                                    &nbsp;&nbsp;Verify Again
                                  </Button>{" "}
                                </>
                              ) : item.approval_status === "verified" ? (
                                <>
                                  <label
                                    style={{
                                      fontSize: "120%",
                                      color: "green",
                                    }}>
                                    <i class="fa-solid fa-person-circle-check"></i>
                                    &nbsp;Verified&nbsp;&nbsp;|
                                  </label>
                                  <Button
                                    onClick={(e) =>
                                      markUnVendorVerified(item._id)
                                    }
                                    style={{
                                      color: "black",
                                      backgroundColor: "lightcoral",
                                      marginLeft: ".7rem",
                                    }}>
                                    <i class="fa-solid fa-xmark"></i>{" "}
                                    &nbsp;&nbsp;Mark As Unverified
                                  </Button>{" "}
                                </>
                              ) : (
                                <>
                                  <label
                                    style={{
                                      fontSize: "120%",
                                      color: colorGreen,
                                    }}>
                                    <i class="fa-solid fa-spinner"></i>
                                    &nbsp;&nbsp;Pending&nbsp;&nbsp;|
                                  </label>
                                  <Button
                                    onClick={(e) =>
                                      markVendorVerified(item._id)
                                    }
                                    style={{
                                      color: "black",
                                      backgroundColor: "lightgreen",
                                      marginLeft: ".7rem",
                                    }}>
                                    <i class="fa-solid fa-list-check"></i>{" "}
                                    &nbsp;&nbsp;Mark As Verified
                                  </Button>{" "}
                                </>
                              )}
                              {/* &nbsp;&nbsp;&nbsp;
                            {!item.approval_status? (
                              <Button
                                onClick={(e) => markVendorVerified(item._id)}
                                style={{ backgroundColor:'lightgreen' }}
                              >
                                <i class="fa-solid fa-list-check"></i> &nbsp;&nbsp;Confirm and Verify
                              </Button>
                            ) : null} */}
                            </Col>
                            <Col xs={4} xl={3}>
                              <Button onClick={() => info(item)}>
                                More Details
                              </Button>
                            </Col>
                          </Row>
                        </Card>
                      </List.Item>
                    )}
                  />
                )}
                {/* {vendors && (
                  <List
                    dataSource={filteredVendors}
                    // dataSource={filteredVendors.filter(item => {
                    //   if (localStorage.getItem("type") === "mk admin") {
                    //     return item.approval_status === true
                    //   }else{
                    //     return true
                    //   }
                    // })}
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
                          <Col xs={6} xl={6}>
                        Created on: <br />
                        Rs. {Date(item.createdAt)}/-
                      </Col> 
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
                )} */}
              </ConfigProvider>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyVendor;
