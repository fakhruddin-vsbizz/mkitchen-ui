import {
  Button,
  Card,
  Row,
  Col,
  Input,
  AutoComplete,
  List,
  Modal,
  ConfigProvider,
  Alert,
} from "antd";
import { useContext, useEffect, useState } from "react";
import React from "react";
import AuthContext from "../../components/context/auth-context";
import Header from "../../components/navigation/Header";
import Sidebar from "../../components/navigation/SideNav";
import DeshboardBg from "../../res/img/DeshboardBg.png";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";

const NewPurchase = () => {
  const [inventoryItems, setInventoryItems] = useState([]);
  const [inventoryItemId, setInventoryItemId] = useState();
  const [inventoryItemName, setInventoryItemName] = useState();
  const [price, setPrice] = useState();
  const [quantity, setQuantity] = useState();
  const [vendors, setVendors] = useState();
  const [selectedVendor, setSelectedVendor] = useState();
  const [ingredientForPurchase, setIngredientForPurchase] = useState([]);
  const [visible, setVisible] = useState(false);
  const [itemName, setItemName] = useState("")

  const [idFromPrams, setIdFromPrams] = useState();

  const [validationError, setValidationError] = useState(false);
  const [fieldsError, setFieldsError] = useState(false);
  const authCtx = useContext(AuthContext);
  const userId = authCtx.userId;
  //getting all the vendors

  const navigate = useNavigate();

  const {id} = useParams();

  /**************Restricting PandI Route************************* */

  useEffect(()=>{
    if (id) {
      setIdFromPrams(id)
    }
  },[])

  useEffect(() => {
    console.log("in");

    const type = localStorage.getItem("type");

    console.log("ttt=>", type);

    if (!type) {
      console.log("second in");
      navigate("/login");
    }

    const typeAdmin = type === "mk admin" ? true : false;

    if (typeAdmin) {
      console.log("second in");
      navigate("/admin/menu");
    }
    if (!typeAdmin && type && type === "Cooking") {
      navigate("/cooking/ingredients");
    }
    if (!typeAdmin && type && type === "Procurement Inventory") {
      navigate("/pai/purchases/new");
    }
  }, [navigate]);

  /**************Restricting PandI Route************************* */

  useEffect(() => {
    const getVendors = async () => {
      const data = await fetch("http://localhost:5001/vendor");
      if (data) {
        const res = await data.json();

        if (res) {
          let vendorVerified = res.filter(
            (item, index) => item.approval_status === true
          );
          setVendors(vendorVerified);
        }
      }
    };
    getVendors();
  }, []);

  useEffect(() => {
    const getInventory = async () => {
      try {
        console.log("inside");
        const data = await fetch("http://localhost:5001/cooking/ingredients", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type: "get_inventory_ingridients",
          }),
        });

        if (data) {
          const res = await data.json();
          if (res) {
            setInventoryItems(res);
          }
        }
      } catch (error) {
        console.log(error);
      }
    };
    getInventory();
  }, []);

  const handleSelect = (value, option) => {
    setInventoryItemId(option.id);
    setInventoryItemName(value);
    setItemName(value);
  };

  useEffect(()=>{
    if (inventoryItems.length !== 0 && idFromPrams !== undefined) {
      
    let currentDate = new Date();

      const data = inventoryItems.filter(
        (item) => item._id === idFromPrams
      );

      // setName(data[0]?.ingridient_name)

      console.log(data, "dtata");

      const time = +data[0].ingridient_expiry_amount;
      const period = data[0].ingridient_expiry_period;

      // Get the current date

      console.log(time, " ", period);

      // Add the specified time and period to the current date
      if (period === "Days") {
        currentDate.setDate(currentDate.getDate() + time);
      } else if (period === "Months") {
        currentDate.setMonth(currentDate.getMonth() + time);
      } else if (period === "Year") {
        currentDate.setFullYear(currentDate.getFullYear() + time);
      }
      let formattedDateData = currentDate.toDateString();

      var date = new Date(formattedDateData);

      var formattedDate = date.toLocaleDateString("en-US", {
        month: "numeric",
        day: "numeric",
        year: "2-digit",
      });

      // Output the final date
      console.log("Final Date:", formattedDate);

      const ingredient_added = {
        mkuser_id: userId,
        ingredient_name: data[0]?.ingridient_name,
        vendor_id: selectedVendor,
        inventory_id: idFromPrams,
        rate_per_unit: price,
        quantity_loaded: quantity,
        paid: false,
        total_amount: price * quantity,
        expiry_date: formattedDate,
        unshelf: false,
      };
      setIngredientForPurchase([...ingredientForPurchase, ingredient_added]);
    }
  },[idFromPrams,inventoryItems])

  console.log(inventoryItems);
  console.log(selectedVendor);


  const onAddIngredient = () => {
    if (inventoryItemName === undefined) {
      console.log("here ");
      setValidationError(true);
    } else {
      setValidationError(false);
      let currentDate = new Date();

      const data = inventoryItems.filter(
        (item) => item._id === inventoryItemId
      );

      const time = +data[0].ingridient_expiry_amount;
      const period = data[0].ingridient_expiry_period;

      // Get the current date

      console.log(time, " ", period);

      // Add the specified time and period to the current date
      if (period === "Days") {
        currentDate.setDate(currentDate.getDate() + time);
      } else if (period === "Months") {
        currentDate.setMonth(currentDate.getMonth() + time);
      } else if (period === "Year") {
        currentDate.setFullYear(currentDate.getFullYear() + time);
      }
      let formattedDateData = currentDate.toDateString();

      var date = new Date(formattedDateData);

      var formattedDate = date.toLocaleDateString("en-US", {
        month: "numeric",
        day: "numeric",
        year: "2-digit",
      });

      // Output the final date
      console.log("Final Date:", formattedDate);

      var ingredient_added = {
        mkuser_id: userId,
        ingredient_name: inventoryItemName,
        vendor_id: selectedVendor,
        inventory_id: inventoryItemId,
        rate_per_unit: price,
        quantity_loaded: quantity,
        paid: false,
        total_amount: price * quantity,
        expiry_date: formattedDate,
        unshelf: false,
      };
      setIngredientForPurchase([...ingredientForPurchase, ingredient_added]);
    setItemName("")

    }
  };

  const handlePricePerIngridient = (value, ingredientName) => {
    const updatedIngredients = ingredientForPurchase.map((ingredient) => {
      if (ingredient.ingredient_name === ingredientName) {
        // if the ingredient name matches, update its perAshkash value
        return {
          ...ingredient,
          rate_per_unit: +value,
          total_amount: +value * ingredient.quantity_loaded,
        };
      }
      return ingredient; // return the unchanged ingredient object
    });
    setIngredientForPurchase(updatedIngredients);
  };

  const handlequantityPerIngridient = (value, ingredientName) => {
    const updatedIngredients = ingredientForPurchase.map((ingredient) => {
      if (ingredient.ingredient_name === ingredientName) {
        // if the ingredient name matches, update its perAshkash value
        return {
          ...ingredient,
          quantity_loaded: +value,
          total_amount: ingredient.rate_per_unit * +value,
        };
      }
      return ingredient; // return the unchanged ingredient object
    });
    setIngredientForPurchase(updatedIngredients);
  };

  const handleVendorPerIngridient = (value, ingredientName) => {
    console.log(value);
    const updatedIngredients = ingredientForPurchase.map((ingredient) => {
      if (ingredient.ingredient_name === ingredientName) {
        // if the ingredient name matches, update its perAshkash value
        return {
          ...ingredient,
          vendor_id: value,
        };
      }
      return ingredient; // return the unchanged ingredient object
    });
    setIngredientForPurchase(updatedIngredients);
  };

  console.log("purchase: ", ingredientForPurchase);

  const addPurchaseData = async () => {
    try {
      const data = await fetch("http://localhost:5001/purchase", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          documents: ingredientForPurchase,
        }),
      });

      if (data) {
        const res = await data.json();
        if (res) {
          console.log(res);
          if (res.error) {
            setValidationError(true);
            setFieldsError(false);
          } else if (res.fieldError) {
            setFieldsError(true);
            setValidationError(false);
          } else {
            setVisible(true);
            setIngredientForPurchase([]);
            setPrice("");
            setQuantity("");
            setSelectedVendor("");
            setInventoryItemName("");
            setInventoryItemId("");
            setValidationError(false);
            setFieldsError(false);
          }
        }
      }
    } catch (err) {}
  };

  return (
    <div
      style={{
        margin: 0,
        padding: 0,
        backgroundImage: `url(${DeshboardBg})`,
        height: "100%  ",
        overflowY: "hidden",
      }}
    >
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "orange",
          },
        }}
      >
        <div style={{ display: "flex" }}>
          <Sidebar k="2" userType="pai" />

          <div style={{ width: "100%" }}>
            <Header title={<p>
                <Link
                  to="/pai/vendors"
                  style={{ color: "white", textDecoration: "none" }}
                >
                  <ArrowLeftOutlined />
                </Link>{" "}
                Purchases
              </p>} />
            <div style={{ padding: 0 }}>
              <center>
                <div
                  style={{ width: "90%", padding: "3%" }}
                  className="dongle-font-class"
                >
                  <table style={{ width: "100%" }} cellPadding={20}>
                    <tr>
                      <td style={{ fontSize: "150%" }}>Select the item:</td>
                      <td>
                        {inventoryItems && (
                          <center>
                            <AutoComplete
                              id="ingredient-item-selected"
                              style={{ width: "70%" }}
                              value={itemName}
                              options={inventoryItems.map((item) => ({
                                value: item.ingridient_name,
                                id: item._id,
                              }))}
                              onSelect={handleSelect}
                              onChange={(value) => setItemName(value)}
                              placeholder="Eg: Roti, Chawal, Daal, etc"
                              filterOption={(inputValue, option) =>
                                option.value
                                  .toUpperCase()
                                  .indexOf(inputValue.toUpperCase()) !== -1
                              }
                            />
                          </center>
                        )}
                      </td>
                      <td>
                        <center>
                          <Button type="primary" onClick={onAddIngredient}>
                            {" "}
                            Add to Cart
                          </Button>
                        </center>
                      </td>
                    </tr>
                    {validationError && (
                      <tr>
                        <td colSpan={2}>
                          <br />
                          <Alert
                            message="Validation Error"
                            description="Please select the ingridients and add values !!"
                            type="error"
                            closable
                          />
                        </td>
                      </tr>
                    )}
                    {fieldsError && (
                      <tr>
                        <td colSpan={2}>
                          <br />
                          <Alert
                            message="Validation Error"
                            description="Please fill all the fields !!"
                            type="error"
                            closable
                          />
                        </td>
                      </tr>
                    )}
                  </table>

                  {/* <label style={{ fontSize: "150%" }}>Select the item</label> */}
                  {/* &nbsp;&nbsp;&nbsp;
        {inventoryItems && (
          <Col xs={18} xl={18}>
            <AutoComplete
              id="ingredient-item-selected"
              style={{ width: "100%" }}
              options={inventoryItems.map((item) => ({
                value: item.ingridient_name,
                id: item._id,
              }))}
              onSelect={handleSelect}
              placeholder="Eg: Roti, Chawal, Daal, etc"
              filterOption={(inputValue, option) =>
                option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !==
                -1
              }
            />
          </Col>
        )}
        &nbsp;&nbsp;&nbsp;
        <Button type="primary" onClick={() => onAddIngredient()}>
          {" "}
          Add to Cart
        </Button> */}
                  <hr></hr>
                  <List
                    size="small"
                    bordered
                    dataSource={ingredientForPurchase}
                    renderItem={(item) => (
                      <List.Item>
                        <Card style={{ width: "100%", textAlign: "left" }}>
                          <Row style={{ width: "100%", textAlign: "left" }}>
                            <Col xs={24} xl={24} style={{ fontSize: "150%" }}>
                              {item.ingredient_name}
                            </Col>
                            <Col xs={8} xl={8}>
                              Search vendor:
                              <br />
                              {vendors ? (
                                <AutoComplete
                                  id="ingredient-item-selected"
                                  style={{ width: "70%" }}
                                  options={vendors.map((item) => ({
                                    value: item.vendor_name,
                                    id: item._id,
                                  }))}
                                  onSelect={(id, op) =>
                                    handleVendorPerIngridient(
                                      op.id,
                                      item.ingredient_name
                                    )
                                  }
                                  placeholder="Eg: Roti, Chawal, Daal, etc"
                                  filterOption={(inputValue, option) =>
                                    option.value
                                      .toUpperCase()
                                      .indexOf(inputValue.toUpperCase()) !== -1
                                  }
                                />
                              ) : (
                                <label>No vendors till now.</label>
                              )}
                            </Col>
                            <Col xs={8} xl={8}>
                              Price per{" "}
                              {inventoryItems &&
                                inventoryItems
                                  .filter(
                                    (itemNew) =>
                                      itemNew._id === item.inventory_id
                                  )
                                  .map((ele) => ele.ingridient_measure_unit)}
                              <br />
                              Rs.
                              <Input
                                onChange={(e) =>
                                  handlePricePerIngridient(
                                    e.target.value,
                                    item.ingredient_name
                                  )
                                }
                                placeholder="Eg: 2,3,15, etc"
                                style={{ width: "70%" }}
                              ></Input>
                              -
                            </Col>
                            <Col xs={8} xl={8}>
                              Quantity ordered: <br />
                              <Input
                                onChange={(e) =>
                                  handlequantityPerIngridient(
                                    e.target.value,
                                    item.ingredient_name
                                  )
                                }
                                placeholder="Eg: 2,3,15, etc"
                                style={{ width: "70%" }}
                              ></Input>
                            </Col>
                          </Row>
                        </Card>

                        {/* <Card>
                <label style={{ fontSize: "160%" }}>
                  {item.ingredient_name}
                </label>
                <br />
                <Row>
                  <Col xs={12} xl={12}>
                    Search vendor:{" "}
                    {vendors && (
                      <AutoComplete
                        id="ingredient-item-selected"
                        style={{ width: "100%" }}
                        options={vendors.map((item) => ({
                          value: item.vendor_name,
                          id: item._id,
                        }))}
                        onSelect={(id, op) =>
                          handleVendorPerIngridient(op.id, item.ingredient_name)
                        }
                        placeholder="Eg: 2,3,15, etc"
                      ></Input>
                    </Col>
                    <Col xs={12} xl={12}>
                      <br />
                      Quantity ordered:{" "}
                      <Input
                        onChange={(e) =>
                          handlequantityPerIngridient(
                            e.target.value,
                            item.ingredient_name
                          )
                        }
                      />
                    )}
                  </Col>
                  <Col xs={12} xl={12}>
                    Price per KG:{" "}
                    <Input
                      onChange={(e) =>
                        handlePricePerIngridient(
                          e.target.value,
                          item.ingredient_name
                        )
                      }
                      placeholder="Eg: 2,3,15, etc"
                    ></Input>
                  </Col>
                  <Col xs={12} xl={12}>
                    <br />
                    Quantity ordered:{" "}
                    <Input
                      onChange={(e) =>
                        handlequantityPerIngridient(
                          e.target.value,
                          item.ingredient_name
                        )
                      }
                      placeholder="Eg: 2,3,15, etc"
                    ></Input>
                  </Col>
                </Row>

                </Card> */}
                      </List.Item>
                    )}
                  />

                  <br />
                  <br />
                  <Button
                    onClick={addPurchaseData}
                    type="primary"
                    style={{ width: "60%", fontSize: "150%", height: "120%" }}
                    className="dongle-font-class"
                  >
                    FINALIZE AND ENTER PURCHASE
                  </Button>
                </div>
              </center>
            </div>
          </div>
        </div>
      </ConfigProvider>
    </div>
  );
};

export default NewPurchase;
