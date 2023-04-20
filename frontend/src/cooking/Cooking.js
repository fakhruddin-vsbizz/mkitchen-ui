import React from 'react'
import { Row, Col, Select, List, Divider, Card, Button, AutoComplete, Input, Switch } from 'antd';
import { RightSquareFilled } from '@ant-design/icons';
import { useState } from 'react';

const Cooking = () => {

    const data = [
        'Set Menu',
        'Cooking',
        'Dispatch',
    ];


    const food_item_list = [
        {
            food: 'Mutton Biryani',
            ingredient_list:  [
                {ingredient_name:'Chicken Masala'},
                {ingredient_name:'Mughla Mutton Masala'},
                {ingredient_name:'Basmati Rice'},
            ],
            idx:1
        },
        {
            food: 'Mutton Kebab',
            ingredient_list:  [
                {ingredient_name:'Chicken Masala'},
                {ingredient_name:'Mughla Mutton Masala'},
                {ingredient_name:'Basmati Rice'},
            ],
            idx:2
        },
        {
            food: 'Daal Gosht',
            ingredient_list:  [
                {ingredient_name:'Chicken Masala'},
                {ingredient_name:'Mughla Mutton Masala'},
                {ingredient_name:'Basmati Rice'},
            ],
            idx:3
        },
        {
            food: 'Jira Masala',
            ingredient_list:  [
                {ingredient_name:'Chicken Masala'},
                {ingredient_name:'Mughla Mutton Masala'},
                {ingredient_name:'Basmati Rice'},
            ],
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
                            <label style={{ fontSize: '300%' }} className='dongle-font-class'>Cooking Operation</label>
                        </Col>
                        <Col xs={12} xl={12}>
                            Select the client:
                            <Select
                                defaultValue={0}
                                style={{ width: '100%' }}
                                options={[{ value: 0, label: 'MK' },{ value: 1, label: 'Mohsin Ranapur' },{ value: 2, label: 'Shk. Aliasgar Ranapur' }]}
                            />
                        </Col>
                    </Row>
                    <Divider style={{ backgroundColor: '#000'}}></Divider>
                    <List
                        style={{ width: '100&' }}
                        itemLayout="horizontal"
                        dataSource={food_item_list}
                        renderItem={(item, index) => (
                        <List.Item>
                            <Row>
                                <Col xs={8} xl={8}><label style={{ fontSize:"200%" }} className='dongle-font-class'>{item.food}</label></Col>
                                <Col xs={14} xl={14}>
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
                                        dataSource={item.ingredient_list}
                                        renderItem={(ing) => (
                                        <List.Item>
                                            <Card>
                                                <u>{ing.ingredient_name}</u>
                                                <br/>
                                                <Input placeholder='Eg: 1L, 12KG, etc'></Input>
                                                <br />
                                                <br />
                                                <Button
                                                    size="small"
                                                    type="primary"
                                                >
                                                    Re-order Item
                                                </Button>
                                            </Card>
                                        </List.Item>
                                        )}
                                    />
                                </Col>
                                <Col xs={2} xl={2} style={{ padding: '2%' }}>
                                    Cooked? &nbsp;&nbsp;&nbsp;<Switch />
                                </Col>
                            </Row>
                            
                        </List.Item>
                        )}
                    />
                </Col>
            </Row>
        </div>
    )
}

export default Cooking