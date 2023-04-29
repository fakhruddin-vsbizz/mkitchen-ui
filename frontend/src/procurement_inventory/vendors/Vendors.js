import React from 'react'
import { useState } from 'react'
import { Row, Col, List, Card, Tag, Button } from 'antd';

const Vendors = () => {

    const data = [
        'Inventory',
        'Purchases',
        'Current Menu',
        'Vendors',
        'Damaged Goods',
    ]

    const vendor_list = [
        {
            vendor_name: 'V.K. General store',
            active_purchases: 25,
            is_approved: true
        },
        {
            vendor_name: 'Hubric Stores',
            active_purchases: 12,
            is_approved: false
        },
        {
            vendor_name: 'Brahma General store',
            active_purchases: 100,
            is_approved: true
        },
        {
            vendor_name: 'Husaini Kirana store',
            active_purchases: 25,
            is_approved: false
        },
        {
            vendor_name: 'Supermarket store',
            active_purchases: 60,
            is_approved: true
        }
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
            <Col xs={24} xl={20} style={{ padding:'3%' }}>
                <Row>
                    <Col xs={12} xl={12}>
                        <label
                            style={{ fontSize: "300%" }}
                            className="dongle-font-class"
                        >
                            Vendors
                        </label>
                    </Col>
                    <Col xs={12} xl={12}>
                        <center>
                            <Button type='primary'>New Vendor</Button>
                        </center>
                    </Col>
                </Row>
                
                <hr></hr>
                <br/>
                <label style={{ fontSize: '200%' }} className='dongle-font-class'>All vendors</label>
                <List
                    grid={{
                    gutter: 16,
                    xs: 1,
                    sm: 2,
                    md: 4,
                    lg: 4,
                    xl: 4,
                    xxl: 3,
                    }}
                    dataSource={vendor_list}
                    renderItem={(item) => (
                    <List.Item>
                        <Card>
                            <label><b>{item.vendor_name}</b></label>
                            <br/><br/>
                            Purchase quantity:<br/>
                            <label style={{ fontSize:'130%' }}>{item.active_purchases}</label>
                            <br/><br/>
                            Approval Status: <br/><Tag color={item.is_approved ? 'green' : 'red'}>{item.is_approved ? 'Approved' : 'Pending'}</Tag>
                        </Card>
                    </List.Item>
                    )}
                />
                
                

            </Col>
        </Row>
    </div>
  )
}

export default Vendors