import { Button, Card, Row, Col, Input, AutoComplete, List, Modal } from "antd";
import { useContext, useEffect, useState } from "react";
import React from "react";
import AuthContext from "../../components/context/auth-context";

const NewPurchase = () => {
  const [inventoryItems, setInventoryItems] = useState([]);
  const [inventoryItemId, setInventoryItemId] = useState();
  const [inventoryItemName, setInventoryItemName] = useState();
  const [price, setPrice] = useState();
  const [quantity, setQuantity] = useState();
  const [vendors, setVendors] = useState();
  const [selectedVendor, setSelectedVendor] = useState();
  const [visible, setVisible] = useState(false);

  const authCtx = useContext(AuthContext);
  const userId = authCtx.userId;
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
  };

  console.log(inventoryItems);
  console.log(selectedVendor);

  const [ingredientForPurchase, setIngredientForPurchase] = useState([]);

  const onAddIngredient = () => {
    var ingredient_added = {
      mkuser_id: userId,
      ingredient_name: inventoryItemName,
      vendor_id: selectedVendor,
      inventory_id: inventoryItemId,
      rate_per_unit: price,
      quantity_loaded: quantity,
    };
    setIngredientForPurchase([...ingredientForPurchase, ingredient_added]);
  };

  const handlePricePerIngridient = (value, ingredientName) => {
    const updatedIngredients = ingredientForPurchase.map((ingredient) => {
      if (ingredient.ingredient_name === ingredientName) {
        // if the ingredient name matches, update its perAshkash value
        return {
          ...ingredient,
          rate_per_unit: +value,
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
          setVisible(true);
          setIngredientForPurchase([]);
          setPrice("");
          setQuantity("");
          setSelectedVendor("");
          setInventoryItemName("");
          setInventoryItemId("");
        }
      }
    } catch (err) {}
  };

  return (
    <div>
      <Modal
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
          <p>Items Purchased Successfully</p>
        </div>
      </Modal>

      <Card style={{ padding: "1%", border: "1px solid grey" }} bordered={true}>
        <Row>
          <Col xs={12} xl={12} style={{ fontSize: "200%" }}>
            <i class="fa-solid fa-arrow-left"></i>&nbsp;&nbsp;&nbsp;New Purchase
          </Col>
          <Col xs={12} xl={12}>
            <center>
              <Button type="primary" danger>
                Cancel Purchase
              </Button>
            </center>
          </Col>
        </Row>
      </Card>
      <center>
      <div
        style={{ width: "80%", padding: "3%" }}
        className="dongle-font-class"
      >

          <table style={{ width: "100%" }} cellPadding={20}>
            <tr>
              <td style={{ fontSize: "150%" }}>
                Select the item:
              </td>
              <td>
                {inventoryItems && <center>
                  <AutoComplete
                    id="ingredient-item-selected"
                    style={{ width: "70%" }}
                    options={inventoryItems.map((item) => ({
                      value: item.ingridient_name,
                      id: item._id,
                    }))}
                    onSelect={handleSelect}
                    placeholder="Eg: Roti, Chawal, Daal, etc"
                    filterOption={(inputValue, option) =>
                      option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                    }
                  />
                </center>}
                
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

              <Card style={{ width: '100%', textAlign:'left' }}>
                <Row style={{ width: '100%', textAlign:'left' }}>
                  <Col xs={24} xl={24} style={{ fontSize: '150%' }}>{item.ingredient_name}</Col>
                  <Col xs={8} xl={8}>
                    Search vendor: 
                    <br/>
                    {vendors ? (
                      <AutoComplete
                        id="ingredient-item-selected"
                        style={{ width: "70%" }}
                        options={vendors.map((item) => ({
                          value: item.vendor_name,
                          id: item._id,
                        }))}
                        onSelect={(id, op) =>
                          handleVendorPerIngridient(op.id, item.ingredient_name)
                        }
                        placeholder="Eg: Roti, Chawal, Daal, etc"
                        filterOption={(inputValue, option) =>
                          option.value
                            .toUpperCase()
                            .indexOf(inputValue.toUpperCase()) !== -1
                        }
                      />
                    ) : <label>No vendors till now.</label>}
                    
                  </Col>
                  <Col xs={8} xl={8}>
                    Price per KG: <br/>Rs. 
                    <Input
                      onChange={(e) =>
                        handlePricePerIngridient(
                          e.target.value,
                          item.ingredient_name
                        )
                      }
                      placeholder="Eg: 2,3,15, etc"
                      style={{ width: '70%' }}
                    ></Input>-
                  </Col>
                  <Col xs={8} xl={8}>Quantity ordered: <br/>
                    <Input
                        onChange={(e) =>
                          handlequantityPerIngridient(
                            e.target.value,
                            item.ingredient_name
                          )
                        }
                        placeholder="Eg: 2,3,15, etc"
                        style={{ width: '70%' }}
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
                        placeholder="Eg: Roti, Chawal, Daal, etc"
                        filterOption={(inputValue, option) =>
                          option.value
                            .toUpperCase()
                            .indexOf(inputValue.toUpperCase()) !== -1
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
        
        <br/><br/>
        <Button onClick={addPurchaseData} type="primary" style={{ width: '60%', fontSize: '150%', height: '120%' }} className='dongle-font-class'>
          FINALIZE AND ENTER PURCHASE
        </Button>
      </div>
      </center>
    </div>
    
  );
};

export default NewPurchase;
