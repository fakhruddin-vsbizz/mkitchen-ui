import React, { useEffect } from "react";
import { useState } from "react";
import {
  Card,
  Row,
  Col,
  Button,
  List,
  Tag,
  Input,
  DatePicker,
  Select,
  Slider,
  InputNumber,
} from "antd";
import { useParams } from "react-router-dom";

const IngredientPurchase = () => {
  const [itemPurchase, setItemPurchase] = useState();
  const [vendors, setVendors] = useState([]);

  const { id } = useParams();
  console.log(id);

  useEffect(() => {
    const getInventory = async () => {
      const data = await fetch("http://localhost:5001/vendor");
      if (data) {
        const res = await data.json();
        if (res) {
          if (res) {
            setVendors(res);
          }
        }
      }
    };
    getInventory();
  }, []);

  console.log(vendors);

  useEffect(() => {
    const getInventory = async () => {
      const data = await fetch("http://localhost:5001/purchase");
      if (data && id) {
        const res = await data.json();
        if (res) {
          if (res) {
            let purchaseData = res.filter(
              (item, index) => item.inventory_id === id
            );
            setItemPurchase(purchaseData);
          }
        }
      }
    };
    getInventory();
  }, [id]);

  console.log(itemPurchase);

  const vendorPurchaseList = [
    {
      vendor_name: "V.K. General store",
      quantity_ordered: 130,
      rate: 600,
      unit: "KG",
      is_paid: false,
      created_on: "24-06-2023",
    },
    {
      vendor_name: "Brahma Stores",
      quantity_ordered: 400,
      rate: 40,
      unit: "KG",
      is_paid: true,
      created_on: "24-06-2023",
    },
    {
      vendor_name: "Mustali Stores",
      quantity_ordered: 500,
      rate: 25,
      unit: "KG",
      is_paid: false,
      created_on: "24-06-2023",
    },
    {
      vendor_name: "Supermarket Stores",
      quantity_ordered: 200,
      rate: 100,
      unit: "L",
      is_paid: true,
      created_on: "24-06-2023",
    },
  ];

  const [inputValue, setInputValue] = useState(1);

  const onChange = (newValue) => {
    setInputValue(newValue);
  };

  return (
    <div>
      <Card style={{ padding: "1%", border: "1px solid grey" }} bordered={true}>
        <Row>
          <Col xs={12} xl={12} style={{ fontSize: "200%" }}>
            <i class="fa-solid fa-arrow-left"></i>&nbsp;&nbsp;&nbsp;Ingredient
            Purchase : Goat Meat
          </Col>
        </Row>
      </Card>

      <br />
      <br />
      <center>
        <Card style={{ width: "85%", textAlign: "left" }}>
          <Row style={{ width: "100%" }}>
            <Col xs={12} xl={6}>
              Filter by vendor name: <br />
              <Input
                placeholder="Filter by ingredients. Eg: Chicken meat, Goat meat"
                style={{ width: "70%" }}
              ></Input>
            </Col>
            <Col xs={12} xl={6}>
              Date of Purchase: <br />
              <DatePicker></DatePicker>
            </Col>
            <Col xs={12} xl={6}>
              Paid status: <br />
              <Select
                defaultValue={0}
                style={{ width: "70%" }}
                options={[
                  { value: 0, label: "PAID" },
                  { value: 1, label: "UNPAID" },
                ]}
              ></Select>
            </Col>
            <Col xs={12} xl={6}>
              Price Range: <br />
              <Row>
                <Col xs={12} xl={12}>
                  <Slider
                    style={{ width: "70%" }}
                    min={1}
                    max={100000}
                    onChange={onChange}
                    value={typeof inputValue === "number" ? inputValue : 0}
                  />
                </Col>
                <Col xs={12} xl={12}>
                  <InputNumber
                    min={1}
                    max={10000}
                    style={{ margin: "0 16px" }}
                    value={inputValue}
                    onChange={onChange}
                  />
                </Col>
              </Row>
            </Col>
          </Row>
        </Card>
        {itemPurchase && (
          <List
            style={{ width: "85%" }}
            bordered
            dataSource={itemPurchase}
            renderItem={(item) => (
              <List.Item>
                <Row style={{ width: "100%", textAlign: "left" }}>
                  <Col xs={24} xl={24} style={{ fontSize: "150%" }}>
                    {vendors &&
                      vendors
                        .filter((it, index) => it._id === item.vendor_id)
                        .map((ele) => ele.vendor_name)}
                  </Col>
                  <Col xs={8} xl={6}>
                    Required quantity: <br />
                    {item.quantity_loaded} {item.unit}
                  </Col>
                  <Col xs={8} xl={6}>
                    Price: <br />
                    Rs. {item.quantity_loaded * item.rate_per_unit}/-
                  </Col>
                  <Col xs={8} xl={6}>
                    Date of purchase: <br />
                    {item.createdAt}
                  </Col>
                  <Col xs={8} xl={6}>
                    <Tag color={item.is_paid ? "green" : "red"}>
                      {item.is_paid ? "PAID" : "UNPAID"}
                    </Tag>
                  </Col>
                </Row>
              </List.Item>
            )}
          />
        )}
      </center>
    </div>
  );
};

export default IngredientPurchase;
