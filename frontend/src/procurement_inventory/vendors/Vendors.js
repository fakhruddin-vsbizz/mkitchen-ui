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
  }, []);

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
              </div>
            </div>
          </div>
        </div>
      </ConfigProvider>
    </div>
  );
};

export default Vendors;
