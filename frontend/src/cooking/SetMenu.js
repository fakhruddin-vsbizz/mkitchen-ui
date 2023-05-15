import React, { useEffect } from "react";
import {
  Row,
  Col,
  Select,
  List,
  Divider,
  Card,
  Button,
  AutoComplete,
  Input,
  Modal,
  DatePicker,
  ConfigProvider,
  Alert,
} from "antd";
import {
	CaretRightOutlined,
	DeleteOutlined,
	PlusOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import Header from "../components/navigation/Header";
import Sidebar from "../components/navigation/SideNav";
import DeshboardBg from "../res/img/DeshboardBg.png";

const SetMenu = () => {
	const [getFoodList, setGetFoodList] = useState();
	const [getMkUserId, setGetMkUserId] = useState();
	//date filter
	const [selectedDate, setSelectedDate] = useState(
		`${
			new Date().getMonth() + 1
		}/${new Date().getDate()}/${new Date().getFullYear()}`
	);

	const [ingredientItems, setIngredientItems] = useState([]);
	const [inventoryItems, setInventoryItems] = useState([]);
	const [inventoryItemId, setInventoryItemId] = useState([]);
	const [allIngridients, setAllIngridients] = useState([]);
	const [isSelected, setIsSelected] = useState(false);

	const [ingredientName, setIngredientName] = useState("");

	const [menuFoodId, setMenuFoodId] = useState();

	const [visible, setVisible] = useState(false);
	const [updateAshkash, setUpdateAshkash] = useState(false);
	const [AshkhaasCount, setAshkhaasCount] = useState(0);

	const [foodIndex, setFoodIndex] = useState();
	const [foodIngredientMap, setFoodIngredientMap] = useState([]);
	const [validationError, setValidationError] = useState(false);


    const [status, setStatus] = useState();

	const OnDelete = id => {
		setIngredientItems(pervItem =>
			pervItem.filter(item => item.inventory_item_id !== id)
		);
	};

	useEffect(() => {
		const getTotalAshkhaas = async () => {
			await fetch("http://localhost:5001/admin/menu", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					add_type: "get_mohalla_ashkash",
					date: selectedDate,
					client_name: "mk admin",
				}),
			})
				.then(res => res.json())
				.then(data => {
					console.log("Ashkhaas count", data.totalAshkhaas);
					setAshkhaasCount(data.total_ashkhaas);
				})
				.catch(err => console.log(err));
		};
		getTotalAshkhaas();
	}, [selectedDate]);

	useEffect(() => {
		const getFood = async () => {
			const data = await fetch("http://localhost:5001/cooking/ingredients", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					type: "get_user_id",
					client_name: "mk admin",
				}),
			});
			if (data) {
				const res = await data.json();
				setGetMkUserId(res.user);
			}
		};
		getFood();
	}, []);

	useEffect(() => {
		const getFood = async () => {
			if (getMkUserId) {
				const data = await fetch("http://localhost:5001/cooking/ingredients", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						type: "get_food_Item",
						mkuser_id: getMkUserId,
						date: selectedDate,
					}),
				});
				
				if (data) {
		          const res = await data.json();
		          console.log(res);
		          if (res[0]) {
		            setMenuFoodId(res[0]._id);
		            setGetFoodList(res[0].food_list);
		            setIngredientItems([]);
		            setStatus(res.status);
		          } else {
		            console.log("here");
		            setGetFoodList([]);
		            setIngredientItems([]);
		            setStatus(0);
		          }
		        }
			}
		};
		getFood();
	}, [getMkUserId, selectedDate]);

	console.log("food list for menu: ", getFoodList);
	console.log("food menu id: ", menuFoodId);

	const data = ["Set Menu", "Cooking", "Dispatch"];

	console.log(getFoodList);
	console.log("id: ", inventoryItemId);

	useEffect(() => {
		const getInventory = async () => {
			try {
				console.log("inside");
				const data = await fetch("http://localhost:5001/cooking/ingredients", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						type: "get_inventory_ingridients",
					}),
				});

				if (data) {
					const res = await data.json();
					if (res) {
						setInventoryItems(res);
					}
				}
			} catch (error) {
				console.log(error);
			}
		};
		getInventory();
	}, []);

	console.log(inventoryItems);

	const addIngredients = () => {
		
		
		if (ingredientName === "") {
      console.log("here ");
      setValidationError(true);
    } else {
      const newIngredient = {
			inventory_item_id: inventoryItemId,
			ingredient_name: ingredientName,
			perAshkash: 0, // set initial perAshkash value as empty string
		};
      setIngredientItems(prevState =>
			prevState === undefined ? [newIngredient] : [...prevState, newIngredient]
		);
		setUpdateAshkash(true);
    }

		
	};

	const handlePerAshkashChange = (value, ingredientName) => {
		const updatedIngredients = ingredientItems.map(ingredient => {
			if (ingredient.ingredient_name === ingredientName) {
				// if the ingredient name matches, update its perAshkash value
				return {
					...ingredient,
					perAshkash: +value,
				};
			}
			return ingredient; // return the unchanged ingredient object
		});
		setIngredientItems(updatedIngredients);
		setUpdateAshkash(true);
	};

	console.log("food id: ", foodIndex);

	const setFoodReference = async idx => {
		try {
			console.log("inside");
			const data = await fetch("http://localhost:5001/cooking/ingredients", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					type: "get_food_ingridients",
					food_id: idx,
				}),
			});

			if (data) {
				const res = await data.json();

				setIngredientItems(res.ingridient_data);
			}
		} catch (error) {
			console.log(error);
		}
		setFoodIndex(idx);
	};

	const updateOperationPipeliinIngridient = async () => {
		try {
			const data = await fetch("http://localhost:5001/cooking/ingredients", {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					type: "update_operation_pipeline_ingridient_list",
					menu_id: menuFoodId,
					ingridient_list: allIngridients,
					status: 1,
				}),
			});

			if (data) {
				console.log(data);
				const res = await data.json();
				setAllIngridients([]);
				setVisible(true);
				setFoodIndex("");
				setIngredientItems([]);
			}
		} catch (error) {
			console.log(error);
		}
	};

	const logIngredientForFood = async () => {
		const foodIngMapObj = { ingridients: ingredientItems };
		setFoodIngredientMap([...foodIngredientMap, foodIngMapObj]);

		if (foodIndex) {
			try {
				const data = await fetch("http://localhost:5001/cooking/ingredients", {
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						type: "update_food_ingridient",
						food_id: foodIndex,
						ingridient_list: ingredientItems,
					}),
				});

				if (data) {
					console.log(data);
					const res = await data.json();
					setAllIngridients([...allIngridients, ...ingredientItems]);
					setVisible(true);
					setFoodIndex("");
					setIngredientItems([]);
				}
			} catch (error) {
				console.log(error);
			}
		}
	};

	const handleSelect = (value, option) => {
		console.log("value", value);
		setInventoryItemId(option.id);
		setIngredientName(value);
	};

	const handleDateChange = date => {
		console.log(date);
		const dateObj = new Date(date);
		const formattedDate = `${
			dateObj.getMonth() + 1
		}/${dateObj.getDate()}/${dateObj.getFullYear()}`;
		setSelectedDate(formattedDate);
		setIsSelected(false);
	};

	console.log(selectedDate);

	return (
		<div
			style={{ margin: 0, padding: 0, backgroundImage: `url(${DeshboardBg})` }}>
			<Modal
				visible={visible}
				onOk={() => setVisible(false)}
				onCancel={() => setVisible(false)}
				footer={[
					<Button key="ok" type="primary" onClick={() => setVisible(false)}>
						OK
					</Button>,
				]}>
				<div style={{ textAlign: "center" }}>
					<h2 style={{ color: "#52c41a" }}>Success!</h2>
					<p>Ingridient Added Successfully</p>
				</div>
			</Modal>
			<ConfigProvider
				theme={{
					token: {
						colorPrimary: "orange",
					},
				}}>
				<div style={{ display: "flex" }}>
					<Sidebar k="1" userType="cooking" />

					<div style={{ width: "100%" }}>
						<Header
							title="Set Ingredients"
							comp={
								<Row>
									<Col style={{ marginRight: 10, fontSize: 18 }}>
										Select date for showing history:{" "}
									</Col>
									<Col>
										<DatePicker onChange={handleDateChange} />
									</Col>
								</Row>
							}
						/>
						<div style={{ padding: 20 }}>
							<Row>
								<Col xs={24} xl={24} style={{ padding: "0px 50px" }}>
									<h3 style={{ color: "#e08003" }}>
										Total count: {AshkhaasCount} People
									</h3>
									{/* Select Client: &nbsp;&nbsp;&nbsp;
                  <Select
                    defaultValue={0}
                    size="large"
                    style={{ width: "100%" }}
                    options={[
                      { value: 0, label: "MK" },
                      { value: 1, label: "Mohsin Ranapur" },
                      { value: 2, label: "Shk. Aliasgar Ranapur" },
                    ]}
                  /> */}
								</Col>
								<Col xs={24} xl={12} style={{ padding: "1%" }}>
								{status >= 1 && (
			                        <Alert
			                          message="Message"
			                          description="Ingridient Items have already added"
			                          type="success"
			                          closable
			                        />
				                  )}
									{/* <Divider style={{ backgroundColor: "#000" }}></Divider> */}
									{getFoodList && (
										<List
											style={{ width: "100&" }}
											itemLayout="horizontal"
											dataSource={getFoodList}
											renderItem={(item, index) => (
												<List.Item>
													<Card
														style={{
															width: "100%",
															backgroundColor: "transparent",
															border: "none",
														}}>
														<Row
															style={{
																padding: 20,
																display: "flex",
																backgroundColor: "#fff",
																borderRadius: 10,
																borderBottom: "2px solid orange",
																width: "100%",
															}}>
															<Col xs={16} xl={16}>
																Food Name:
																<br />
																<label style={{ fontSize: "125%" }}>
																	{item.food_name}
																</label>
															</Col>
															<Col xs={8} xl={8}>
																<Button
																	type="primary"
																	id={"set_index_" + item.food_item_id}
																	onClick={() => {
																		setFoodReference(item.food_item_id);
																		setIsSelected(true);
																	}}
																	shape="circle"
																	icon={<CaretRightOutlined />}
																	size="large"
																/>
															</Col>
														</Row>
													</Card>
												</List.Item>
											)}
										/>
									)}
								</Col>
								<Col xs={24} xl={12} style={{ padding: "1% 3%" }}>
									<Card
										style={{
											width: "100%",
											backgroundColor: "white",
											border: "none",
										}}>
										<label
											style={{ fontSize: "200%", color: "#e08003" }}
											className="dongle-font-class">
											Select the items
										</label>
										<hr></hr>
										<span style={{ fontSize: 16, color: "#e08003" }}>
											Select the ingredients to add:
										</span>
										<Row
											style={{
												padding: 5,
												display: "flex",
												width: "100%",
											}}>
											{inventoryItems && (
												<Col xs={18} xl={18}>
													<AutoComplete
														id="ingredient-item-selected"
														style={{ width: "100%" }}
														options={inventoryItems.map(item => ({
															value: item.ingridient_name,
															id: item._id,
														}))}
														value={ingredientName}
														onChange={value => setIngredientName(value)}
														onSelect={handleSelect}
														placeholder="Eg: Roti, Chawal, Daal, etc"
														filterOption={(inputValue, option) =>
															option.value
																.toUpperCase()
																.indexOf(inputValue.toUpperCase()) !== -1
														}
													/>
												</Col>
											)}
											<Col xs={6} xl={6}>
												<Button
													type="primary"
													onClick={addIngredients}
													shape="circle"
													icon={<PlusOutlined />}
													style={{ margin: "0px 10px" }}
													// size="large"
												/>
											</Col>
										</Row>
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
											dataSource={ingredientItems}
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
													}}>
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
																			OnDelete(item.inventory_item_id)
																		}
																		shape="circle"
																		icon={<DeleteOutlined />}
																		style={{ margin: "0px 10px" }}
																		// size="large"
																	/>
																</Col>
															</Row>
														}
														bordered={false}>
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
																				ingredientItems && item.perAshkash
																			}
																			onChange={e =>
																				handlePerAshkashChange(
																					e.target.value,
																					item.ingredient_name
																				)
																			}
																			placeholder="Eg: 1200,200,etc.."
																		/>
																	</Col>
																	<Col xs={8} xl={8}>
																		<label>
																			{inventoryItems.find(
																				inv =>
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
										{status < 1 && (
					                      <Button
					                        block
					                        type="primary"
					                        style={{ marginTop: 10 }}
					                        onClick={logIngredientForFood}
					                      >
					                        Confirm Menu
					                      </Button>
					                    )}
									</Card>
								</Col>
							</Row>
						</div>
						<center>
						{status < 1 && (
			                <Button
			                  block
								style={{
									width: "90%",
									height: 80,
									fontSize: 18,
									backgroundColor: "#e08003",
								}}
								type="primary"
								onClick={updateOperationPipeliinIngridient}
			                >
			                  Push to inventory
			                </Button>
			              )}
						</center>
					</div>
				</div>
			</ConfigProvider>
		</div>
	);
};

export default SetMenu;
