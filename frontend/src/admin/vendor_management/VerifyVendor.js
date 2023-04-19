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


    const showModal = () => {
        setIsModalOpen(true);
    };

    const showNMModal = () => {
        setNewMohallaPopup(true);
    };




    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleNMOk = () => {
        setNewMohallaPopup(false);
    };




    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const handleNMCancel = () => {
        setNewMohallaPopup(false);
    };



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
            <Col xs={24} xl={20} style={{ padding:'5%' }}>
                <label style={{ fontSize: '300%' }} className='dongle-font-class'>Verify Suggested Vendors</label>
                <Divider style={{ backgroundColor: '#000'}}></Divider>
                <label style={{ fontSize: '200%' }} className='dongle-font-class'>Unverified Vendors</label>
                <br/><br/><br/>
                <List
                    grid={{
                    gutter: 16,
                    xs: 1,
                    sm: 2,
                    md: 4,
                    lg: 4,
                    xl: 3,
                    xxl: 3,
                    }}
                    dataSource={mohalla_accounts}
                    renderItem={(item) => (
                    <List.Item>
                        <Card title={item.vendor_name}>
                            With system from: {item.date_created}
                            <br/><br/>
                            <Button size='small' type='primary' onClick={showModal}>Verify Vendor</Button>
                        </Card>
                    </List.Item>
                    )}
                />
                <Modal title="Initiate Verification" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                    <p>Change Email</p>
                    <table style={{ width:'100%' }} className='dongle-font-class'>
                        <tr>
                            <td>
                                Address
                                <br/>
                                <label style={{ fontSize: '150%' }}>Opp. Sheetal Petrol Pump, Kondhwa</label>
                            </td>
                            <td>
                                Closing time
                                <br/>
                                <label style={{ fontSize: '150%' }}>18:30</label>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                Opening time
                                <br/>
                                <label style={{ fontSize: '150%' }}>9:30</label>
                            </td>
                            <td>
                                Availability
                                <br/>
                                <label style={{ fontSize: '150%' }}>Everyday</label>
                            </td>
                        </tr>
                    </table>
                </Modal>


                <Divider style={{ backgroundColor: '#000'}}></Divider>

                <label style={{ fontSize: '200%' }} className='dongle-font-class'>All Verified Vendors</label>
                <br/><br/><br/>

                <Table dataSource={all_verified_vendors}>
                    
                    <Column title="Vendor Name" dataIndex="vendor_name" key="age" />
                    <Column title="Created on" dataIndex="date_created" key="date_created" />
                    
                    <Column
                        title=""
                        key="action"
                        render={(_, record) => (
                            <Space size="middle">
                                <Button type='primary' danger>Delete Vendor</Button>
                            </Space>
                        )}
                    />
                </Table>

            </Col>
        </Row>
    </div>
  )
}

export default VerifyVendor