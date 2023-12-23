import React, { useEffect, useState } from "react";
import { Button, Card, Col, Input, Modal, Row } from "antd";

const initialState = {
  ingredient_name: "",
  unit: "",
  vendor_id: "",
  vendorName: "",
  inventory_id: "",
  quantity_loaded: "",
  invoice_no: "",
  date_of_purchase: "",
};

const ViewOrderModal = ({ id, vendorName }) => {
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
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  useEffect(() => {
    fetch("/api/purchase/getOne/" + id)
      .then((res) => res.json())
      .then((data) => {
        const newData = data;
        setOrderDetails((prev) => ({ ...prev, ...newData }));
      })
      .catch((err) => console.log(err));
  }, [id]);

  //   useEffect(() => {
  //     console.log(id);
  //   }, [id]);

  return (
    <>
      <Button style={{ marginLeft: "1.5rem" }} onClick={showModal}>
        View
      </Button>
      <Modal
        title="Update Order"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={[
          <Button type="primary" onClick={handleOk}>
            Ok
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
              {vendorName}
            </Col>
            <Col xs={8} xl={12}>
              Price per: {orderDetails?.unit}
              <br />
              Rs. {orderDetails?.rate_per_unit} /-
            </Col>
            <Col xs={8} xl={12}>
              Quantity ordered: <br />
              {orderDetails?.quantity_loaded}
            </Col>
            <Col xs={8} xl={12} style={{ marginTop: "8px" }}>
              Invoice No: <br />
              {orderDetails?.invoice_no}
            </Col>
            <Col xs={8} xl={12} style={{ marginTop: "8px" }}>
              Date of purchase: <br />
              {orderDetails?.date_of_purchase}
            </Col>
          </Row>
        </Card>
      </Modal>
    </>
  );
};
export default ViewOrderModal;
