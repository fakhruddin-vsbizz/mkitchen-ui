import React from 'react'
import { Row, Col, Select, List, Divider, Card, Button, AutoComplete, Input, Switch } from 'antd';
import { useState } from 'react';
import { RightSquareFilled } from '@ant-design/icons';


const Dispatch = () => {

    const data = [
        'Set Menu',
        'Cooking',
        'Dispatch',
    ];

    const food_item_list = [
        {
            food: 'Mutton Biryani',
            ingredient_list:  [],
            idx:1
        },
        {
            food: 'Mutton Kebab',
            ingredient_list:  [],
            idx:2
        },
        {
            food: 'Daal Gosht',
            ingredient_list:  [],
            idx:3
        },
        {
            food: 'Jira Masala',
            ingredient_list:  [],
            idx:4
        },
    ];


    const mohalla_list = [
        {
            mohalla_name: 'Fakhri Hills',
            idx:1
        },
        {
            mohalla_name: 'Memun Colony',
            idx:2
        },
        {
            mohalla_name: 'Konark Pooram',
            idx:3
        },
        {
            mohalla_name: 'Badshah Nagar',
            idx:4
        },
    ];

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
                            <p>
                                <label style={{ fontSize: '300%' }} className='dongle-font-class'>Dispatch</label>
                            </p>
                            
                            Select Client: &nbsp;&nbsp;&nbsp;
                            <Select
                                defaultValue={0}
                                style={{ width: '80%' }}
                                options={[{ value: 0, label: 'MK' },{ value: 1, label: 'Mohsin Ranapur' },{ value: 2, label: 'Shk. Aliasgar Ranapur' }]}
                            />
                            <Divider style={{ backgroundColor: '#000'}}></Divider>
                            <List
                                style={{ width: '100&' }}
                                itemLayout="horizontal"
                                dataSource={mohalla_list}
                                renderItem={(item, index) => (
                                <List.Item>
                                    {item.mohalla_name}
                                    <Button type="ghost" style={{ marginLeft:'30%' }}>
                                        <RightSquareFilled/>
                                    </Button>
                                </List.Item>
                                )}
                            />

                        </Col>
                        <Col xs={12} xl={12} style={{ padding:'3%' }}></Col>
                    </Row>
                    
                </Col>
                </Row>
    </div>
  )
}

export default Dispatch