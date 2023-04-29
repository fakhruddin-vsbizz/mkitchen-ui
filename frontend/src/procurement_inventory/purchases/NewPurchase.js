import { Button, Card, Row, Col, Input, AutoComplete, List } from 'antd';
import { useState } from 'react';
import React from 'react'

const NewPurchase = () => {

  const inventoryItems = [
    {
      value:'Chicken Masala',
      id:0
    },
    {
      value:'Chicken Meat',
      id:1
    },
    {
      value:'Goat Meat',
      id:2
    },
    {
      value:'Cabbage',
      id:3
    }
  ]

  const [ingredientForPurchase, setIngredientForPurchase] = useState([]);

  const onAddIngredient = () => {
    var ingredient_added = {ingredient_name: document.getElementById('ingredient-item-selected').value};
    setIngredientForPurchase([...ingredientForPurchase, ingredient_added]);
  }

  return (
    <div>
        <Card style={{ padding:'1%', border:'1px solid grey' }} bordered={true}>
            <Row>
                <Col xs={12} xl={12} style={{ fontSize: '200%' }}><i class="fa-solid fa-arrow-left"></i>&nbsp;&nbsp;&nbsp;New Purchase</Col>
                <Col xs={12} xl={12}>
                    <center><Button type='primary' danger>Cancel Purchase</Button></center>
                </Col>
            </Row>
        </Card>
        <div style={{ width: '80%', padding:'3%' }} className='dongle-font-class'>
          <label style={{ fontSize: '150%' }}>
            Select the item
          </label>
          &nbsp;&nbsp;&nbsp;
          <AutoComplete
            id="ingredient-item-selected"
            style={{ width: "50%" }}
            options={inventoryItems}
            placeholder="Eg: Roti, Chawal, Daal, etc"
            filterOption={(inputValue, option) =>
              option.value
                .toUpperCase()
                .indexOf(inputValue.toUpperCase()) !== -1
            }
          />

          &nbsp;&nbsp;&nbsp;

          <Button type='primary' onClick={onAddIngredient}> Add to Cart</Button>
            <hr></hr>
            <List
              size="small"
              bordered
              dataSource={ingredientForPurchase}
              renderItem={(item) => 
              <List.Item>
                <Card>
                  <label style={{ fontSize: '160%' }}>{item.ingredient_name}</label>
                  <br/>
                  <Row>
                    <Col xs={12} xl={12}>Search vendor: <Input placeholder='Eg: VK General Store, Brahma Stores, etc'></Input></Col>
                    <Col xs={12} xl={12}>Price per KG: <Input placeholder='Eg: 2,3,15, etc'></Input></Col>
                    <Col xs={12} xl={12}><br/>Quantity ordered: <Input placeholder='Eg: 2,3,15, etc'></Input></Col>
                  </Row>
                </Card>
              </List.Item>}
            />

            <Button type='primary' block> FINALIZE AND ENTER PURCHASE</Button>

        </div>
    </div>
  )
}

export default NewPurchase