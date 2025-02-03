import React, { useEffect } from "react";
import { useState } from "react";
import {
  Row,
  Col,
  List,
  Card,
  Tag,
  Button,
  ConfigProvider,
  Input,
  Select,
  Modal,
} from "antd";
import Header from "../../components/navigation/Header";
import Sidebar from "../../components/navigation/SideNav";
import DeshboardBg from "../../res/img/DeshboardBg.png";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  colorBackgroundColor,
  colorBlack,
  colorGreen,
  colorNavBackgroundColor,
  valueShadowBox,
} from "../../colors";
import { baseURL } from "../../constants";
import AsyncModal from "../../components/AsyncModal";

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

const Vendors = () => {
  const [vendors, setVendors] = useState([]);
  const [filteredVendors, setFilteredVendors] = useState([]);
  const [filterByName, setFilterByName] = useState("");
  const [ingredientsList, setIngredientsList] = useState([]);
  const [selectedIngredient, setSelectedIngredient] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updateOpen, setUpdateOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const [vendor_id, setVendor_id] = useState();
  const [vendorName, setVendorName] = useState();
  const [vendorEmail1, setVendorEmail1] = useState();
  const [vendorEmail2, setVendorEmail2] = useState();
  const [phone1, setPhone1] = useState("");
  const [phone2, setPhone2] = useState("");
  const [GSTIN, setGSTIN] = useState("");
  const [personOfContact, setPersonOfContact] = useState("");
  const [vendorAddress, setVendorAddress] = useState();

  const [isUpdated, setIsUpdated] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

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
      const vendors = await fetch("/api/vendor/");
      if (vendors) {
        const vendorJson = await vendors.json();
        setVendors(vendorJson);
        console.log(vendorJson);
        setFilteredVendors(vendorJson);
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
  }, [isUpdated]);

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
      setFilteredVendors(vendorJson);
    }
  };

  const openUpdateModal = (vendor) => {
    setUpdateOpen(true);
    setUpdateOpen(vendor);
    setVendor_id(vendor?._id);
    setVendorName(vendor?.vendor_name ? vendor?.vendor_name : "");
    setVendorEmail1(vendor?.email ? vendor?.email : "");
    setVendorEmail2(vendor?.email2 ? vendor?.email2 : "");
    setPhone1(vendor?.phone ? vendor?.phone : "");
    setPhone2(vendor?.phone2 ? vendor?.phone2 : "");
    setGSTIN(vendor?.gstin ? vendor?.gstin : "");
    setPersonOfContact(vendor?.contact_person ? vendor?.contact_person : "");
    setVendorAddress(vendor?.address ? vendor?.address : "");
  };

  const handleUpdate = async () => {
    setConfirmLoading(true);
    try {
      const data = await fetch("/api/vendor", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "update_details",
          vendor_id: vendor_id,
          vendor_name: vendorName,
          phone: vendorEmail1,
          phone2: vendorEmail2,
          email: phone1,
          email2: phone2,
          gstin: GSTIN,
          contact_person: personOfContact,
          address: vendorAddress,
        }),
      });
      if (data) {
        setUpdateOpen(false);
        setConfirmLoading(false);
        setIsUpdated((prev) => !prev);
      }
    } catch (e) {
      setUpdateOpen(false);
      setConfirmLoading(false);
      console.log(e);
    }
  };

  return (
    <div style={{ margin: 0, padding: 0 }}>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: colorGreen,
          },
        }}>
        <Modal open={isModalOpen} onOk={(e) => setIsModalOpen(false)}></Modal>
        <div
          style={{ display: "flex", backgroundColor: colorNavBackgroundColor }}>
          {localStorage.getItem("type") === "mk superadmin" ? (
            <Sidebar k="13" userType="superadmin" />
          ) : (
            <Sidebar k="5" userType="pai" />
          )}

          <div style={{ width: "100%", backgroundColor: colorBackgroundColor }}>
            <Header
              title="Vendor"
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
            <div style={{ width: "100%", padding: 0 }}>
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
              <div style={{ width: "95%", padding: "0 2% 2%" }}>
                <label
                  style={{ fontSize: "42px", marginLeft: "10px" }}
                  className="dongle-font-class">
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
                            <Col xs={4} xl={4}>
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
                              xl={4}
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
                            <Col xs={4} xl={3}>
                              Approval Status:
                              <br />
                              <Tag
                                color={
                                  item.approval_status === "verified"
                                    ? "green"
                                    : item.approval_status === "unverified"
                                    ? "red"
                                    : "blue"
                                }
                                style={{
                                  marginLeft: "15px",
                                  marginTop: "4px",
                                }}>
                                {item.approval_status === "verified"
                                  ? "Verified"
                                  : item.approval_status === "unverified"
                                  ? "Unverified"
                                  : "Pending"}
                              </Tag>
                            </Col>
                            <Col xs={4} xl={3}>
                              Actions:
                              <br />
                              <div style={{ display: "flex", gap: "1rem" }}>
                                <Button onClick={() => info(item)}>
                                  More Details
                                </Button>
                                <Button
                                  onClick={
                                    (e) => openUpdateModal(item)
                                    // updateIngridientHandler(item._id)
                                  }
                                  type="primary"
                                  style={{
                                    fontSize: "110%",
                                    backgroundColor: "#607d8b",
                                  }}>
                                  Update
                                </Button>
                              </div>
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
      <AsyncModal
        open={updateOpen}
        setOpen={setUpdateOpen}
        handleOk={handleUpdate}
        confirmLoading={confirmLoading}
        title="Update Vendor">
        <Card
          style={{ boxShadow: valueShadowBox }}
          className="dongle-font-class">
          <Row style={{ marginBlock: "1rem" }} gutter={[16, 16]}>
            <Col xl={12}>
              Vendor Name:<span style={{ color: "red" }}>*</span>{" "}
              <Input
                value={vendorName}
                onChange={(e) => setVendorName(e.target.value)}
                placeholder="Enter Name"
                required></Input>
            </Col>

            <Col xl={12}>
              Email 1: <br />
              <Input
                value={vendorEmail1}
                onChange={(e) => setVendorEmail1(e.target.value)}
                placeholder="Enter Email Here"></Input>
            </Col>
          </Row>

          <Row style={{ marginBlock: "1rem" }} gutter={[16, 16]}>
            <Col xl={12}>
              Email 2: <br />
              <Input
                value={vendorEmail2}
                onChange={(e) => setVendorEmail2(e.target.value)}
                placeholder="Enter Email Here"></Input>
            </Col>

            <Col xl={12}>
              Address:{" "}
              <Input
                value={vendorAddress}
                onChange={(e) => setVendorAddress(e.target.value)}
                placeholder="Enter Address Here"></Input>
            </Col>
          </Row>

          <Row style={{ marginBlock: "1rem" }} gutter={[16, 16]}>
            <Col xl={12}>
              Phone 1:<span style={{ color: "red" }}>*</span>
              <br />
              <Input
                value={phone1}
                onChange={(e) => setPhone1(e.target.value)}
                placeholder="Enter Phone Number Here"
                required></Input>
            </Col>

            <Col xl={12}>
              Phone 2:
              <br />
              <Input
                value={phone2}
                onChange={(e) => setPhone2(e.target.value)}
                placeholder="Enter Phone Number Here"
                required></Input>
            </Col>
          </Row>

          <Row style={{ marginBlock: "1rem" }} gutter={[16, 16]}>
            <Col xl={12}>
              Contact Person:{" "}
              <Input
                value={personOfContact}
                onChange={(e) => setPersonOfContact(e.target.value)}
                placeholder="Enter Person of Contact Here"></Input>
            </Col>

            <Col xl={12}>
              GSTIN:{" "}
              <Input
                value={GSTIN}
                onChange={(e) => setGSTIN(e.target.value)}
                placeholder="Enter GSTIN Here"></Input>
            </Col>
          </Row>
        </Card>
      </AsyncModal>
    </div>
  );
};

export default Vendors;
