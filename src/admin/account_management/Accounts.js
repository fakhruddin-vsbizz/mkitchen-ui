import React, { useState } from 'react'
import { Row, Col, List, Tag, Divider, Calendar, Card, Button, AutoComplete, Modal, Tooltip, Input } from 'antd'
import { InfoCircleOutlined } from '@ant-design/icons';
const Accounts = () => {

    const data = [
        'Menu',
        'Process History',
        'Vendor Management',
        'Reports',
    ];


    const mohalla_accounts = [
        {mohalla_name:'Fakhri Hills', is_active:true},
        {mohalla_name:'Brahma Avenue', is_active:true},
        {mohalla_name:'Natasha Enclave', is_active:false},
        {mohalla_name:'Badhshah Nagar', is_active:false},
    ];

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newMohallaPopup, setNewMohallaPopup] = useState(false);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const showNMModal = () => {
        setNewMohallaPopup(true);
    };




    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleNMOk = () => {
        setNewMohallaPopup(false);
    };




    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const handleNMCancel = () => {
        setNewMohallaPopup(false);
    };
    

    /*
        REFERENCE FOR BACKEND ENGINEERING
        -----------------------------------
        The variable 'options' below must come from the database and if the option isn't present must be added in automatic format'
    */
    const options = [
        { value: 'Mutton Biryani' },
        { value: 'Mutton Kebab' },
        { value: 'Moong Dal' },
        { value: 'Dal' },
        { value: 'Chawal' },
        { value: 'Palidu' },
        { value: 'Roti' },
        { value: 'Manda' },
        { value: 'Chicken Gravy' },
    ];

    const [foodItems, setFoodItems] = useState([]);
    
    const addFoodItem = () => {
        setFoodItems([...foodItems, document.getElementById('food-item-selected').value]);
        
    }

    const removeFoodItems = (subject) => {
        var old_food_item_list = foodItems;
        old_food_item_list.pop(old_food_item_list.indexOf(subject))
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
                <Col xs={24} xl={20} style={{ padding:'5%' }}>
                    <label style={{ fontSize: '300%' }} className='dongle-font-class'>Account Management</label>
                    <Divider style={{ backgroundColor: '#000'}}></Divider>
                    <Row>
                        <Col xs={12} xl={12}>
                            <label style={{ fontSize: '200%' }} className='dongle-font-class'>Mohalla Accounts</label>
                        </Col>
                        <Col xs={12} xl={12}>
                            <Button onClick={showNMModal}>Add New Mohalla</Button>
                        </Col>
                    </Row>

                    <Modal title="New Mohalla user" open={newMohallaPopup} onOk={handleNMOk} onCancel={handleNMCancel}>
                    <p>Add new account</p>
                        <table style={{ width:'100%' }}>
                            <tr>
                                <td>
                                    Name of the new Mohalla:
                                </td>
                                <td>
                                    <Input
                                        placeholder="Eg: Kalimi Mohalla, Noor Baug, etc"
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    Email of the mohalla user
                                </td>
                                <td>
                                    <Input
                                        placeholder="Eg: juzermakki@gmail.com, hakimburhan@hotmail.com., etc"
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td>New Password</td>
                                <td>
                                    <Input.Password
                                        placeholder='Initial password'
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td>Confirm Password</td>
                                <td>
                                    <Input.Password
                                        placeholder='Confirm initial password'
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={2}>
                                    <br/>
                                    <Button type='primary' block>Create new Mohalla Account</Button>
                                </td>
                            </tr>
                        </table>
                    </Modal>
                    
                    <br/><br/><br/>
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
                        dataSource={mohalla_accounts}
                        renderItem={(item) => (
                        <List.Item>
                            <Card title={item.mohalla_name}>
                                Status: {item.is_active ? <Tag color="green">ACITVE</Tag> : <Tag color="red">DISABLED</Tag>}
                                <br/><br/>
                                <Button size='small' type='primary' onClick={showModal}>Manage Account</Button>
                            </Card>
                        </List.Item>
                        )}
                    />
                    <Modal title="Account setting" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                        <p>Change Email</p>
                        <table style={{ width:'100%' }}>
                            <tr>
                                <td>
                                    <Input
                                        placeholder="Enter your username"
                                        suffix={
                                            <Tooltip title="Change only in case needed.">
                                            <InfoCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
                                            </Tooltip>
                                        }
                                    />
                                </td>
                                <td>
                                    <Button type='primary' danger>Change Email</Button>
                                </td>
                            </tr>
                        </table>
                        <Divider style={{ backgroundColor: '#000'}}></Divider>
                        <p>Reset Password</p>
                        <table style={{ width:'100%' }}>
                            <tr>
                                <td>
                                    New Password
                                </td>
                                <td>
                                    <Input.Password
                                        placeholder="New password to be set"
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td>Confirm Password</td>
                                <td>
                                    <Input.Password
                                        placeholder='Confirm new password'
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={2}>
                                    <br/>
                                    <Button type='primary' block danger>Change Password</Button>
                                </td>
                            </tr>
                        </table>
                    </Modal>
                    <Divider style={{ backgroundColor: '#000'}}></Divider>
                    <label style={{ fontSize: '200%' }} className='dongle-font-class'>Cooking Department</label>
                    <br/><br/><br/>
                    <Card
                        bordered={true}
                        style={{
                        width: '100%',
                        }}
                    >
                        <p><u>Change Email of Cooking Department</u></p>
                        <table style={{ width:'100%' }}>
                            <tr>
                                <td>
                                    <Input
                                        placeholder="Enter your username"
                                        suffix={
                                            <Tooltip title="Change only in case needed.">
                                            <InfoCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
                                            </Tooltip>
                                        }
                                    />
                                </td>
                                <td>
                                    <Button type='primary' danger>Change Email</Button>
                                </td>
                            </tr>
                        </table>
                    </Card>
                    <br/>
                    <Card
                        bordered={true}
                        style={{
                        width: '100%',
                        }}
                    >
                        <p><u>Reset Password of Cooking Department</u></p>
                        <table style={{ width:'100%' }}>
                            <tr>
                                <td>
                                    New Password
                                </td>
                                <td>
                                    <Input.Password
                                        placeholder="New password to be set"
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td>Confirm Password</td>
                                <td>
                                    <Input.Password
                                        placeholder='Confirm new password'
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td></td>
                                <td>
                                    <br/>
                                    <Button type='primary' danger>Change Password</Button>
                                </td>
                            </tr>
                        </table>
                    </Card>
                    <Divider style={{ backgroundColor: '#000'}}></Divider>
                    <label style={{ fontSize: '200%' }} className='dongle-font-class'>P&I Department</label>
                    <br/><br/><br/>
                    <Card
                        bordered={true}
                        style={{
                        width: '100%',
                        }}
                    >
                        <p><u>Change Email of P&I Department</u></p>
                        <table style={{ width:'100%' }}>
                            <tr>
                                <td>
                                    <Input
                                        placeholder="Enter your username"
                                        suffix={
                                            <Tooltip title="Change only in case needed.">
                                            <InfoCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
                                            </Tooltip>
                                        }
                                    />
                                </td>
                                <td>
                                    <Button type='primary' danger>Change Email</Button>
                                </td>
                            </tr>
                        </table>
                    </Card>
                    <br/>
                    <Card
                        bordered={true}
                        style={{
                        width: '100%',
                        }}
                    >
                        <p><u>Reset Password of P&I Department</u></p>
                        <table style={{ width:'100%' }}>
                            <tr>
                                <td>
                                    New Password
                                </td>
                                <td>
                                    <Input.Password
                                        placeholder="New password to be set"
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td>Confirm Password</td>
                                <td>
                                    <Input.Password
                                        placeholder='Confirm new password'
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td></td>
                                <td>
                                    <br/>
                                    <Button type='primary' danger>Change Password</Button>
                                </td>
                            </tr>
                        </table>
                    </Card>
                </Col>
            </Row>

            

        </div>
    )
    
}

export default Accounts