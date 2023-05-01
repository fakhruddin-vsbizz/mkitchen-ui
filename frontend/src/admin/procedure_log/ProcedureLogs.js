import { DatePicker } from 'antd'
import React from 'react'
import { Card, List, Row, Col } from 'antd'

const ProcedureLogs = () => {

    const mohalla_user_data = [
        {
            mohalla_user: 'Fakhri Mohalla',
            count: 240,
            total_daig_count: 12,
            total_weight: 2400,
            delivery_status: true,
            rating: 3,
            review: 'N/A'
        },
        {
            mohalla_user: 'Badshah Nagar',
            count: 240,
            total_daig_count: 12,
            total_weight: 2400,
            delivery_status: true,
            rating: 3,
            review: 'N/A'
        },
        {
            mohalla_user: 'Konark Pooram',
            count: 240,
            total_daig_count: 12,
            total_weight: 2400,
            delivery_status: false,
            rating: 3,
            review: 'N/A'
        },
        {
            mohalla_user: 'Hatimi Mohalla',
            count: 240,
            total_daig_count: 12,
            total_weight: 2400,
            delivery_status: false,
            rating: 3,
            review: 'N/A'
        },
        {
            mohalla_user: 'Taiyabi Mohalla',
            count: 240,
            total_daig_count: 12,
            total_weight: 2400,
            delivery_status: true,
            rating: 3,
            review: 'N/A'
        },
    ]


    const ingredients_inventory = [
        {
            ingredient_name: 'Goat Meat',
            required_amount: 1200,
            unit: 'KG',
            per_unit_price: 12,
            left_item: 200
        },
        {
            ingredient_name: 'Pudina Masala',
            required_amount: 200,
            unit: 'Packet',
            per_unit_price: 12,
            left_item: 200
        },
        {
            ingredient_name: 'Sunflower Oil',
            required_amount: 1200,
            unit: 'L',
            per_unit_price: 12,
            left_item: 200
        },
        {
            ingredient_name: 'Rawa',
            required_amount: 1200,
            unit: 'KG',
            per_unit_price: 12,
            left_item: 200
        },
        {
            ingredient_name: 'Govardhan Ghee',
            required_amount: 1200,
            unit: 'KG',
            per_unit_price: 12,
            left_item: 200
        },
        {
            ingredient_name: 'Moong Dal',
            required_amount: 3500,
            unit: 'KG',
            per_unit_price: 12,
            left_item: 200
        },
        {
            ingredient_name: 'Basmati Rice',
            required_amount: 3500,
            unit: 'KG',
            per_unit_price: 12,
            left_item: 500
        },
        {
            ingredient_name: 'Eggs',
            required_amount: 12,
            unit: 'Dozens',
            per_unit_price: 12,
            left_item: 0.5
        },
    ]

  return (
    <div>
        <Card style={{ padding:'1%', border:'1px solid grey' }} bordered={true}>
            <Row>
                <Col xs={12} xl={12} style={{ fontSize: '200%' }}>Process Log</Col>
                <Col xs={12} xl={12} style={{ textAlign:'right' }}>
                    Select date for showing history: &nbsp;&nbsp;&nbsp;<DatePicker></DatePicker>
                </Col>
            </Row>
        </Card>

        <br/><br/><br/>
        <Card style={{ width: '85%', marginLeft: '4%' }}>
            <label style={{ fontSize: '150%' }}><u>Menu Decision & Delivery</u></label>
            <br/><br/>
            <List
                bordered
                dataSource={mohalla_user_data}
                renderItem={(item) => (
                    <List.Item>
                        <Card style={{ width: '100%' }}>
                            <Row>
                                <Col xs={12} xl={6}>
                                    <label style={{ fontSize: '120%' }}><b>{item.mohalla_user}</b></label>
                                    </Col>
                                <Col xs={12} xl={6}>
                                    Total Daigs:<br/>
                                    <b>{item.total_daig_count}</b>
                                </Col>
                                <Col xs={12} xl={6}>
                                    Daigs weight (total):<br/>
                                    <b>{item.total_weight}</b>
                                </Col>
                                <Col xs={12} xl={6}>
                                    {item.delivery_status ? <div><i class="fa-solid fa-circle-check"></i> Delivered</div> : <div><i class="fa-regular fa-clock"></i> Pending</div>}
                                    <hr></hr>
                                    <i class="fa-solid fa-star"></i> &nbsp;&nbsp;&nbsp; {item.rating}/5
                                    <hr></hr>
                                </Col>
                            </Row>
                        </Card>
                    </List.Item>
                )}
            />
        </Card>

        <br/>
        <Card style={{ width: '85%', marginLeft: '4%' }}>
            <label style={{ fontSize: '150%' }}><u>Ingredients for the menu</u></label>
            <br/><br/>
            <br/>
            <List
                bordered
                dataSource={ingredients_inventory}
                renderItem={(item) => (
                    <List.Item>
                        <Card style={{ width: '100%' }}>
                            <Row>
                                <Col xs={12} xl={6}>
                                    <center>
                                        <label style={{ fontSize: '120%' }}>{item.ingredient_name}</label>
                                    </center>
                                    
                                </Col>
                                <Col xs={12} xl={6}>
                                    <center>
                                        Required Amount:<br/>
                                        <b>{item.required_amount} {item.unit}</b>
                                    </center>
                                    
                                </Col>
                                <Col xs={12} xl={6}>
                                    <center>
                                        Leftover amount:<br/>
                                        <b>{item.left_item} {item.unit}</b>
                                    </center>
                                    
                                </Col>
                                <Col xs={12} xl={6}>
                                    <center>
                                        <label style={{ fontSize: '120%' }}>Rs. {item.per_unit_price*item.required_amount}/-</label>
                                    </center>
                                </Col>

                            </Row>
                        </Card>
                    </List.Item>
                )}
            />
            <Card style={{ width: '100%' }}>
                <Row>
                    <Col xs={12} xl={6}>
                        <center><label style={{ fontSize: '150%' }}><b>Total</b></label></center>
                    </Col>
                    <Col xs={12} xl={6}></Col>
                    <Col xs={12} xl={6}></Col>
                    <Col xs={12} xl={6}>
                        <center>
                            <b style={{ fontSize: '150%' }}>Rs. 60000/-</b>
                        </center>
                    </Col>
                    
                </Row>
            </Card>
        </Card>


        


    </div>
  )
}

export default ProcedureLogs