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
import { Link, useNavigate } from "react-router-dom";

const VerifyVendor = () => {
  const { Column, ColumnGroup } = Table;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newMohallaPopup, setNewMohallaPopup] = useState(false);
  const [update, setUpdate] = useState(false);
  const [filterByName, setFilterByName] = useState("");
  const [filteredVendors, setFilteredVendors] = useState([]);
  const [vendors, setVendors] = useState();

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const localValue = [{}];

  /**************Restricting Admin Route************************* */

  /**************Restricting Admin Route************************* */

  return (
    <div
      style={{ margin: 0, padding: 0, backgroundImage: `url(${DeshboardBg})` }}
    >
      <div style={{ display: "flex" }}>
        <SideNav k="7" userType="pai" />
        <div style={{ width: "100%" }}>
          <Header
            title="Donations"
            comp={
              <center>
                <Button
                  style={{ backgroundColor: "white", color: "darkred" }}
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
                    colorPrimary: "darkred",
                    colorDanger: "",
                  },
                }}
              >
                <Modal
                  title=<span style={{ fontSize: 18, fontWeight: "bold" }}>
                    New Donation Entry
                  </span>
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
                        Name of the donor <br />
                        <Input
                          style={{ marginTop: "10px", padding: "10px 5px" }}
                          placeholder="Basic usage"
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
                        ITS ID <br />
                        <Input
                          style={{ marginTop: "10px", padding: "10px 5px" }}
                          placeholder="Basic usage"
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
                    <Col xs={24} xl={12}>
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
                          size="default"
                        >
                          New donation entry
                        </Button>
                      </div>
                    </Col>
                  </Row>
                  <List
                    dataSource={[2]}
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
                                  <Input placeholder="Basic usage" />
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
                                  <Input placeholder="Basic usage" />
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
                                icon={<DeleteOutlined />}
                                size="default"
                              ></Button>
                            </center>
                          </Col>
                        </Row>
                      </List.Item>
                    )}
                  />

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
                      >
                        CONFIRM DONATIONS AND SUBMIT
                      </Button>
                    </center>
                  </Col>
                </Modal>
                <List
                  dataSource={localValue}
                  renderItem={(item) => (
                    <List.Item
                      style={{
                        width: "100%",
                        backgroundColor: "transparent",
                        padding: "0px",
                      }}
                    >
                      <Row
                        style={{
                          padding: 10,
                          display: "flex",
                          backgroundColor: "#fff",
                          borderRadius: 10,
                          border: "2px solid darkred",
                          width: "100%",
                          marginBottom: "4px",
                        }}
                      >
                        <Col xs={12} xl={6} style={{ marginLeft: "17px" }}>
                          Ingredient Donated: <br />
                          <label style={{ fontSize: "120%" }}>
                            <i class="fa-solid fa-box"></i>&nbsp;Chicken Meat
                          </label>
                        </Col>
                        <Col xs={12} xl={5}>
                          Donor Name: <br />
                          <label style={{ fontSize: "120%" }}>
                            <i class="fa-solid fa-hands-praying"></i>&nbsp;Doner
                          </label>
                        </Col>

                        <Col xs={12} xl={6}>
                          ITS ID: <br />
                          <label style={{ fontSize: "120%" }}>
                            <i class="fa-solid fa-id-card"></i>&nbsp;ID007
                          </label>
                        </Col>
                        <Col xs={12} xl={6}>
                          Quantity Donated: <br />
                          <label style={{ fontSize: "120%" }}>
                            <i class="fa-solid fa-weight-scale"></i>&nbsp;{" "}
                            <span style={{ fontSize: "22px", color: "green" }}>
                              + 20,000 KG
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
