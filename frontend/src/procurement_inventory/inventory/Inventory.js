import React, { useContext, useEffect, useState } from "react";
import {
  Row,
  Col,
  List,
  Input,
  Typography,
  Slider,
  Button,
  Card,
  Modal,
  Radio,
  ConfigProvider,
  Alert,
} from "antd";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AuthContext from "../../components/context/auth-context";
import Header from "../../components/navigation/Header";
import Sidebar from "../../components/navigation/SideNav";
import DeshboardBg from "../../res/img/DeshboardBg.png";
import {
  colorBackgroundColor,
  colorBlack,
  colorGreen,
  colorNavBackgroundColor,
  valueShadowBox,
} from "../../colors";
import { baseURL } from "../../constants";
import AsyncModal from "../../components/AsyncModal";
import { toast } from "react-toastify";

const Inventory = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenUpdate, setIsModalOpenUpdate] = useState(false);

  const [name, setName] = useState("");
  const [unit, setUnit] = useState("");
  const [fetchedUnit, setFetchedUnitUnit] = useState("");
  const [expiry, setExpiry] = useState("");
  const [expiryType, setExpiryType] = useState("Days");
  const [price, setPrice] = useState(0);
  const [baseline, setbaseline] = useState("");
  const [inventoryId, setInventoryId] = useState("");

  const [inventoryItems, setInventoryItems] = useState([]);
  const [filteredInventoryItems, setFilteredInventoryItems] = useState([]);
  const [filterByName, setFilterByName] = useState("");
  const [filterByVolume, setFilterByVolume] = useState(0);

  const [confirmLoading, setConfirmLoading] = useState(false);

  const [updated, setUpdated] = useState(false);

  const [validationError, setValidationError] = useState(false);
  const authCtx = useContext(AuthContext);
  const email = authCtx.userEmail;

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
      navigate("/pai/inventory");
    }
  }, [navigate]);

  /**************Restricting PandI Route************************* */

  useEffect(() => {
    const getInventory = async () => {
      const data = await fetch("/api/inventory/addinventory");
      if (data) {
        const res = await data.json();
        setInventoryItems(res);
        setFilteredInventoryItems(res);
      }
    };
    getInventory();
  }, [updated]);

  useEffect(() => {
    const filterList = () => {
      if (filterByName && filterByVolume !== 0) {
        return inventoryItems.filter(
          (item) =>
            item.ingridient_name
              .toLowerCase()
              .includes(filterByName.toLowerCase()) &&
            item.total_volume <= filterByVolume
        );
      } else if (filterByName) {
        return inventoryItems.filter((item) =>
          item.ingridient_name
            .toLowerCase()
            .includes(filterByName.toLowerCase())
        );
      } else if (filterByVolume !== 0) {
        return inventoryItems.filter(
          (item) => item.total_volume <= filterByVolume
        );
      }
      return inventoryItems;
    };
    const filteredList = filterList();
    setFilteredInventoryItems(() =>
      filteredList.length !== 0 ? filteredList : []
    );
  }, [filterByName, filterByVolume, inventoryItems]);

  const handleSubmit = async () => {
    setConfirmLoading(true);
    try {
      const data = await fetch("/api/inventory/addinventory", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mkuser_email: email,
          ingridient_name: name
            .toLowerCase()
            .split(" ")
            .map(function (word) {
              return word[0].toUpperCase() + word.substring(1);
            })
            .join(" "),
          ingridient_measure_unit: unit,
          ingridient_expiry_period: expiryType,
          ingridient_expiry_amount: expiry,
          decommisioned: true,
          price: price,
          baseline: baseline,
          total_volume: 0,
          date: "4/21/2023",
          quantity_transected: 0,
          latest_rate: 0,
          rate_per_unit: 0,
        }),
      });

      if (data) {
        const res = await data.json();
        if (res.error) {
          setValidationError(true);
          setConfirmLoading(false);
        } else {
          setUpdated((prev) => !prev);
          setIsModalOpen(false);
          setName("");
          setExpiry("");
          setExpiryType("Days");
          setUnit("");
          setPrice(0);
          setbaseline("");
          setConfirmLoading(false);
          setValidationError(false);
          setValidationError(false);
        }
      }
    } catch (error) {
      console.log(error);
      setConfirmLoading(false);
    }
  };

  const onRestock = (id) => {
    navigate(`/pai/purchases/new/${id}`, {
      state: { prevPath: location.pathname },
    });
    // console.log(id);
  };

  const updateIngridientItem = async () => {
    setConfirmLoading(true);
    try {
      const data = await fetch("/api/inventory/addinventory/update_inventory", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inventory_id: inventoryId,
          ingridient_name: name
            .toLowerCase()
            .split(" ")
            .map(function (word) {
              return word[0].toUpperCase() + word.substring(1);
            })
            .join(" "),
          ingridient_measure_unit: unit === "" ? fetchedUnit : unit,
          ingridient_expiry_period: expiryType,
          ingridient_expiry_amount: expiry,
          price: price,
          baseline: baseline,
        }),
      });
      if (data) {
        const res = await data.json();
        if (res.error) {
          setValidationError(true);
        } else {
          setUpdated((prev) => !prev);
          setIsModalOpenUpdate(false);
          setName("");
          setExpiry("");
          setExpiryType("Days");
          setUnit("");
          setPrice(0);
          setbaseline("");
          setValidationError(false);
          setValidationError(false);
        }
        setConfirmLoading(false);
      }
    } catch (error) {
      console.log(error);
      setConfirmLoading(false);
    }
  };

  const updateIngridientHandler = async (id) => {
    setInventoryId(id);
    const data = inventoryItems.filter((item) => item._id === id);
    if (data.length !== 0) {
      setName(data[0].ingridient_name);
      setUnit(data[0].ingridient_measure_unit);
      setExpiry(data[0].ingridient_expiry_amount);
      setFetchedUnitUnit(data[0].ingridient_measure_unit);
      setExpiryType(data[0].ingridient_expiry_period);
      setPrice(data[0].price);
      setbaseline(data[0].baseline);
      setIsModalOpenUpdate(true);
    }
  };

  const deleteItem = async (itemId) => {
    setConfirmLoading(true);
    try {
      const data = await fetch(`/api/inventory/addinventory/${itemId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (data) {
        const res = await data.json();
        if (res?.error) {
          toast.error(res.error || "Error:", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: false,
            progress: undefined,
            theme: "light",
          });
        } else {
          setUpdated((prev) => !prev);
          setIsModalOpenUpdate(false);
          setValidationError(false);
        }
        setConfirmLoading(false);
      }
    } catch (error) {
      console.log(error);
      setConfirmLoading(false);
    }
  };

  const closeModelForUpdateIngridient = () => {
    setValidationError(false);

    setName("");
    setExpiry("");
    setUnit("");
    setExpiryType("Days");
    setPrice(0);
    setbaseline("");

    setIsModalOpenUpdate(false);
  };

  return (
    <div style={{ margin: 0, padding: 0 }}>
      {/* <Modal
        visible={visible}
        onOk={() => setVisible(false)}
        onCancel={() => setVisible(false)}
        footer={[
          <Button key="ok" type="primary" onClick={() => setVisible(false)}>
            OK
          </Button>,
        ]}
      >
        <div style={{ textAlign: "center" }}>
          <h2 style={{ color: "#52c41a" }}>Success!</h2>
          <p>Ingridient Added Successfully</p>
        </div>
      </Modal> */}
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: colorGreen,
          },
        }}>
        <div
          style={{ display: "flex", backgroundColor: colorNavBackgroundColor }}>
          {localStorage.getItem("type") === "mk superadmin" ? (
            <Sidebar k="9" userType="superadmin" />
          ) : (
            <Sidebar k="1" userType="pai" />
          )}

          <div style={{ width: "100%", backgroundColor: colorBackgroundColor }}>
            <Header title="Inventory" />
            <div style={{ padding: 0 }}>
              <Col xs={24} xl={20} style={{ width: "100%" }}>
                <table
                  style={{ width: "100%", marginLeft: 30 }}
                  cellPadding={10}>
                  <tbody>
                    <tr>
                      <td
                        style={{
                          paddingLeft: "0",
                          fontSize: "20px",
                          fontWeight: "600",
                        }}>
                        Filter by ingredients name:
                        <Input
                          style={{
                            marginTop: "5px",
                            height: "40px",
                            fontSize: "18px",
                            border: `1px solid ${colorBlack}`,
                            borderRadius: "5px",
                          }}
                          value={filterByName}
                          onChange={(e) => setFilterByName(e.target.value)}
                          placeholder="Filter by name"></Input>
                      </td>
                      <td
                        style={{
                          fontSize: "20px",
                          fontWeight: "600",
                          paddingLeft: "1rem",
                        }}>
                        Volume Range:{" "}
                        {filterByVolume !== 0 ? filterByVolume : null}
                        <Slider
                          value={filterByVolume}
                          style={{ fontSize: "18px" }}
                          onChange={(value) => setFilterByVolume(value)}
                          min={0}
                          max={1000}></Slider>
                      </td>
                      <td>
                        <center>
                          <Button
                            type="primary"
                            style={{ marginTop: "1rem" }}
                            onClick={(e) => setIsModalOpen(true)}>
                            <i className="fa-solid fa-circle-plus"></i>{" "}
                            &nbsp;&nbsp;&nbsp; Add new ingredient
                          </Button>
                        </center>

                        <AsyncModal
                          width="35%"
                          setOpen={setIsModalOpen}
                          confirmLoading={confirmLoading}
                          title="Add New Ingredient"
                          open={isModalOpen}
                          handleOk={handleSubmit}>
                          <Row>
                            <Typography.Title level={5}>Name</Typography.Title>
                            <Input
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              placeholder="Eg: Chicken Meat, Rice, etc"
                            />
                          </Row>
                          <Row>
                            <Typography.Title level={5}>
                              Measurement Unit
                            </Typography.Title>
                            <Input
                              value={unit}
                              onChange={(e) => setUnit(e.target.value)}
                              placeholder="Eg: kg, gram,.. etc"
                            />
                          </Row>
                          <Row>
                            <Typography.Title level={5}>
                              Min Stock
                            </Typography.Title>
                            <Input
                              type="number"
                              min={0}
                              value={baseline}
                              onChange={(e) => setbaseline(e.target.value)}
                              placeholder="Eg: 1, 2"
                            />
                          </Row>
                          <Row gutter={[16, 16]}>
                            <Col xl={12}>
                              <Typography.Title level={5}>
                                Expiry Period
                              </Typography.Title>
                              <Input
                                type="number"
                                min={0}
                                value={expiry}
                                onChange={(e) => setExpiry(e.target.value)}
                                placeholder="Eg: 12,24,36, etc"
                              />
                            </Col>
                            <Col xl={12} style={{ alignSelf: "self-end" }}>
                              <Radio.Group
                                onChange={(e) => setExpiryType(e.target.value)}>
                                <Radio value={"Days"}>Days</Radio>
                                <Radio value={"Months"}>Months</Radio>
                                <Radio value={"Year"}>Year</Radio>
                              </Radio.Group>
                            </Col>
                          </Row>
                          {validationError && (
                            <Alert
                              style={{ margin: "0.5rem" }}
                              message="Validation Error"
                              description="All Fields Must Be Filled"
                              type="error"
                              closable
                            />
                          )}
                        </AsyncModal>
                        <AsyncModal
                          width="35%"
                          setOpen={setIsModalOpenUpdate}
                          confirmLoading={confirmLoading}
                          title="Update Ingredient"
                          open={isModalOpenUpdate}
                          handleOk={updateIngridientItem}>
                          <Row>
                            <Typography.Title level={5}>Name</Typography.Title>
                            <Input
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              placeholder="Eg: Chicken Meat, Rice, etc"
                            />
                          </Row>
                          <Row>
                            <Typography.Title level={5}>
                              Measurement Unit
                            </Typography.Title>
                            <Input
                              value={unit}
                              onChange={(e) => setUnit(e.target.value)}
                              placeholder="Eg: kg, gram,.. etc"
                            />
                          </Row>
                          <Row>
                            <Typography.Title level={5}>
                              Min Stock
                            </Typography.Title>
                            <Input
                              type="number"
                              min={0}
                              value={baseline}
                              onChange={(e) => setbaseline(e.target.value)}
                              placeholder="Eg: 1, 2"
                            />
                          </Row>
                          <Row gutter={[16, 16]}>
                            <Col xl={12}>
                              <Typography.Title level={5}>
                                Expiry Period
                              </Typography.Title>
                              <Input
                                value={expiry}
                                onChange={(e) => setExpiry(e.target.value)}
                                placeholder="Eg: 12,24,36, etc"
                              />
                            </Col>
                            <Col xl={12} style={{ alignSelf: "self-end" }}>
                              <Radio.Group
                                value={expiryType}
                                onChange={(e) => setExpiryType(e.target.value)}>
                                <Radio value={"Days"}>Days</Radio>

                                <Radio value={"Months"}>Months</Radio>
                                <Radio value={"Year"}>Year</Radio>
                              </Radio.Group>
                            </Col>
                          </Row>
                        </AsyncModal>
                        {/* <Modal
                          open={isModalOpenUpdate}
                          onOk={updateIngridientItem}
                          onCancel={closeModelForUpdateIngridient}>
                          <label style={{ fontSize: "150%" }}>
                            Update Ingredient
                          </label>
                          <br />
                          <br />
                          <table style={{ width: "100%" }}>
                            <tbody>
                              <tr>
                                <td>Name</td>
                                <td>
                                  <label>{name}</label>
                                </td>
                              </tr>
                              <tr>
                                <td>Measurement Unit</td>
                                <td>
                                  {fetchedUnit === "" ? (
                                    <>
                                      <Input
                                        value={unit}
                                        onChange={(e) =>
                                          setUnit(e.target.value.toLowerCase())
                                        }
                                        placeholder="Eg: kg, gram,... etc"></Input>
                                    </>
                                  ) : (
                                    <span
                                      style={{ textTransform: "capitalize" }}>
                                      {fetchedUnit}
                                    </span>
                                  )}
                                </td>
                              </tr>
                              <tr>
                                <td>Avearage Price</td>
                                <td>
                                  <label>₹&nbsp;{price}</label>
                                </td>
                              </tr>
                              <tr>
                                <td>Min Stock</td>
                                <td>
                                  <Input
                                    value={baseline}
                                    onChange={(e) =>
                                      setbaseline(e.target.value)
                                    }
                                    placeholder="Eg: 1, 2"></Input>
                                </td>
                              </tr>
                              <tr>
                                <td>Expiry Period</td>
                                <td>
                                  <Input
                                    value={expiry}
                                    onChange={(e) => setExpiry(e.target.value)}
                                    placeholder="Eg: 12,24,36, etc"></Input>
                                  <Radio.Group
                                    value={expiryType}
                                    onChange={(e) =>
                                      setExpiryType(e.target.value)
                                    }>
                                    <Radio value={"Days"}>Days</Radio>

                                    <Radio value={"Months"}>Months</Radio>
                                    <Radio value={"Year"}>Year</Radio>
                                  </Radio.Group>
                                </td>
                              </tr>
                              {validationError && (
                                <tr>
                                  <td colSpan={2}>
                                    <br />
                                    <Alert
                                      style={{ margin: "0.5rem" }}
                                      message="Validation Error"
                                      description="All Fields Must Be Filled"
                                      type="error"
                                      closable
                                    />
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </Modal> */}
                      </td>
                    </tr>
                  </tbody>
                </table>
                {inventoryItems && (
                  <Card
                    style={{
                      height: "65vh",
                      width: "85vw",
                      overflowY: "scroll",
                      backgroundColor: "transparent",
                    }}
                    bodyStyle={{ padding: "5px 20px" }}>
                    <List
                      locale={{
                        emptyText: (
                          <center>
                            <div
                              style={{
                                marginTop: "8%",
                                marginBottom: "8%",
                                width: "30%",
                              }}>
                              <label
                                style={{ fontSize: "800%", color: colorGreen }}>
                                <i
                                  style={{ color: "gray" }}
                                  className="fa-solid fa-hourglass-start"></i>
                              </label>
                              <br />
                              <br />
                              <label
                                style={{
                                  fontSize: "120%",
                                  width: "50%",
                                  color: "gray",
                                }}>
                                Your inventory is empty.
                                <br />
                                Add some ingredients.
                              </label>
                            </div>
                          </center>
                        ),
                      }}
                      size="small"
                      dataSource={filteredInventoryItems}
                      renderItem={(item) => (
                        <List.Item
                          style={{
                            // margin: 5,
                            padding: "10px 20px",
                            display: "flex",
                            backgroundColor: "#fff",
                            borderRadius: 10,
                            // border: "2px solid darkred",
                            boxShadow: valueShadowBox,
                            margin: "8px",
                            width: "100%",
                          }}>
                          <Row
                            style={{
                              width: "100%",
                              justifyContent: "space-evenly",
                              display: "flex",
                              alignItems: "center",
                            }}>
                            <Col
                              xs={4}
                              xl={3}
                              style={{ fontSize: "150%", color: colorGreen }}>
                              {item.ingridient_name}
                            </Col>
                            <Col
                              xs={6}
                              xl={4}
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "flex-start",
                                rowGap: "5px",
                              }}>
                              <span>Ingredient Expiry period:</span>
                              <span>
                                {item.ingridient_expiry_amount}{" "}
                                {item.ingridient_expiry_period}
                              </span>
                            </Col>
                            <Col
                              xs={6}
                              xl={4}
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "flex-start",
                                rowGap: "5px",
                              }}>
                              <span>Ingredient total Volume:</span>
                              <span style={{ textTransform: "capitalize" }}>
                                {Number(item.total_volume.toFixed(3))}{" "}
                                {item.ingridient_measure_unit}
                              </span>
                            </Col>
                            <Col xs={3} xl={3}>
                              {item.total_volume <= item.baseline ? (
                                <div
                                  style={{
                                    color: colorGreen,
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "flex-start",
                                    rowGap: "5px",
                                  }}>
                                  <span>
                                    <i className="fa-solid fa-circle-exclamation"></i>{" "}
                                    You are short on items
                                  </span>
                                  <Button
                                    onClick={() => onRestock(item._id)}
                                    style={{
                                      backgroundColor: "green",
                                    }}
                                    type="primary">
                                    Restock Ingredient
                                  </Button>
                                </div>
                              ) : (
                                <span
                                  style={{
                                    fontSize: "1.2rem",
                                    color: "green",
                                  }}>
                                  <i
                                    className="fa-solid fa-circle-check"
                                    style={{ fontSize: "1.2rem" }}></i>{" "}
                                  Sufficient
                                </span>
                              )}
                            </Col>
                            <Col
                              xs={4}
                              xl={5}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "1rem",
                                justifyContent: "space-between",
                              }}>
                              <Link to={`/pai/inventory/purchases/${item._id}`}>
                                <Button
                                  type="primary"
                                  style={{
                                    fontSize: "110%",
                                  }}>
                                  View Purchases
                                </Button>
                              </Link>
                              <Button
                                onClick={(e) =>
                                  updateIngridientHandler(item._id)
                                }
                                type="primary"
                                style={{
                                  fontSize: "110%",
                                  backgroundColor: "#607d8b",
                                }}>
                                Update
                              </Button>
                              <Button
                                onClick={(e) => deleteItem(item._id)}
                                type="primary"
                                style={{
                                  fontSize: "110%",
                                  backgroundColor: "red",
                                }}>
                                Delete
                              </Button>
                            </Col>
                          </Row>
                          {/* <Card
                      style={{
                        backgroundColor:
                          item.total_quantity < 0 ? "lightpink" : "lightgreen",
                      }}
                    >
                      <label style={{ fontSize: "200%" }}>
                        {item.ingridient_name}
                      </label>
                      <br />
                      <br />
                      Expires in:
                      <br />
                      <label style={{ fontSize: "150%" }}>
                        <b>
                          {item.ingridient_expiry_amount}{" "}
                          {item.ingridient_expiry_period}
                        </b>
                      </label>
                    </Card> */}
                        </List.Item>
                      )}
                    />
                  </Card>
                )}
              </Col>
            </div>
          </div>
        </div>
      </ConfigProvider>
    </div>
  );
};

export default Inventory;
