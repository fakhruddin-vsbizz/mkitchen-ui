import React from 'react'
import { Row, Col, Select, List, Divider, Card, Button, AutoComplete, Input  } from 'antd';
import { RightSquareFilled } from '@ant-design/icons';
import { useState } from 'react';

const SetMenu = () => {


    const data = [
        'Set Menu',
        'Cooking',
        'Dispatch',
    ];


    const food_item_list = [
        {
            food: 'Mutton Biryani',
            ingredient_list:  [],
            idx:1
        },
        {
            food: 'Mutton Kebab',
            ingredient_list:  [],
            idx:2
        },
        {
            food: 'Daal Gosht',
            ingredient_list:  [],
            idx:3
        },
        {
            food: 'Jira Masala',
            ingredient_list:  [],
            idx:4
        },
    ];



    const options = [
        { value: 'Chicken Meat' },
        { value: 'Everest Chilli Masala' },
        { value: 'California Almonds' },
        { value: 'California Pista' },
        { value: 'Basmati Rice' },
        { value: 'Mughlai Garam Masala' },
        { value: 'Saffron' },
        { value: 'Haldi' },
        { value: 'Goat Meat' },
    ];

    const [ingredientItems, setIngredientItems] = useState([]);
    const [foodIndex, setFoodIndex] = useState(1);
    const [foodIngredientMap, setFoodIngredientMap] = useState([]);

    const addIngredients = () => {
        var ingredient_item_obj = {ingredient_name:document.getElementById('ingredient-item-selected').value}
        setIngredientItems([...ingredientItems,ingredient_item_obj])
    }

    const setFoodReference = (idx) => {
        console.log(idx);
        setFoodIndex(idx);
    }


    const logIngredientForFood = () => {
        
        var food_ing_map_obj = {}
        food_ing_map_obj[foodIndex] = ingredientItems
        console.log(food_ing_map_obj);
        setFoodIngredientMap([...foodIngredientMap, food_ing_map_obj]);
        console.log(foodIngredientMap);
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
            <Row>
                <Col xs={12} xl={12}>
                    <p>
                        <label style={{ fontSize: '300%' }} className='dongle-font-class'>Set Ingredients</label>
                    </p>
                    <p>
                        <label style={{ fontSize: '150%' }} className='dongle-font-class'>8000 Ashkhaas</label>
                    </p>
                    
                    Select Client: &nbsp;&nbsp;&nbsp;
                    <Select
                        defaultValue={0}
                        style={{ width: '80%' }}
                        options={[{ value: 0, label: 'MK' },{ value: 1, label: 'Mohsin Ranapur' },{ value: 2, label: 'Shk. Aliasgar Ranapur' }]}
                    />
                    <Divider style={{ backgroundColor: '#000'}}></Divider>
                    <List
                        style={{ width: '100&' }}
                        itemLayout="horizontal"
                        dataSource={food_item_list}
                        renderItem={(item, index) => (
                        <List.Item>
                            {item.food}
                            <Button type="ghost" style={{ marginLeft:'30%' }} id={"set_index_"+item.idx} onClick={()=>setFoodReference(item.idx)}>
                                <RightSquareFilled/>
                            </Button>
                        </List.Item>
                        )}
                    />

                </Col>
                <Col xs={12} xl={12} style={{ padding:'3%' }}>
                    <Card>
                        <label style={{ fontSize: '200%' }} className='dongle-font-class'>Select the items</label>
                        <hr></hr>
                        Select the ingredients to add: 
                        <Row>
                            <Col xs={18} xl={18}>
                                <AutoComplete
                                    id="ingredient-item-selected"
                                    style={{ width: '100%' }}
                                    options={options}
                                    placeholder="Eg: Roti, Chawal, Daal, etc"
                                    filterOption={(inputValue, option) =>
                                        option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                                    }
                                />
                            </Col>
                            <Col xs={6} xl={6}>
                                <Button type="secondary" size="small" onClick={addIngredients}><i class="fa-solid fa-circle-plus"></i></Button>
                            </Col>
                        </Row>
                        <Divider></Divider>
                        <List
                            size="small"
                            bordered
                            dataSource={ingredientItems}
                            renderItem={(item) => 
                            <List.Item>
                                <Card title={item.ingredient_name} bordered={false}>
                                    <Row>
                                        <Col xs={12} xl={12}>Per Ashkhaas count</Col>
                                        <Col xs={12} xl={12}><Input placeholder='Eg: 1200,200,etc..'></Input></Col>
                                    </Row>
                                </Card>
                            </List.Item>}
                        />

                    </Card>
                    <Button block type='primary' onClick={logIngredientForFood}>Add to Menu</Button>
                </Col>
            </Row>
            </Col>
        </Row>
    </div>
  )
}

export default SetMenu