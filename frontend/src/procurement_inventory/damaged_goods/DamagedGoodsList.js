import React, { useState } from 'react'
import { List, Card, Row, Col, Slider, DatePicker, Tag, Button, Input, InputNumber, Select, Modal } from 'antd';

const DamagedGoodsList = () => {

    const vendorPurchaseList = [
        {
          ingredient_name:'Goat Meat',
          quantity_ordered: 130,
          period_post_exipry: 10,
          period: 'Days',
          created_on: '24-06-2023'
        },
        {
          ingredient_name:'Cabbage',
          quantity_ordered: 12,
          period_post_exipry: 40,
          period: 'Months',
          created_on: '24-06-2023'
        },
        {
          ingredient_name:'Amul Butter',
          quantity_ordered: 25,
          period_post_exipry: 25,
          period: 'Months',
          created_on: '24-06-2023'
        },
        {
          ingredient_name:'Sunflower Oil',
          quantity_ordered: 1,
          period_post_exipry: 100,
          period: 'Years',
          created_on: '24-06-2023'
        },
      ]
    
      const [inputValue, setInputValue] = useState(1);
      const [days, setDays] = useState(1);
    
      const onChange = (newValue) => {
        setInputValue(newValue);
      };

      const onChangeDayValue = (newValue) => {
        setDays(newValue);
      };

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


  return (
    <div>
        <Card style={{ padding:'1%', border:'1px solid grey' }} bordered={true}>
            <Row>
                <Col xs={12} xl={12} style={{ fontSize: '200%' }}>Expired Ingredients</Col>
                <Col xs={12} xl={12}>
                </Col>
            </Row>
        </Card>

        <br/><br/>
        <center>
          <Card style={{ width: '85%', textAlign: 'left' }}>
            <Row style={{ width: '100%' }}>
              <Col xs={12} xl={6}>
                Filter by Ingredients: <br/>
                <Input placeholder='Filter by ingredients. Eg: Chicken meat, Goat meat' style={{ width: '70%' }}></Input></Col>
              <Col xs={12} xl={6}>
                Date of Purchase: <br/>
                <DatePicker></DatePicker>
              </Col>
              <Col xs={12} xl={6}>
                Expiry Period: <br/>
                <Row>
                  <Col xs={6} xl={3}>
                    <InputNumber
                        min={1}
                        value={days}
                        onChange={onChangeDayValue}
                    ></InputNumber>
                  </Col>
                  <Col xs={6} xl={3}>
                    <Select
                            defaultValue={0}
                            options={[
                                { value: 0, label: 'Days' },
                                { value: 1, label: 'Months' },
                                { value: 2, label: 'Years' },
                            ]}
                        ></Select>
                  </Col>
                </Row>
                
              </Col>
              <Col xs={12} xl={6}>
                Price Range: <br/>
                <Row>
                  <Col xs={12} xl={12}>
                    <Slider
                      style={{ width: '70%' }}
                      min={1}
                      max={100000}
                      onChange={onChange}
                      value={typeof inputValue === 'number' ? inputValue : 0}
                    />
                  </Col>
                  <Col xs={12} xl={12}>
                    <InputNumber
                      min={1}
                      max={100000}
                      style={{ margin: '0 16px' }}
                      value={inputValue}
                      onChange={onChange}
                    />
                  </Col>
                </Row>
              </Col>
            </Row>
          </Card>
          <List
              style={{ width: '85%' }}
              bordered
              dataSource={vendorPurchaseList}
              renderItem={(item, idx) => (
                <List.Item>
                  <Row style={{ width: '100%', textAlign:'left' }}>
                      <Col xs={24} xl={24} style={{ fontSize: '150%' }}>{item.ingredient_name}</Col>
                      <Col xs={12} xl={6}>Fresh until: <br/>{item.period_post_exipry} {item.period}</Col>
                      <Col xs={12} xl={6}>Date of purchase: <br/>{item.created_on}</Col>
                      <Col xs={12} xl={6}>Days from expired date: <br/>{idx+1} days</Col>
                      <Col xs={12} xl={6}>
                          <Button type='primary' onClick={showModal}>TAKE ACTION</Button>
                      </Col>
                  </Row>
                </List.Item>
              )}
          />
          <Modal open={isModalOpen} onOk={handleOk} onCancel={handleCancel} footer={[]}>
            <label style={{ fontSize: '140%' }}>Unshelf this Item?</label>
            <br/><br/>
            Its been noted that its been over the specified expiry period. What action should we take for the ingredient stock here?
            <br/><br/><br/>
            <Row>
                <Col xs={12} xl={12}>
                    <Button type='primary'>KEEP IN INVENTORY</Button>
                </Col>
                <Col xs={12} xl={12}>
                <Button type='primary' danger>UNSHELF AND REMOVE AMOUNT</Button>
                </Col>
            </Row>
          </Modal>

        </center>
    </div>
  )
}

export default DamagedGoodsList