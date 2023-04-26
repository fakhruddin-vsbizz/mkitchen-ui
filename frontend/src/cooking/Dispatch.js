import React from 'react'
import { Row, Col, Select, List, Divider, Card, Button, AutoComplete, Input, Tag } from 'antd';
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
            mohalla_id:0,
            food_dispatch_log:[
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
                }
            ]  
        },
        {
            mohalla_id:1,
            food_dispatch_log:[
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
                }
            ]  
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
    

    const [mohallaID, setMohallaID] = useState(0);
    const [foodDispatchLog, setFoodDispatchLog] = useState(food_item_list.filter(function(item){
        return item.mohalla_id === mohallaID;
    }));

    console.log(food_item_list.filter(function(item){return item.mohalla_id === mohallaID;}))

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
                        <Col xs={12} xl={12} style={{ padding:'3%' }}>
                            <Card>
                                <label
                                    style={{ fontSize: "200%" }}
                                    className="dongle-font-class"
                                >
                                    Select the items
                                </label>
                                <hr></hr>
                                <List
                                    size="small"
                                    bordered
                                    dataSource={foodDispatchLog[0].food_dispatch_log}
                                    renderItem={(item, index) => (
                                        <List.Item>
                                            <Card title={item.food} bordered={false}>
                                                <Row>
                                                    <Col xs={12} xl={12}>
                                                        Number of Daigs:
                                                        <br/>
                                                        <Input placeholder='Eg: 2,3,etc'></Input>
                                                    </Col>
                                                    <Col xs={12} xl={12}>
                                                        Total Daig weight:
                                                        <br/>
                                                        <Input placeholder='Eg: 2,3,etc'></Input>
                                                    </Col>
                                                    <Col xs={12} xl={12}>
                                                        <Button type='primary'>DISPATCH</Button>
                                                    </Col>
                                                    <Col xs={12} xl={12}>
                                                        Confirm Delivery?
                                                    <Tag color="gold">PENDING</Tag>
                                                    </Col>
                                                </Row>
                                            </Card>
                                        </List.Item>
                                    )}
                                />
                                
                            </Card>
                        </Col>
                    </Row>
                    
                </Col>
                </Row>
    </div>
  )
}

export default Dispatch