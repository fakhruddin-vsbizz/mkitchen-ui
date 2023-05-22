import React, { useEffect, useState } from 'react'
import { Button, Card, Col, Input, List, Row } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';

const IngredientList = ({ingredientItems, OnDelete, inventoryItems, handlePerAshkashChange, foodIndex}) => {

  const [newIngredientItems, setNewIngredientItems] = useState(ingredientItems);

  // const [inputValue, setInputValue] = useState(0)

  

    useEffect(()=>{
      const setIngredients = async () => {
        try {
          const data = await fetch("/api/cooking/ingredients", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              type: "get_food_ingridients",
              food_id: foodIndex,
            }),
          });
    
          if (data) {
            const res = await data.json();
            setNewIngredientItems(res.ingridient_data);
          }
        } catch (error) {
          console.log(error);
        }
      };
      setIngredients()

      return () => setNewIngredientItems([])
    },[foodIndex])

    const newOnDelete = (id) => {
      setNewIngredientItems((pervItem) =>
      pervItem.filter((item) => item.inventory_item_id !== id)
    );
      OnDelete(id)
    }

  return (
    <List
      size="small"
      style={{
        width: "100%",
        padding: 5,
        height: "30vh",
        overflowY: "scroll",
        overflowX: "hidden",
        backgroundColor: "#fff6ed",
      }}
      bordered
      dataSource={newIngredientItems}
      renderItem={(item, index) => (
        <List.Item
          style={{
            margin: 5,
            padding: 0,
            display: "flex",
            backgroundColor: "#fff",
            borderRadius: 10,
            borderBottom: "2px solid orange",
            width: "98%",
          }}
        >
          <Card
            style={{
              width: "100%",
              backgroundColor: "transparent",
              border: "none",
            }}
            title={
              <Row>
                <Col xs={12} xl={12}>
                  {item.ingredient_name}
                </Col>
                <Col xs={6} xl={6}>
                  <Button
                    type="primary"
                    onClick={() =>
                      newOnDelete(item.inventory_item_id)
                    }
                    shape="circle"
                    icon={<DeleteOutlined />}
                    style={{ margin: "0px 10px" }}
                    // size="large"
                  />
                </Col>
              </Row>
            }
            bordered={false}
          >
            <Row>
              <Col xs={12} xl={12}>
                Per Ashkhaas count
              </Col>
              <Col xs={12} xl={12}>
                <Row>
                  <Col xs={16} xl={16}>
                    <Input
                      type="number"
                      defaultValue={
                        item.perAshkash
                      }
                      onChange={(e) =>{
                        
                        handlePerAshkashChange(
                          e.target.value,
                          item.ingredient_name
                        )
                        
                      }
                      }
                      placeholder="Eg: 1200,200,etc.."
                    />
                  </Col>
                  <Col xs={8} xl={8}>
                    <label>
                      {inventoryItems.find(
                        (inv) =>
                          inv.ingridient_name ===
                          item.ingredient_name
                      )?.ingridient_measure_unit || "kg"}
                    </label>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Card>
        </List.Item>
      )}
    />
  )
}

export default IngredientList