import {
  Button,
  Card,
  Col,
  Form,
  Input,
  List,
  Modal,
  Radio,
  Row,
  Tag,
} from "antd";
import React, { useEffect, useState } from "react";

const data_new = [
  {
    title: "Card title 1",
    description: "This is card description 1",
  },
  {
    title: "Card title 2",
    description: "This is card description 2",
  },
  {
    title: "Card title 3",
    description: "This is card description 3",
  },
];

const AddIngridientsInventory = () => {
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [updated, setUpdated] = useState(false);

  const data = ["Set Menu", "Cooking", "Dispatch"];

  const [name, setName] = useState("");
  const [unit, setUnit] = useState("");
  const [expiry, setExpiry] = useState("");
  const [expiryType, setExpiryType] = useState("");
  const [inventoryItems, setInventoryItems] = useState();

  useEffect(() => {
    const getInventory = async () => {
      const data = await fetch("/api/inventory/addinventory");
      if (data) {
        const res = await data.json();
        setInventoryItems(res);
      }
    };
    getInventory();
  }, [updated]);

  const handleSubmit = async () => {
    try {
      const data = await fetch("/api/inventory/addinventory", {
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
      }
    } catch (error) {
      console.log(error);
    }
  };

  const addInventortyItem = async () => {
    setVisible(true);
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
        <Col xs={24} xl={20} style={{ padding: "5%" }}>
          <Row>
            <Col xs={12} xl={12}>
              <Button
                type="primary"
                onClick={addInventortyItem}
                style={{ position: "absolute", top: 0, right: 0 }}
              >
                Add Inventory Items
              </Button>
            </Col>
          </Row>
        </Col>
        <Modal
          visible={visible}
          title="Add Item"
          okText="Create"
          onCancel={() => setVisible(false)}
          onOk={() => {
            form.validateFields().then((values) => {
              form.resetFields();
              setVisible(false);
              handleSubmit();
            });
          }}
        >
          <Form form={form} layout="vertical">
            <Form.Item
              name="name"
              label="Name"
              rules={[{ required: true, message: "Please enter the name" }]}
            >
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </Form.Item>
            <Form.Item
              name="unit"
              label="Unit of Measurement"
              rules={[
                {
                  required: true,
                  message: "Please enter the unit of measurement",
                },
              ]}
            >
              <Input value={unit} onChange={(e) => setUnit(e.target.value)} />
            </Form.Item>
            <Form.Item
              name="expiry"
              label="Expiry Period"
              rules={[
                { required: true, message: "Please enter the expiry period" },
              ]}
            >
              <Input
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
              />
            </Form.Item>
            <Radio.Group onChange={(e) => setExpiryType(e.target.value)}>
              <Radio value={"Days"}>Days</Radio>
              <Radio value={"Months"}>Months</Radio>
            </Radio.Group>
          </Form>
        </Modal>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            marginLeft: "250px",
            justifyContent: "center",
          }}
        >
          {inventoryItems &&
            inventoryItems.map((item) => (
              <Card
                key={item.id}
                title={item.ingridient_name}
                bordered={false}
                style={{
                  width: 300,
                  margin: "20px",
                  borderRadius: "10px",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                }}
              >
                <p
                  style={{
                    fontSize: "16px",
                    lineHeight: "22px",
                    color: "#666",
                  }}
                >
                  Expiration time - {item.ingridient_expiry_amount}{" "}
                  {item.ingridient_expiry_period}
                </p>
              </Card>
            ))}
        </div>
      </Row>
    </div>
  );
};

export default AddIngridientsInventory;
