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
  const [remark, setRemark] = useState("");
  const [mohallaName, setMohallaName] = useState("");
  const [mohallaId, setMohallaId] = useState("");
  const [mohallaUsers, setMohallaUsers] = useState([]);


  const handleSelect = (value, option) => {
    setInventoryItemId(option.id);
    setDonationIngredient(value);
    setMeasureUnit(option.unit);
  };

  const handleUserSelect = (value, option) => {
    setMohallaId(option.id);
    setMohallaName(value);
  };
  
  const onSubmit = () => {
    const bodyData = {
      userId : mohallaId,
      userType: mohallaName,
      ingredientId: inventoryItemId,
      ingredientName: donationIngredient,
      donarName,
      contactNumber,
      remark,
      donationQty: +quantityValue,
      ingridient_measure_unit: measureUnit,
      its_id: +itsValue,
    }

    fetch("/api/donation", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(bodyData),
        }).then(res => res.json()).then((data) => {
          setDonations(prev => [data, ...prev])
          setMohallaId("")
          setMohallaName("")
          setInventoryItemId("")
          setDonationIngredient("")
          setDonarName("")
          setContactNumber("")
          setRemark("")
          setQuantityValue("")
          setMeasureUnit("")
          setItsValue("")
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

    fetch("/api/donation/all", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).then(res => res.json()).then((data) => {
      console.log(data);
      setDonations(data)}).catch(err => console.log(err))

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
        const data = await fetch("/api/cooking/ingredients", {
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

  useEffect(() => {
    const getMohallas = async () => {
      const data = await fetch("/api/admin/account_management", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          usertype: "Mohalla Admin",
          action: "get_user",
        }),
      });
      if (data) {
        const res = await data.json()
        setMohallaUsers(res)
        console.log(res);
      }
    };
    getMohallas();
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
                  <Col xs={24} xl={3}>
                    <span style={{
                          padding: "10px",
                          fontWeight: "bold",
                          fontSize: 16,
                        }}>
                    Select Mohalla: 
                    </span>
                  </Col>
                  <Col xs={24} xl={18}>
                  <Select
                    showSearch
                    id="ingredient-item-selected"
                    style={{ width: "100%" }}
                    options={mohallaUsers.length !== 0 && mohallaUsers.map((item) => ({
                        value: item.username,
                        id: item._id
                      }))}
                    value={mohallaName}
                    onChange={(value) => setMohallaName(value)}
                    onSelect={handleUserSelect}
                    placeholder="Select User"
                    filterOption={(inputValue, option) =>
                      option.value
                        .toUpperCase()
                        .indexOf(inputValue.toUpperCase()) !== -1
                    }
                  />
                  </Col>
                  </Row>
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
                          placeholder="Enter Your Name"
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
                          placeholder="Enter Your Contact Number"
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
                          placeholder="Enter Your ITS Id"
                          value={itsValue}
                          onChange={(e)=> setItsValue(e.target.value)}
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
                        Remarks<br />
                        <Input
                          style={{ marginTop: "10px", padding: "10px 5px" }}
                          placeholder="Enter Remark"
                          value={remark}
                          onChange={(e)=> setRemark(e.target.value)}
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
                                  <Select
                                    showSearch
                                    id="ingredient-item-selected"
                                    style={{ width: "100%" }}
                                    options={finalArrayForData.length !== 0 && finalArrayForData.map((item) => ({
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
                              <Col xs={24} xl={8} style={{
                                    paddingLeft: "10px",
                                    fontWeight: "bold",
                                    fontSize: 16,
                                  }}>
                                
                                  Donation Quantity
                               
                              </Col>
                              <Col xs={24} xl={16}>
                                {" "}
                                <div style={{ paddingRight: "10px" }}>
                                  <Input placeholder="Donation Amount" value={quantityValue} onChange={(e)=> setQuantityValue(e.target.value)} />
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
                          justifyContent: 'center',
                          alignItems: 'center',
                          // border: "2px solid darkred",
                          boxShadow: valueShadowBox,
                          margin: '8px 10px',
                          width: "100%",
                          marginBottom: "4px",
                        }}
                      >
                        <Col xs={12} xl={3} style={{ marginLeft: "17px" }}>
                        <i className="fa-solid fa-box"></i>&nbsp;&nbsp;Ingredient: <br />
                          <label style={{ fontSize: "120%" }}>
                            <span style={{textTransform: 'capitalize', display: 'block'}}>
                            {item?.ingredientName}
                            </span>
                          </label>
                        </Col>
                        <Col xs={12} xl={3}>
                        <i className="fa-solid fa-hands-praying"></i>&nbsp;&nbsp;Mohalla: <br />
                          <label style={{ fontSize: "120%" }}>
                            <span style={{textTransform: 'capitalize', display: 'block'}}>
                            {item?.userType}
                            </span>
                          </label>
                        </Col>
                        <Col xs={12} xl={4}>
                        <i className="fa-solid fa-hands-praying"></i>&nbsp;&nbsp;Donor's Name: <br />
                          <label style={{ fontSize: "120%" }}>
                            <span style={{textTransform: 'capitalize', display: 'block'}}>
                            {item?.donarName}
                            </span>
                          </label>
                        </Col>
                        <Col xs={12} xl={4}>
                        <i className="fa-solid fa-phone"></i>&nbsp;&nbsp;Donor's Contact: <br />
                          <span style={{textTransform: 'capitalize', display: 'block'}}>
                          {item?.contactNumber}
                          </span>
                        </Col>
                        <Col xs={12} xl={4}>
                        <i className="fa-solid fa-id-card"></i>&nbsp;&nbsp;ITS ID: <br />
                          <span style={{ textTransform: 'capitalize', display: 'block' }}>
                            {item?.its_id}
                          </span>
                        </Col>
                        <Col xs={12} xl={4}>
                        <i className="fa-solid fa-weight-scale"></i>&nbsp;&nbsp;Quantity Donated: <br />
                          <label style={{ textTransform: 'capitalize',display: 'block',fontSize: "22px", color: "green" }}>
                           
                              + {item?.donationQty} {item?.ingridient_measure_unit}
                            
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
