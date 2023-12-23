import React, { useEffect, useState } from "react";
import { Button, Card, Col, Input, Modal, Row } from "antd";

const initialState = {
  ingredient_name: "",
  order_id: "",
  unit: "",
  vendor_id: "",
  vendorName: "",
  inventory_id: "",
  quantity_loaded: "",
  invoice_no: "",
  date_of_purchase: "",
};

const UpdateOrderModal = ({ id }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [orderDetails, setOrderDetails] = useState(initialState);

  const onSubmit = (e) => {
    const { name, value } = e.target;
    setOrderDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    console.log(id);
    // fetch("/api/order/getOne/" + id)
    //   .then((res) => {
    //     console.log(res);
    //     return res.json();
    //   })
    //   .then((data) => {
    //     setOrderDetails(data);
    //     console.log(data, "data");
    //     setIsModalOpen(false);
    //   })
    //   .catch((err) => console.log(err));
    console.log(orderDetails);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const addPurchaseData = async () => {
    // console.log(orderDetails);
    const idArray = [orderDetails].map((item) => item.inventory_id);
    // console.log(idArray);
    try {
      console.log(orderDetails);
      const data = await fetch("/api/purchase", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          documents: [orderDetails],
        }),
      });

      if (data) {
        const res = await data.json();

        await Promise.all(
          idArray.map((e, index) => {
            return fetch(`/api/report/update-avg-item-cost/${e.inventory_id}`)
              .then((response) => response.json())
              .then((data) => {
                console.log(data);
              });
          })
        );

        setIsModalOpen(false);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetch("/api/order/getOne/" + id)
      .then((res) => res.json())
      .then((data) => {
        const newData = data[0];
        setOrderDetails((prev) => ({
          ...prev,
          ...newData,
          order_id: newData?._id,
        }));
      })
      .catch((err) => console.log(err));
  }, [id]);

  //   useEffect(() => {
  //     console.log(id);
  //   }, [id]);

  return (
    <>
      <Button
        type="primary"
        style={{ marginLeft: "1.5rem" }}
        onClick={showModal}>
        Update
      </Button>
      <Modal
        title="Update Order"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={[
          <Button onClick={handleCancel}>Close</Button>,
          <Button type="primary" onClick={addPurchaseData}>
            Update
          </Button>,
        ]}>
        <Card style={{ width: "100%", textAlign: "left" }}>
          <Row style={{ width: "100%", textAlign: "left" }}>
            <Col xs={24} xl={12}>
              Ingredient's Name: <br />
              {orderDetails?.ingredient_name}
            </Col>
            <Col xs={24} xl={12}>
              Vendor's Name: <br />
              {orderDetails?.vendorName}
            </Col>
            <Col xs={8} xl={12}>
              Price per: {orderDetails?.unit}
              <br />
              Rs. {orderDetails?.rate_per_unit} /-
            </Col>
            <Col xs={8} xl={12}>
              Quantity ordered: <br />
              <Input
                name="quantity_loaded"
                value={orderDetails?.quantity_loaded}
                onChange={onSubmit}
                placeholder="Eg: 2,3,15, etc"
                style={{ width: "70%" }}></Input>
            </Col>
            <Col xs={8} xl={12} style={{ marginTop: "8px" }}>
              Invoice No: <br />
              <Input
                name="invoice_no"
                value={orderDetails?.invoice_no}
                onChange={onSubmit}
                placeholder="Enter Invoice No."
                style={{ width: "70%" }}></Input>
            </Col>
            <Col xs={8} xl={12} style={{ marginTop: "8px" }}>
              Date of purchase: <br />
              <Input
                name="date_of_purchase"
                value={orderDetails?.date_of_purchase}
                type="date"
                onChange={onSubmit}
                placeholder="Eg: 2,3,15, etc"
                style={{ width: "70%" }}></Input>
            </Col>
          </Row>
        </Card>
      </Modal>
    </>
  );
};
export default UpdateOrderModal;
