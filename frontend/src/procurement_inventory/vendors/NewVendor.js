import React from 'react'
import { Card, Row, Col, Button, Input, TimePicker, Checkbox, Radio } from 'antd'

const NewVendor = () => {
  return (
    <div>
        <Card style={{ padding:'1%', border:'1px solid grey' }} bordered={true}>
            <Row>
                <Col xs={12} xl={12} style={{ fontSize: '200%' }}><i class="fa-solid fa-arrow-left"></i>&nbsp;&nbsp;&nbsp;New Vendor</Col>
                <Col xs={12} xl={12}>
                    <center><Button type='primary' danger>Cancel</Button></center>
                </Col>
            </Row>
        </Card>
        <div style={{ width: '80%', padding:'3%' }}>
            <Card style={{ border: '2px solid orange' }} className='dongle-font-class'>
                <label style={{ fontSize: '150%' }}>
                    <u>Vendor Details</u>
                </label>
                <br/>
                <table style={{ width: '100%', fontSize: '130%' }} cellPadding={20}>
                    <tr>
                        <td>
                            Vendor Name: <Input placeholder='Eg: VK General store, Brahma store, etc..'></Input>
                        </td>
                        <td>
                            Email: <Input placeholder='Eg: brahma@gmail.com, vkstore@hotmail.com, etc..'></Input>
                            
                        </td>
                    </tr>
                    <tr>
                        <td>
                            Address: <Input placeholder='Must include Street name, locality, city and country..'></Input>
                        </td>
                        <td>
                            <Row>
                                <Col xs={12} xl={12}>Opening time: <br/><TimePicker></TimePicker></Col>
                                <Col xs={12} xl={12}>Closing time: <br/><TimePicker></TimePicker>
                                </Col>
                            </Row>
                        </td>
                    </tr>
                    
                </table>
            </Card>
            


            <br/><br/>
            
            
            <Card style={{ border: '2px solid orange' }} className='dongle-font-class'>
                <label style={{ fontSize: '150%' }}>
                    <u>Availability</u>
                </label>
                <br/>
                
                <Radio.Group name="availability" defaultValue={0} className='dongle-font-class'>
                    <Row>
                        <Col xs={12} xl={12}>
                            <Radio value='everyday' style={{ fontSize: '130%' }}>Everyday</Radio>
                        </Col>
                        <Col xs={12} xl={12}>
                            <Radio value='Weekdays' style={{ fontSize: '130%' }}>Weekdays</Radio>
                            <br/>
                            <Row>                            
                                <Col xs={12} xl={8}><Checkbox>Monday</Checkbox></Col>
                                <Col xs={12} xl={8}><Checkbox>Tuesday</Checkbox></Col>
                                <Col xs={12} xl={8}><Checkbox>Wednesday</Checkbox></Col>
                                <Col xs={12} xl={8}><Checkbox>Thursday</Checkbox></Col>
                                <Col xs={12} xl={8}><Checkbox>Friday</Checkbox></Col>
                                <Col xs={12} xl={8}><Checkbox>Saturday</Checkbox></Col>
                                <Col xs={12} xl={8}><Checkbox>Sunday</Checkbox></Col>
                            </Row>
                        </Col>
                    </Row>
                </Radio.Group>
                        
            </Card>

            <br/><br/>

            <Button type='primary'> ADD VENDOR </Button>
        </div>
    </div>
  )
}

export default NewVendor