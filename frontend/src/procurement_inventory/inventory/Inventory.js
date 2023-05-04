import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  List,
  Input,
  Slider,
  Button,
  Card,
  Modal,
  Radio,
  Tag
} from "antd";

const Inventory = () => {
  const data = [
    "Inventory",
    "Purchases",
    "Current Menu",
    "Vendors",
    "Damaged Goods",
  ];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [unit, setUnit] = useState("");
  const [expiry, setExpiry] = useState("");
  const [expiryType, setExpiryType] = useState("");
  const [inventoryItems, setInventoryItems] = useState();
  const [updated, setUpdated] = useState(false);

  useEffect(() => {
    const getInventory = async () => {
      const data = await fetch("http://localhost:5001/inventory/addinventory");
      if (data) {
        const res = await data.json();
        setInventoryItems(res);
        console.log(res);
      }
    };
    getInventory();
  }, [updated]);

  const handleSubmit = async () => {
    try {
      console.log("inside");
      const data = await fetch("http://localhost:5001/inventory/addinventory", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mkuser_email: "naman@gmail.com",
          ingridient_name: name,
          ingridient_measure_unit: unit,
          ingridient_expiry_period: expiryType,
          ingridient_expiry_amount: expiry,
          decommisioned: true,
          total_volume: 0,
          date: "4/21/2023",
          quantity_transected: 0,
          latest_rate: 0,
          rate_per_unit: 0,
        }),
      });

      if (data) {
        const res = await data.json();
        setUpdated((prev) => !prev);
        setIsModalOpen(false);
        setName("");
        setExpiry("");
        setUnit("");
        console.log(res);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <Row>
        <Col xs={0} xl={4} style={{ padding: "1%" }}>
          <List
            bordered
            dataSource={data}
            renderItem={(item) => <List.Item>{item}</List.Item>}
          />
        </Col>
        <Col xs={24} xl={20} style={{ padding: "3%" }}>
        <Card style={{ padding:'1%', border:'1px solid grey' }} bordered={true}>
            <Row>
                <Col xs={12} xl={12} style={{ fontSize: '200%' }}>Inventory</Col>
                <Col xs={12} xl={12}>
                </Col>
            </Row>
        </Card>
          <hr></hr>
          <table style={{ width: "100%" }} cellPadding={20}>
            <tr>
              <td>
                Filter by ingredients name:<br/>
                <Input
                  placeholder="Filter by name..."
                  style={{ width: "70%" }}
                ></Input>
              </td>
              <td>
                Volume Range: 
                <Slider min={1} max={10000}></Slider>
              </td>
              <td>
                <center>
                  <Button type="primary" onClick={(e) => setIsModalOpen(true)}>
                    <i class="fa-solid fa-circle-plus"></i> &nbsp;&nbsp;&nbsp; Add new ingredient
                  </Button>
                </center>
                
                <Modal
                  open={isModalOpen}
                  onOk={handleSubmit}
                  onCancel={(e) => setIsModalOpen(false)}
                >
                  <label style={{ fontSize: "150%" }}>Add new Ingredient</label>
                  <br />
                  <br />
                  <table style={{ width: "100%" }}>
                    <tr>
                      <td>Name</td>
                      <td>
                        <Input
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Eg: Chicken Meat, Basmati Rice, etc"
                        ></Input>
                      </td>
                    </tr>
                    <tr>
                      <td>Unit for measurement</td>
                      <td>
                        <Input
                          value={unit}
                          onChange={(e) => setUnit(e.target.value)}
                          placeholder="Eg: 2,3,4, etc"
                        ></Input>
                      </td>
                    </tr>
                    <tr>
                      <td>Expiry Period</td>
                      <td>
                        <Input
                          value={expiry}
                          onChange={(e) => setExpiry(e.target.value)}
                          placeholder="Eg: 12,24,36, etc"
                        ></Input>
                        <Radio.Group
                          onChange={(e) => setExpiryType(e.target.value)}
                        >
                          <Radio value={"Days"}>Days</Radio>
                          <Radio value={"Months"}>Months</Radio>
                          <Radio value={"Year"}>Year</Radio>
                        </Radio.Group>
                      </td>
                    </tr>
                  </table>
                </Modal>
              </td>
            </tr>
          </table>
          <hr></hr>
          {inventoryItems && (
            <Card>
              <List
                dataSource={inventoryItems}
                renderItem={(item) => (
                  <List.Item>
                    <Row style={{ width: '100%', textAlign:'left' }}>
                      <Col xs={24} xl={24} style={{ fontSize: '150%' }}>{item.ingridient_name}</Col>
                      <Col xs={8} xl={6}>Ingredient Expiry period: <br/>{item.ingridient_expiry_amount} {item.ingridient_expiry_period}</Col>
                      <Col xs={8} xl={6}>Ingredient total Volume: <br/>{item.total_volume} {item.ingridient_measure_unit}</Col>
                      <Col xs={8} xl={6}>{item.total_volume < 6 ? <div><i class="fa-solid fa-circle-exclamation"></i> You are short on items <br/><br/><Button style={{ backgroundColor: 'green' }} type='primary'>Restock Ingredient</Button></div> : <div><i class="fa-solid fa-circle-check"></i> SUFFICIENT</div>}</Col>
                      <Col xs={8} xl={6}>
                          <Button>View Purchases</Button>
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
      </Row>
    </div>
  );
};

export default Inventory;
