import React from 'react'
import { Row, Col, List, Tag, Divider, Calendar, Card, Button, AutoComplete, Modal, Tooltip, Input, Select, Space, Table } from 'antd'
import { InfoCircleOutlined } from '@ant-design/icons';
import { useState } from 'react';

const VerifyVendor = () => {

    const { Column, ColumnGroup } = Table;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newMohallaPopup, setNewMohallaPopup] = useState(false);


    const data = [
        'Menu',
        'Process History',
        'Vendor Management',
        'Reports',
    ];


    const all_verified_vendors = [
        {
          key: '1',
          vendor_name: 'V.K. General Store',
          date_created: '19-06-2022',
          id:'099089724383243'
        },
        {
          key: '2',
          vendor_name: 'Mohsin Sons and Co.',
          date_created: '19-06-2022',
          id:'099089724383243'
        },
        {
          key: '3',
          vendor_name: 'Turban Supermall',
          date_created: '19-06-2022',
          id:'099089724383243'
        },
    ];


    const mohalla_accounts = [
        {vendor_name:'G S Sons', date_created:'19-06-2021'},
        {vendor_name:'Brahma Sons and Co.', date_created:'19-06-2021'},
        {vendor_name:'V K General Store', date_created:'19-06-2021'},
        {vendor_name:'Badhshah General Store', date_created:'19-06-2021'},
    ];

    const vendorPurchaseList = [
        {
          vendor_name:'V.K. General store',
          created_on: '18-04-2021',
          opening_time: '9:00',
          closing_time: '18:30',
          address: "Kothrud, Pune, Maharashtra",
          approval_status: true
        },
        {
          vendor_name:'Bohra Stores',
          created_on: '18-04-2021',
          opening_time: '9:00',
          closing_time: '18:30',
          address: "Kothrud, Pune, Maharashtra",
          approval_status: false
        },
        {
          vendor_name:'Amul Butter',
          created_on: '18-04-2021',
          opening_time: '9:00',
          closing_time: '18:30',
          address: "Kothrud, Pune, Maharashtra",
          approval_status: true
        },
        {
          vendor_name:'Sunflower Oil',
          created_on: '18-04-2021',
          opening_time: '9:00',
          closing_time: '18:30',
          address: "Kothrud, Pune, Maharashtra",
          approval_status: false
        },
      ]


  return (
    <div>
        <Row>
            <Col xs={0} xl={4} style={{ padding:'1%' }}>
            <List
                bordered
                dataSource={data}
                renderItem={(item) => (
                    <List.Item>
                        {item}
                    </List.Item>
                    
                )}
            />
            </Col>
            <Col xs={24} xl={20} style={{ padding:'2%' }}>
                <Card style={{ padding:'1%', border:'1px solid grey' }} bordered={true}>
                    <Row>
                        <Col xs={12} xl={12} style={{ fontSize: '200%' }}>Verify Vendors</Col>
                        <Col xs={12} xl={12}>
                        </Col>
                    </Row>
                </Card>
                <br/><br/><br/>
                <Card>

                    <List
                    style={{ width: '100%' }}
                    bordered
                    dataSource={vendorPurchaseList}
                    renderItem={(item) => (
                        <List.Item>
                            <Row style={{ width: '100%', textAlign:'left' }}>
                                <Col xs={24} xl={24} style={{ fontSize: '150%' }}>{item.vendor_name}</Col>
                                <Col xs={8} xl={6}>Shop timings: <br/>{item.opening_time} to {item.closing_time}</Col>
                                <Col xs={8} xl={6}>Created on: <br/>Rs. {item.created_on}/-</Col>
                                <Col xs={8} xl={6}>Address: <br/>{item.address}</Col>
                                <Col xs={8} xl={6}>
                                    <Tag color={item.approval_status ? 'green' : 'orange'}>
                                        {item.is_paid ? 'PENDING' : 'VERIFIED'}
                                    </Tag>
                                    &nbsp;&nbsp;&nbsp;
                                    {!item.approval_status ? <Button>MARK VERIFIED</Button> : null}
                                    
                                </Col>
                            </Row>
                            </List.Item>
                        )}
                    />
                </Card>

            </Col>
        </Row>
    </div>
  )
}

export default VerifyVendor