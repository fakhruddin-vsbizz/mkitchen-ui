import React from 'react'
import { Card, Row, Col, Button, Input, TimePicker, Checkbox, Radio } from 'antd'

const VendorPurchase = () => {
  return (
    <div>
        <Card style={{ padding:'1%', border:'1px solid grey' }} bordered={true}>
            <Row>
                <Col xs={12} xl={12} style={{ fontSize: '200%' }}><i class="fa-solid fa-arrow-left"></i>&nbsp;&nbsp;&nbsp;Purchase List: V.K. Stores</Col>
                <Col xs={12} xl={12}>
                    <center><Button type='primary' danger>Cancel</Button></center>
                </Col>
            </Row>
        </Card>
    </div>
  )
}

export default VendorPurchase