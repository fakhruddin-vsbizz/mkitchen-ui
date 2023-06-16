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
import {
  DeleteOutlined,
  InfoCircleOutlined,
  PlusCircleFilled,
  PlusCircleOutlined,
} from "@ant-design/icons";
import DeshboardBg from "../../res/img/DeshboardBg.png";
import SideNav from "../../components/navigation/SideNav";
import Header from "../../components/navigation/Header";
import { useState } from "react";
import { colorBackgroundColor, colorBlack, colorGreen, colorNavBackgroundColor, valueShadowBox } from "../../colors";
import { baseURL } from "../../constants";
// import { Link, useNavigate } from "react-router-dom";

const VerifyVendor = () => {
  // const { Column, ColumnGroup } = Table;
  // const [newMohallaPopup, setNewMohallaPopup] = useState(false);
  // const [update, setUpdate] = useState(false);
  // const [filterByName, setFilterByName] = useState("");
  // const [filteredVendors, setFilteredVendors] = useState([]);
  // const [vendors, setVendors] = useState();
  // const [donationsList, setDonationsList] = useState([]);
  // const [inventoryItems, setInventoryItems] = useState([]);
  // const [ingredientName, setIngredientName] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [donationIngredient, setDonationIngredient] = useState("");
  const [quantityValue, setQuantityValue] = useState("");
  const [finalArrayForData, setFinalArrayForData] = useState([]);
  const [inventoryItemId, setInventoryItemId] = useState([]);
  const [measureUnit, setMeasureUnit] = useState("");
  const [itsValue, setItsValue] = useState("");
  const [donarName, setDonarName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [donations, setDonations] = useState([]);


  const handleSelect = (value, option) => {
    setInventoryItemId(option.id);
    setDonationIngredient(value);
    setMeasureUnit(option.unit);
  };
  
  const onSubmit = () => {
    const bodyData = {
      ingredientId: inventoryItemId,
      ingredientName: donationIngredient,
      donarName,
      contactNumber,
      donationQty: +quantityValue,
      ingridient_measure_unit: measureUnit,
      its_id: +itsValue,
    }

    fetch(baseURL+"/api/donation", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(bodyData),
        }).then(res => res.json()).then((data) => {
          setDonations(prev => [...prev, data])
        }).catch(err => console.log(err)).finally(() => handleOk())

  }



  // const addDonation = () => {
  //   setDonationsList(prev => [...prev, {inventoryItemId, donationIngredient, quantityValue}]);
  //   setDonationIngredient("")
  //   setQuantityValue(0)
  // }

  // const deleteDonation = (ingredient) => {
  //   setDonationsList(donationsList.filter(item => item?.donationIngredient.toLowerCase() !== ingredient.toLowerCase()));
  // }

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  useEffect(()=>{

    fetch(baseURL+"/api/donation/all", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).then(res => res.json()).then((data) => setDonations(data)).catch(err => console.log(err))

  },[])

  // useEffect(() => {
  //   const finalArray = [];

  //   for (const inventoryItem of inventoryItems) {
  //     const found = ingredientItems.some(
  //       (ingredientItem) =>
  //         ingredientItem.inventory_item_id === inventoryItem._id
  //     );
  //     if (!found) {
  //       finalArray.push(inventoryItem);
  //     }
  //   }

  //   setFinalArrayForData(finalArray);
  //   // setFilteredAutoCompleted(finalArray.map((item) => ({
  //   //   value: item.ingridient_name,
  //   //   id: item._id,
  //   // })))
  //   console.log("finalArray", finalArray);
  // }, [inventoryItems]);

  
  useEffect(() => {
    const getInventory = async () => {
      try {
        const data = await fetch(baseURL+"/api/cooking/ingredients", {
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
            setFinalArrayForData(res);
          }
        }
      } catch (error) {
        console.log(error);
      }
    };
    getInventory();
  }, []);

  /**************Restricting Admin Route************************* */

  /**************Restricting Admin Route************************* */

  return (
    <div
      style={{ margin: 0, padding: 0}}
    >
      <div style={{ display: "flex", backgroundColor: colorNavBackgroundColor }}>
        {localStorage.getItem("type") === "mk superadmin" ? <SideNav k="15" userType="superadmin" /> :
        <SideNav k="7" userType="pai" />}

        <div style={{ width: "100%", backgroundColor: colorBackgroundColor }}>
          <Header
            title="Donations"
            comp={
              <center style={{display: 'flex', justifyContent: 'flex-end'}}>
                <Button
                  style={{ backgroundColor: "white", color: colorGreen }}
                  onClick={showModal}
                >
                  <i className="fa-solid fa-circle-plus"></i> &nbsp;&nbsp;&nbsp;
                  New Donation
                </Button>
              </center>
            }
          />

          <div style={{ padding: "0 2% 2%" }}>
            <Card
              style={{ width: "100%", backgroundColor: "transparent" }}
              bodyStyle={{ padding: "0" }}
            >
              <ConfigProvider
                theme={{
                  token: {
                    colorPrimary: colorGreen,
                    colorLink: colorGreen,
                  },
                }}
              >
                <Modal
                  title={<span style={{ fontSize: 18, fontWeight: "bold" }}>
                    New Donation Entry
                  </span>}
                  open={isModalOpen}
                  onOk={handleOk}
                  onCancel={handleCancel}
                  footer={null}
                  width={"70%"}
                >
                  <hr />
                  <Row style={{ margin: "20px 0px" }}>
                    <Col xs={24} xl={12}>
                      <div
                        style={{
                          padding: "10px",
                          fontWeight: "bold",
                          fontSize: 16,
                        }}
                      >
                        Name<br />
                        <Input
                          style={{ marginTop: "10px", padding: "10px 5px" }}
                          placeholder="Basic usage"
                          value={donarName}
                          onChange={(e)=> setDonarName(e.target.value)}
                        />
                      </div>
                    </Col>
                    <Col xs={24} xl={12}>
                      <div
                        style={{
                          padding: "10px",
                          fontWeight: "bold",
                          fontSize: 16,
                        }}
                      >
                        Contact Number<br />
                        <Input
                          style={{ marginTop: "10px", padding: "10px 5px" }}
                          placeholder="Basic usage"
                          value={contactNumber}
                          onChange={(e)=> setContactNumber(e.target.value)}
                        />
                      </div>
                    </Col>
                    <Col xs={24} xl={12}>
                      {" "}
                      <div
                        style={{
                          padding: "10px",
                          fontWeight: "bold",
                          fontSize: 16,
                        }}
                      >
                        ITS ID<br />
                        <Input
                          style={{ marginTop: "10px", padding: "10px 5px" }}
                          placeholder="Basic usage"
                          value={itsValue}
                          onChange={(e)=> setItsValue(e.target.value)}
                        />
                      </div>
                    </Col>
                  </Row>
                  <Row style={{ margin: "20px 0px" }}>
                    <Col xs={24} xl={12}>
                      <div style={{ padding: "10px" }}>
                        <span style={{ fontSize: 18, fontWeight: "bold" }}>
                          Donations
                        </span>
                      </div>
                    </Col>
                    {/* <Col xs={24} xl={12}>
                      {" "}
                      <div
                        style={{
                          padding: "10px",
                          display: "flex",
                          flexDirection: "row-reverse",
                        }}
                      >
                        <Button
                          type="primary"
                          icon={<PlusCircleOutlined />}
                          onClick={addDonation}
                          size="default"
                        >
                          New donation entry
                        </Button>
                      </div>
                    </Col> */}
                  </Row>
                
                    <div style={{
                      width: "100%",
                      backgroundColor: "transparent",
                      padding: "0px",
                    }}>
                    <Row style={{width: "100%"}}>
                          <Col xs={24} xl={11}>
                            <Row >
                              <Col xs={24} xl={6} style={{
                                    paddingLeft: "10px",
                                    fontWeight: "bold",
                                    fontSize: 16,
                                    
                                  }}>
                                    <span style={{width: '6rem', display: 'block'}}>
                                  Ingredient
                                    </span>
                              </Col>
                              <Col xs={24} xl={18} style={{ paddingRight: "10px" }}>
                               
                                  {/* <Input placeholder="Basic usage" value={donationIngredient} onChange={(e)=> setDonationIngredient(e.target.value)} /> */}
                                  <AutoComplete
                              id="ingredient-item-selected"
                              style={{ width: "100%" }}
                              options={finalArrayForData.map((item) => ({
                                  value: item.ingridient_name,
                                  id: item._id,
                                  unit: item.ingridient_measure_unit
                                }))}
                              value={donationIngredient}
                              onChange={(value) => setDonationIngredient(value)}
                              onSelect={handleSelect}
                              placeholder="Eg: Roti, Chawal, Daal, etc"
                              filterOption={(inputValue, option) =>
                                option.value
                                  .toUpperCase()
                                  .indexOf(inputValue.toUpperCase()) !== -1
                              }
                            />
                              
                              </Col>
                            </Row>
                          </Col>
                          <Col xs={24} xl={11}>
                            <Row >
                              <Col xs={24} xl={9} style={{
                                    paddingLeft: "10px",
                                    fontWeight: "bold",
                                    fontSize: 16,
                                  }}>
                                
                                  Quantity ordered
                               
                              </Col>
                              <Col xs={24} xl={15}>
                                {" "}
                                <div style={{ paddingRight: "10px" }}>
                                  <Input placeholder="Basic usage" value={quantityValue} onChange={(e)=> setQuantityValue(e.target.value)} />
                                </div>
                              </Col>
                            </Row>
                          </Col>
                          <Col xs={24} xl={2}>
                            <span style={{textTransform: "capitalize"}}>{measureUnit}</span>
                          </Col>
                          {/* <Col xs={24} xl={3}>
                            {" "}
                            <center
                              style={{
                                padding: "0px 5px",
                                //   marginTop: 10,
                                display: "flex",
                                flexDirection: "row-reverse",
                                width: "100%",
                              }}
                            >
                              <Button
                          type="primary"
                          icon={<PlusCircleOutlined />}
                          onClick={addDonation}
                          size="default"
                        >
                          Add
                        </Button>
                            </center>
                          </Col> */}
                        </Row>
                    </div>
                    {/* {donationsList.length !== 0 && (
                  <List
                    dataSource={donationsList}
                    renderItem={(item) => (
                      <List.Item
                        style={{
                          width: "100%",
                          backgroundColor: "transparent",
                          padding: "0px",
                        }}
                      >
                        <Row style={{width: "100%"}}>
                          <Col xs={24} xl={10}>
                            {" "}
                            <Row>
                              <Col xs={24} xl={9}>
                                <div
                                  style={{
                                    paddingLeft: "10px",
                                    fontWeight: "bold",
                                    fontSize: 16,
                                  }}
                                >
                                  Ingredient
                                </div>
                              </Col>
                              <Col xs={24} xl={15}>
                                {" "}
                                <div style={{ paddingRight: "10px" }}>
                                  <span>{item?.donationIngredient}</span>
                                </div>
                              </Col>
                            </Row>
                          </Col>
                          <Col xs={24} xl={11}>
                            <Row>
                              <Col xs={24} xl={9}>
                                <div
                                  style={{
                                    paddingLeft: "10px",
                                    fontWeight: "bold",
                                    fontSize: 16,
                                  }}
                                >
                                  Quantity ordered
                                </div>
                              </Col>
                              <Col xs={24} xl={15}>
                                {" "}
                                <div style={{ paddingRight: "10px" }}>
                                <span>{item?.quantityValue}</span>
                                </div>
                              </Col>
                            </Row>
                          </Col>
                          <Col xs={24} xl={3}>
                            {" "}
                            <center
                              style={{
                                padding: "0px 5px",
                                //   marginTop: 10,
                                display: "flex",
                                flexDirection: "row-reverse",
                                width: "100%",
                              }}
                            >
                              <Button
                                type="primary"
                                style={{ width: "100%", margin: "0px 15px" }}
                                onClick={() => deleteDonation(item?.donationIngredient)}
                                icon={<DeleteOutlined />}
                                size="default"
                              ></Button>
                            </center>
                          </Col>
                        </Row>
                      </List.Item>
                    )}
                  />
                  )} */}

                  <Col xs={24} xl={24}>
                    {" "}
                    <center
                      style={{
                        display: "flex",
                        marginTop: 10,
                        flexDirection: "row-reverse",
                        width: "100%",
                      }}
                    >
                      <Button
                        type="primary"
                        style={{ width: "100%", margin: "20px" }}
                        size="default"
                        onClick={onSubmit}
                      >
                        CONFIRM DONATIONS
                      </Button>
                    </center>
                  </Col>
                </Modal>
                <List
                style={{height: '78vh', overflowY: 'scroll'}}
                  dataSource={donations}
                  renderItem={(item) => (
                    <List.Item
                      style={{
                        width: "100%",
                        backgroundColor: "transparent",
                        padding: "12px",
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
                          margin: '8px 10px',
                          width: "100%",
                          marginBottom: "4px",
                        }}
                      >
                        <Col xs={12} xl={5} style={{ marginLeft: "17px" }}>
                          Ingredient: <br />
                          <label style={{ fontSize: "120%" }}>
                            <i class="fa-solid fa-box"></i>&nbsp;
                            <span style={{textTransform: 'capitalize'}}>
                            {item?.ingredientName}
                            </span>
                          </label>
                        </Col>
                        <Col xs={12} xl={5}>
                          Donor's Name: <br />
                          <label style={{ fontSize: "120%" }}>
                            <i class="fa-solid fa-hands-praying"></i>&nbsp;
                            <span style={{textTransform: 'capitalize'}}>
                            {item?.donarName}
                            </span>
                          </label>
                        </Col>
                        <Col xs={12} xl={5}>
                          Donor's Contact: <br />
                          <label style={{ fontSize: "120%" }}>
                          <i class="fa-solid fa-phone"></i>&nbsp;{item?.contactNumber}
                          </label>
                        </Col>
                        <Col xs={12} xl={4}>
                          ITS ID: <br />
                          <label style={{ fontSize: "120%" }}>
                            <i class="fa-solid fa-id-card"></i>&nbsp;{item?.its_id}
                          </label>
                        </Col>
                        <Col xs={12} xl={4}>
                          Quantity Donated: <br />
                          <label style={{ fontSize: "120%" }}>
                            <i class="fa-solid fa-weight-scale"></i>&nbsp;{" "}
                            <span style={{ fontSize: "22px", color: "green" }}>
                              + {item?.donationQty} {item?.ingridient_measure_unit}
                            </span>
                          </label>
                        </Col>
                      </Row>
                    </List.Item>
                  )}
                />
              </ConfigProvider>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyVendor;
