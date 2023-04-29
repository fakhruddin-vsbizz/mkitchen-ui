import React, { useState } from 'react'
import { Row, Col, List, Input, Slider, Button, Card, Modal, Radio } from 'antd';


const Inventory = () => {

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

    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const [value, setValue] = useState(1);

    const changeExpPeriod = (e) => {
        setValue(e.target.value);
        console.log(e.target.value);
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
                  Inventory
                </label>
                <hr></hr>
                <table style={{ width: '100%' }} cellPadding={20}>
                    <tr>
                        <td>
                            <Input placeholder='Filter by name...' style={{ width: '70%' }}></Input>
                        </td>
                        <td>
                            <Slider
                                min={1}
                                max={10000}
                            >
                            </Slider>
                        </td>
                        <td>
                            <Button type='primary' onClick={showModal}>+ ADD NEW ITEM</Button>
                            <Modal open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                                <label style={{ fontSize: '150%' }}>Add new Ingredient</label>
                                <br/><br/>
                                <table style={{ width: '100%' }}>
                                    <tr>
                                        <td>Name</td>
                                        <td><Input placeholder='Eg: Chicken Meat, Basmati Rice, etc'></Input></td>
                                    </tr>
                                    <tr>
                                        <td>Unit for measurement</td>
                                        <td><Input placeholder='Eg: 2,3,4, etc'></Input></td>
                                    </tr>
                                    <tr>
                                        <td>Expiry Period</td>
                                        <td>
                                            <Input placeholder='Eg: 12,24,36, etc'></Input>
                                            <Radio.Group onChange={changeExpPeriod} value={value}>
                                                <Radio value={1}>Days</Radio>
                                                <Radio value={2}>Months</Radio>
                                                <Radio value={3}>Year</Radio>
                                            </Radio.Group>
                                        </td>
                                    </tr>
                                </table>
                            </Modal>
                        </td>
                    </tr>
                </table>
                <hr></hr>
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
                        <Card style={{ backgroundColor: item.total_quantity < 0 ? 'lightpink' : 'lightgreen' }}>
                            <label style={{ fontSize:'200%' }}>{item.item_name}</label>
                            <br/><br/>
                            Quantity in total:<br/>
                            <label style={{ fontSize:'150%' }}><b>{item.total_quantity} {item.unit}</b></label>
                        </Card>
                    </List.Item>
                    )}
                />
            </Col>
        </Row>
    </div>
  )
}

export default Inventory