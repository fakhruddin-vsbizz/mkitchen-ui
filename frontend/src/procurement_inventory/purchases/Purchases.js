import React, { useState } from 'react'
import { Row, Col, List, Card, Input, DatePicker, Slider, InputNumber, Button } from 'antd';

const Purchases = () => {


    const data = [
        'Inventory',
        'Purchases',
        'Current Menu',
        'Vendors',
        'Damaged Goods',
    ];

    const inventory_grid = [
        {
            item_id:0,
            item_name:"Chicken Meat",
            total_quantity:720,
            unit:'KG'
        },
        {
            item_id:1,
            item_name:"Sunflower Oil",
            total_quantity:720,
            unit:'KG'
        },
        {
            item_id:2,
            item_name:"Cabbage",
            total_quantity:-70,
            unit:'KG'
        },
        {
            item_id:3,
            item_name:"Milk",
            total_quantity:720,
            unit:'L'
        },
        {
            item_id:4,
            item_name:"Everest Chicken Masala",
            total_quantity:720,
            unit:'Packets'
        }
    ]

    const [amtVal, setAmtVal] = useState(1);
    const [weightVal, setWeightVal] = useState(1);

    const showAmtVal = (newAmt) => {
        setAmtVal(newAmt);
    }

    const showWeightVal = (newWeight) => {
        setWeightVal(newWeight);
    }

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
                  Purchases
                </label>
                <hr></hr>
                <table style={{ width: '100%' }} cellPadding={20}>
                    <tr>
                        <td>Ingredient name:<br/><Input placeholder='Filter by name'></Input></td>
                        <td>Date of purchase:<br/><DatePicker></DatePicker></td>
                        <td>Total amount:<br/><Slider min={1} max={200} onChange={showAmtVal} value={amtVal}></Slider><br/><InputNumber value={amtVal} onChange={showAmtVal}></InputNumber></td>
                        <td>Weight:<br/><Slider min={1} max={5000} onChange={showWeightVal} value={weightVal}></Slider><br/><InputNumber value={weightVal} onChange={showWeightVal}></InputNumber></td>
                    </tr>
                    
                </table>
                <hr></hr>

                <label
                  style={{ fontSize: "180%" }}
                  className="dongle-font-class"
                >
                  Recent Purchases
                </label>
                <br/><br/>
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
                    dataSource={inventory_grid}
                    renderItem={(item) => (
                    <List.Item>
                        <Card>
                            <label><b>{item.item_name}</b></label>
                            <br/><br/>
                            Purchase quantity:<br/>
                            <label style={{ fontSize:'130%' }}>{item.total_quantity} {item.unit}</label>
                        </Card>
                    </List.Item>
                    )}
                />

                <br/><br/><br/>

                <label
                  style={{ fontSize: "180%" }}
                  className="dongle-font-class"
                >
                  Short-on ingredients
                </label>
                
                <br/><br/>
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
                    dataSource={inventory_grid}
                    renderItem={(item) => (
                    <List.Item>
                        <Card>
                            <label><b>{item.item_name}</b></label>
                            <br/><br/>
                            In Inventory:<br/>
                            <label>{item.total_quantity} {item.unit}</label>
                            <br/><br/>
                            <Button type='primary'>OPEN Purchase</Button>
                        </Card>
                    </List.Item>
                    )}
                />

            </Col>
        </Row>
    </div>
  )
}

export default Purchases