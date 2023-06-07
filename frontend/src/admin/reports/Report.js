import React, { useRef, useEffect, useState } from "react";
import axios from "axios";

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
  Alert,
  Tabs,
  ConfigProvider,
  Space,
  Table,
} from "antd";

import { InfoCircleOutlined } from "@ant-design/icons";
import DeshboardBg from "../../res/img/DeshboardBg.png";
import SideNav from "../../components/navigation/SideNav";
import Header from "../../components/navigation/Header";
import AuthContext from "../../components/context/auth-context";
import { useNavigate } from "react-router-dom";
// import SearchTable from "../../components/elements/SearchTable";
import { SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";


const Report = () => {
  const [username, setUsername] = useState();
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
          <Button
            // type="link"
            size="small"
            onClick={() => {
              confirm({
                closeDropdown: false,
              });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            // type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? "#1890ff" : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const data = [
    {
      key: "1",
      name: "John Brown",
      age: 18,
      address: "New York No. 1 Lake Park",
      exDate: '2025'
    },
    {
      key: "2",
      name: "Joe Black",
      age: 19,
      address: "London No. 1 Lake Park",
    },
    {
      key: "3",
      name: "Jim Green",
      age: 20,
      address: "Sydney No. 1 Lake Park",
    },
    {
      key: "4",
      name: "Jim Red",
      age: 21,
      address: "London No. 2 Lake Park",
    },
    {
      key: "5",
      name: "John Brown",
      age: 22,
      address: "New York No. 1 Lake Park",
    },
    {
      key: "6",
      name: "Joe Black",
      age: 23,
      address: "London No. 1 Lake Park",
    },
    {
      key: "7",
      name: "Jim Green",
      age: 24,
      address: "Sydney No. 1 Lake Park",
    },
    {
      key: "8",
      name: "Jim Red",
      age: 25,
      address: "London No. 2 Lake Park",
    },
    {
      key: "9",
      name: "John Brown",
      age: 26,
      address: "New York No. 1 Lake Park",
    },
    {
      key: "10",
      name: "Joe Black",
      age: 27,
      address: "London No. 1 Lake Park",
    },

  ];
  const demandGoodsData= [
    {
      key: "1",
      name: "Haldi",
      inDate: '20/04/2023',
      exDate: '04/2025',
      cost: '2400'
    },
    {
      key: "2",
      name: "Jeera",
      inDate: '20/03/2023',
      exDate: '04/2024',
      cost: '2900'
    },
    {
      key: "3",
      name: "Chilli",
      inDate: '22/04/2023',
      exDate: '08/2024',
      cost: '1400'
    },   
   
  ];
  const negativeInventoryData= [
    {
      key: "1",
      name: "Haldi",
      negativeVol: '135',
      cost: '1400'
    },
    {
      key: "2",
      name: "Jeera",
      negativeVol: '23',
      
      cost: '200'
    },
    {
      key: "3",
      name: "Chilli",
      negativeVol: '223',      
      cost: '1400'
    },   
   
  ];

  const columns = [
    {
      title: "Ingredient",
      dataIndex: "name",
      key: "name",
      width: "30%",
      ...getColumnSearchProps("name"),
    },
    {
      title: "Stock-in date",
      dataIndex: "age",
      key: "age",
      width: "30%",
      ...getColumnSearchProps("age"),
    },
    {
      title: "Cost",
      dataIndex: "address",
      key: "address",
      ...getColumnSearchProps("address"),
      sorter: (a, b) => a.address.length - b.address.length,
      sortDirections: ["descend", "ascend"],
    },
  ];

  const demandGoodsCols = [
    {
      title: "Ingredient",
      dataIndex: "name",
      key: "name",
      width: "20%",
      ...getColumnSearchProps("name"),
    },
    {
      title: "Stock-in date",
      dataIndex: "inDate",
      key: "inDate",
      width: "30%",
      ...getColumnSearchProps("inDate"),
    },
    {
      title: "Expired date",
      dataIndex: "exDate",
      key: "exDate",
      width: "30%",
      ...getColumnSearchProps("exDate"),
    },
    {
      title: "Cost",
      dataIndex: "cost",
      key: "cost",
      ...getColumnSearchProps("cost"),
      sorter: (a, b) => a.cost - b.cost
    },
  ];
  const negativeInventoryCols = [
    {
      title: "Ingredient",
      dataIndex: "name",
      key: "name",
      width: "30%",
      ...getColumnSearchProps("name"),
    },
    {
      title: "Negative volume",
      dataIndex: "negativeVol",
      key: "negativeVol",
      width: "30%",
      ...getColumnSearchProps("negativeVol"),
    },
   
    {
      title: "Cost",
      dataIndex: "cost",
      key: "cost",
      ...getColumnSearchProps("cost"),
      sorter: (a, b) => a.cost - b.cost
    },
  ];

  

  const vendorsData= [
    {
      key: "1",
      name: "VK General St",
      ingredient: 'Red Chilli',
      cost: '1400',
      status: 'Paid',
    },
    {
      key: "2",
      name: "VK General St",
      ingredient: 'Jeera',      
      cost: '220',
      status: 'Unpaid',
    },
    {
      key: "3",
      name: "Raziq Sk.",
      ingredient: 'Chicken',      
      cost: '1900',
      status: 'Paid',
    },      
  ];

 

 
  const vendorsCols = [
    {
      title: "Vendor",
      dataIndex: "name",
      key: "name",
      width: "30%",
      ...getColumnSearchProps("name"),
    },
    {
      title: "Ingredient",
      dataIndex: "ingredient",
      key: "ingredient",
      width: "25%",
      ...getColumnSearchProps("ingredient"),
    },
   
    {
      title: "Purchase Cost",
      dataIndex: "cost",
      key: "cost",
      ...getColumnSearchProps("cost"),
      sorter: (a, b) => a.cost - b.cost
    },
    {
      title: "Paid Status",
      dataIndex: "status",
      key: "status",
      ...getColumnSearchProps("status"),
      sorter: (a, b) => a.status.length - b.status.length,
      sortDirections: ["descend", "ascend"],
    },
  ];

  const dataList = [
    {
      Ingredient: "Haldi",
      cost: 650,
      totalPurchases: "65",
      time: "15",
      rate: "10",
    },
    {
      Ingredient: "Jeera",
      cost: 4500,
      totalPurchases: "50",
      time: "17",
      rate: "90",
    },
  ];
  const vendorChartList = [
    {
      Ingredient: "Haldi, Moong Dal, Rai daana,",
      cost: 650,
      totalPurchases: "65",
      verified: "Verified",
      name: "VK General Store",
    },
    {
      Ingredient: "Haldi, Moong Dal, Rai daana,",
      cost: 750,
      totalPurchases: "75",
      verified: "Verified",
      name: "VK General Store",
    },
    
  ];

  return (
    <div
      style={{
        margin: 0,
        padding: 0,
        backgroundImage: `url(${DeshboardBg})`,
        backgroundSize: "cover",
      }}
    >
      <div style={{ display: "flex" }}>
        <SideNav k="5" userType="admin" />
        <div style={{ width: "100%" }}>
          <Header title="Reports" />
          <ConfigProvider
            theme={{
              token: {
                colorPrimary: "orange",
                colorDanger: "",
              },
            }}
          >
            <div className="" style={{ padding: 10 }}>
              <Tabs centered style={{ color: "#E86800" }}>
                <Tabs.TabPane tab="Inventory" key="1">
                  <div
                    style={{
                      borderBottomWidth: 2,
                      borderBottomColor: "#E86800",
                    }}
                  >
                    {/* <label
                      style={{
                        fontSize: "130%",
                        padding: 20,
                        color: "#E86800",
                      }}
                    >
                      <b>Mohalla Accounts</b>
                    </label> */}

                    <Card
                      style={{
                        margin: 10,
                        // overflowY: "scroll",
                        backgroundColor: "transparent",
                        // height: "70vh",
                        border: "none",
                        // borderColor: '#E86800',
                      }}
                    >
                      <Row>
                        <Col
                          xs={8}
                          xl={8}
                          style={{
                            padding: 10,
                            textAlign: "center",
                            width: "80%",
                          }}
                        >
                          <div
                            style={{
                              fontSize: "120%",
                              color: "#E86800",
                              margin: 10,
                              padding: 10,
                              backgroundColor: "#fff",
                              borderRadius: 10,
                              borderBottom: "2px solid orange",
                            }}
                          >
                            <h5>Total Ingredients</h5>
                            <h1>124</h1>
                          </div>
                        </Col>
                        <Col
                          xs={8}
                          xl={8}
                          style={{
                            padding: 10,
                            textAlign: "center",

                            width: "80%",
                          }}
                        >
                          <div
                            style={{
                              fontSize: "120%",
                              color: "#E86800",
                              padding: 10,

                              margin: 10,
                              backgroundColor: "#fff",
                              borderRadius: 10,
                              borderBottom: "2px solid orange",
                            }}
                          >
                            <h5>Total damaged goods</h5>
                            <h1>420</h1>
                          </div>
                        </Col>
                        <Col
                          xs={8}
                          xl={8}
                          style={{
                            padding: 10,
                            textAlign: "center",

                            width: "80%",
                          }}
                        >
                          <div
                            style={{
                              fontSize: "120%",
                              color: "#E86800",
                              padding: 10,
                              margin: 10,
                              backgroundColor: "#fff",
                              borderRadius: 10,
                              borderBottom: "2px solid orange",
                            }}
                          >
                            <h5>Total inventory cost</h5>
                            <h1>12000</h1>
                          </div>
                        </Col>
                      </Row>
                      <Row>
                        <Col
                          xs={24}
                          xl={12}
                          style={{
                            padding: 10,
                            // textAlign: "center",
                            width: "80%",
                          }}
                        >
                          <h3 style={{ color: "#e08003" }}>Damaged Goods</h3>
                          {/* <SearchTable columns={columns} dataSource={data} /> */}
                          <Table columns={demandGoodsCols} dataSource={demandGoodsData} />
                        </Col>
                        <Col
                          xs={24}
                          xl={12}
                          style={{
                            padding: 10,
                            // textAlign: "center",
                            width: "80%",
                          }}
                        >
                          <h3 style={{ color: "#e08003" }}>
                            Negative Inventory
                          </h3>
                          {/* <SearchTable /> */}
                          <Table columns={negativeInventoryCols} dataSource={negativeInventoryData} />

                        </Col>
                      </Row>
                      <label
                        style={{
                          fontSize: "130%",
                          padding: 20,
                          color: "#E86800",
                        }}
                      >
                        <b>Inventory Details</b>
                      </label>

                      <Card
                        style={{
                          margin: 10,
                          overflowY: "scroll",
                          backgroundColor: "transparent",
                          height: "70vh",
                          // border: '1px 0px',
                          // borderColor: '#E86800',
                        }}
                      >
                        <List
                          dataSource={dataList}
                          renderItem={(item) => (
                            <>
                              <List.Item>
                                <Row
                                  style={{
                                    padding: 10,
                                    display: "flex",
                                    backgroundColor: "#fff",
                                    borderRadius: 10,
                                    borderBottom: "2px solid orange",
                                    width: "100%",
                                  }}
                                >
                                  <Col
                                    xs={24}
                                    xl={24}
                                    style={{
                                      fontSize: "120%",
                                      color: "#E86800",
                                    }}
                                  >
                                    <h3>{item.Ingredient}</h3>
                                    <hr
                                      style={{
                                        backgroundColor: "orange",
                                        height: 2,
                                        border: "none",
                                      }}
                                    />
                                  </Col>
                                  <Col xs={6} xl={6}>
                                    Total Purchases: <br />{" "}
                                    <h1>{item.totalPurchases}</h1>
                                    {/* {item.usertype ? (
                                    <Tag color="green">ACITVE</Tag>
                                  ) : (
                                    <Tag color="red">DISABLED</Tag>
                                  )} */}
                                  </Col>
                                  <Col xs={6} xl={6}>
                                    Total Cost of ingredient purchase: <br />{" "}
                                    <h1>{item.cost}</h1>
                                  </Col>
                                  <Col xs={6} xl={6}>
                                    Times used in menus: <br />{" "}
                                    <h1>{item.totalPurchases}</h1>
                                    {/* {item.usertype ? (
                                    <Tag color="green">ACITVE</Tag>
                                  ) : (
                                    <Tag color="red">DISABLED</Tag>
                                  )} */}
                                  </Col>
                                  <Col xs={6} xl={6}>
                                    Average Market rate: <br />{" "}
                                    <h1>{item.rate}</h1>
                                  </Col>
                                </Row>
                              </List.Item>
                            </>
                          )}
                        />
                      </Card>
                    </Card>
                  </div>
                </Tabs.TabPane>
                <Tabs.TabPane tab="Purchase and Vendors" key="2">
                  <div
                    style={{
                      borderBottomWidth: 2,
                      borderBottomColor: "#E86800",
                    }}
                  >
                    {/* <label
                      style={{
                        fontSize: "130%",
                        padding: 20,
                        color: "#E86800",
                      }}
                    >
                      <b>Mohalla Accounts</b>
                    </label> */}

                    <Card
                      style={{
                        margin: 10,
                        // overflowY: "scroll",
                        backgroundColor: "transparent",
                        // height: "70vh",
                        border: "none",
                        // borderColor: '#E86800',
                      }}
                    >
                      <Row>
                        <Col
                          xs={8}
                          xl={8}
                          style={{
                            padding: 10,
                            textAlign: "center",
                            width: "80%",
                          }}
                        >
                          <div
                            style={{
                              fontSize: "120%",
                              color: "#E86800",
                              margin: 10,
                              padding: 10,
                              backgroundColor: "#fff",
                              borderRadius: 10,
                              borderBottom: "2px solid orange",
                            }}
                          >
                            <h5>Item purchases</h5>
                            <h1>124</h1>
                          </div>
                        </Col>
                        <Col
                          xs={8}
                          xl={8}
                          style={{
                            padding: 10,
                            textAlign: "center",

                            width: "80%",
                          }}
                        >
                          <div
                            style={{
                              fontSize: "120%",
                              color: "#E86800",
                              padding: 10,

                              margin: 10,
                              backgroundColor: "#fff",
                              borderRadius: 10,
                              borderBottom: "2px solid orange",
                            }}
                          >
                            <h5>Purchase cost</h5>
                            <h1>420</h1>
                          </div>
                        </Col>
                      </Row>
                      <Row>
                        <Col
                          xs={24}
                          xl={24}
                          style={{
                            padding: 10,
                            // textAlign: "center",
                            width: "80%",
                          }}
                        >
                          <h3 style={{ color: "#e08003" }}>
                            Paid / Unpaid Vendors
                          </h3>
                          {/* <SearchTable /> */}
                          <Table columns={vendorsCols} dataSource={vendorsData} />

                          <label
                        style={{
                          fontSize: "130%",
                          padding: 20,
                          color: "#E86800",
                        }}
                      >
                        <b>Vendor Chart</b>
                      </label>

                      <Card
                        style={{
                          margin: 10,
                          overflowY: "scroll",
                          backgroundColor: "transparent",
                          height: "70vh",
                          // border: '1px 0px',
                          // borderColor: '#E86800',
                        }}x
                      >
                        <List
                          dataSource={vendorChartList}
                          renderItem={(item) => (
                            <>
                              <List.Item>
                                <Row
                                  style={{
                                    padding: 10,
                                    display: "flex",
                                    backgroundColor: "#fff",
                                    borderRadius: 10,
                                    borderBottom: "2px solid orange",
                                    width: "100%",
                                  }}
                                >
                                  <Col
                                    xs={24}
                                    xl={24}
                                    style={{
                                      fontSize: "120%",
                                      color: "#E86800",
                                    }}
                                  >
                                    <h3>{item.name}</h3>
                                    <hr
                                      style={{
                                        backgroundColor: "orange",
                                        height: 2,
                                        border: "none",
                                      }}
                                    />
                                  </Col>
                                  <Col xs={6} xl={6}>
                                  Ingredient ordered till now: <br />{" "}
                                    <h3>{item.Ingredient}</h3>
                                    {/* {item.usertype ? (
                                    <Tag color="green">ACITVE</Tag>
                                  ) : (
                                    <Tag color="red">DISABLED</Tag>
                                  )} */}
                                  </Col>
                                  <Col xs={6} xl={6}>
                                    Total Order cost <br />{" "}
                                    <h1>{item.cost}</h1>
                                  </Col>
                                  <Col xs={6} xl={6}>
                                  Total Purchases: <br />{" "}
                                    <h1>{item.totalPurchases}</h1>
                                    {/* {item.usertype ? (
                                    <Tag color="green">ACITVE</Tag>
                                  ) : (
                                    <Tag color="red">DISABLED</Tag>
                                  )} */}
                                  </Col>
                                  <Col xs={6} xl={6}>
                                  Verification status: <br />{" "}
                                    <h1>{item.verified}</h1>
                                  </Col>
                                </Row>
                              </List.Item>
                            </>
                          )}
                        />
                      </Card>

                        </Col>
                      </Row>
                    </Card>
                  </div>
                </Tabs.TabPane>
                <Tabs.TabPane tab="P&I Department" key="3">
                  <div></div>
                </Tabs.TabPane>
              </Tabs>
            </div>
          </ConfigProvider>
        </div>
      </div>
    </div>
  );
};

export default Report;