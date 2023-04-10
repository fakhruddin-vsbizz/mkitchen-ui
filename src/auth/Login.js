import React, { useState } from 'react'
import { Card } from 'antd'
import { UserOutlined, EyeTwoTone, EyeInvisibleOutlined } from '@ant-design/icons';
import { Input, Tooltip, Button, Row, Col, Alert, Radio, ConfigProvider } from 'antd';
import logo from '../res/img/logo.png'


const Login = () => {

  const [user, setUser] = useState(0)

  const getUserForLogin = (event) => {
    console.log(event.target.value);
    setUser(event.target.value);
  }

  return (
    <div style={{ backgroundColor: 'pink', height:'100%' }}>
      <Row>
        <Col xs={24} xl={12}>
          <img src={logo} width="300"></img>
          <br></br>
          <ConfigProvider
            theme={{
              components: {
                Radio: {
                  colorPrimary: '#8b0000',
                },
              },
            }}
          >
            <Radio.Group defaultValue={user} buttonStyle="solid" onChange={getUserForLogin}>
              <Radio.Button value={0}>Admin</Radio.Button>
              <Radio.Button value={1}>P&I</Radio.Button>
              <Radio.Button value={2}>Cooking</Radio.Button>
            </Radio.Group>
            <br></br>
            <br></br>
            <br></br>
          </ConfigProvider>
          
        </Col>
        <Col xs={24} xl={12} style={{ backgroundColor:'#8b0000', padding:'3%' }}>
          <Card bordered='true' style={{ width: '50%', border: '2px solid darkred' }}>
          <Alert
            message="Username or Password incorrect. Please retry again."
            type="warning"
            closable
          />
            <h3 className='ubuntu-font-class'>Login through proper credentials</h3>
            <hr></hr>
            <Input
              className='ubuntu-font-class'
              placeholder="Enter your username"
              prefix={<UserOutlined className="site-form-item-icon" />}
              style={{ width:'70%', marginTop:'3%' }}
            />
            <Input.Password
              placeholder="input password"
              iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
              style={{ width:'70%', marginTop:'3%' }}
            />
            <br></br>
            <br></br>
            <Button style={{ backgroundColor:'darkred', color:'white' }} className='ubuntu-font-class'>Login to MK Portal</Button>
          </Card>
        </Col>
      </Row>
        
        
    </div>
    
  )
}

export default Login