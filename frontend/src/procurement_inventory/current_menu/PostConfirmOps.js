import React from 'react'
import { Row, Col, List, Input, Card, Button, Tag } from 'antd';


const PostConfirmOps = () => {

    const data = [
        'Inventory',
        'Purchases',
        'Current Menu',
        'Vendors',
        'Damaged Goods',
    ];

    const ingredientsToReorder = [
        {
            ingredient_name:'Chicken Masala',
            total_quantity: 1200,
            unit: 'KG'
        },
        {
            ingredient_name:'Chicken Meat',
            total_quantity: 1200,
            unit: 'KG'
        },
        {
            ingredient_name:'Basmati Rice',
            total_quantity: -1200,
            unit: 'KG'
        },
        {
            ingredient_name:'Jira',
            total_quantity: 1200,
            unit: 'KG'
        },
        {
            ingredient_name:'Wheat flour',
            total_quantity: -1200,
            unit: 'KG'
        },
        {
            ingredient_name:'Sunflower oil',
            total_quantity: -1200,
            unit: 'KG'
        },
        {
            ingredient_name:'Saffron',
            total_quantity: 1200,
            unit: 'KG'
        },
    ]

    const foodItem = [
        {
            food_item_id: 0,
            food_item_name: 'Mutton Biryani',
            status: 'COOKED'
        },
        {
            food_item_id: 0,
            food_item_name: 'Mutton Kebab',
            status: 'COOKING'
        },
        {
            food_item_id: 0,
            food_item_name: 'Daal Gosht',
            status: 'COOKED'
        },
        {
            food_item_id: 0,
            food_item_name: 'Manda',
            status: 'COOKED'
        },
        {
            food_item_id: 0,
            food_item_name: 'Malida',
            status: 'COOKING'
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
            <Col xs={24} xl={20} style={{ padding:'3%' }}>
                <label
                  style={{ fontSize: "300%" }}
                  className="dongle-font-class"
                >
                  Post-Procument Ops
                </label>
                <hr></hr>
                <br/>
                <label style={{ fontSize: '180%' }} className="dongle-font-class">Food Item Cooking Status</label>
                <List
                    grid={{
                    gutter: 16,
                    xs: 1,
                    sm: 2,
                    md: 4,
                    lg: 4,
                    xl: 6,
                    xxl: 3,
                    }}
                    dataSource={foodItem}
                    renderItem={(item) => (
                    <List.Item>
                        <Card title={item.food_item_name}>
                            Cooking Status: {item.status === 'COOKING' ? <Tag color="gold">Cooking</Tag> : <Tag color="green">Ready for Dispatch</Tag>}
                        </Card>
                    </List.Item>
                    )}
                />

                <br/><br/>
                <label style={{ fontSize: '180%' }} className="dongle-font-class">Re-order Logs</label>
                
                <List
                    bordered
                    dataSource={ingredientsToReorder}
                    renderItem={(item) => (
                        <List.Item>
                            <Card style={{ width: '100%' }}>
                                <Row>
                                    <Col xs={8} xl={8}>{item.ingredient_name}</Col>
                                    <Col xs={8} xl={8}>Required quantity: {item.total_quantity} {item.unit}</Col>
                                    <Col xs={8} xl={8}><Button type='primary'>
                                        FULLFILL ORDER</Button>
                                        <Tag color='green' style={{ display: 'none' }}>FULFILLED</Tag>
                                    </Col>
                                </Row>
                            </Card>
                        </List.Item>
                    )}
                />

            </Col>
        </Row>
    </div>
  )
}

export default PostConfirmOps
