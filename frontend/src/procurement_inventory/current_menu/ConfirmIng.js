import React from 'react'
import { Row, Col, List, Input, Card, Button } from 'antd';


const ConfirmIng = () => {

    const data = [
        'Inventory',
        'Purchases',
        'Current Menu',
        'Vendors',
        'Damaged Goods',
    ];

    const ingredientForPurchase = [
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
                  Confirm Ingredient
                </label>
                <hr></hr>
                <List
                    size="small"
                    bordered
                    dataSource={ingredientForPurchase}
                    renderItem={(item) => 
                    <List.Item>
                        <div style={{ width: '100%', backgroundColor: item.total_quantity < 0 ? 'pink' : 'lightgreen', padding:'2%' }}>
                        <label style={{ fontSize: '140%' }}><u>{item.ingredient_name}</u></label>
                        <br/>
                        <Row>
                            <Col xs={12} xl={12}>
                                Search vendor: <br/>
                                <label style={{ fontSize: '120%' }}>{item.total_quantity} {item.unit}</label>
                            </Col>
                            <Col xs={12} xl={12}>
                                {item.total_quantity < 0 ? (<Button>MARK FULFILLED</Button>) : (<div><i class="fa-solid fa-circle-check"></i>&nbsp;&nbsp;&nbsp;FULFILLED THROUGH INVENTORY</div>)}
                                
                            </Col>
                        </Row>
                        </div>
                    </List.Item>}
                    />
                    <br/>
                    <br/>
                    <Button block type='primary' style={{ fontSize:'200%',height:'5%' }}>FINALIZE AND PUSH TO INVENTORY</Button>
            </Col>
        </Row>
    </div>
  )
}

export default ConfirmIng