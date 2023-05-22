const express = require("express");
const errorHandler = require("./middleware/errorHandler");
const connectDb = require("./config/dbConnection");
const dotenv = require("dotenv").config();
const CORS = require("cors");
const { menuHistory } = require("./controllers/menuHistory");
const path = require('path')
connectDb();

const app = express();
const port = process.env.PORT || 5001;

app.use(CORS());

app.use(express.json()); // body parser to parse the request of the client
app.use(express.static('./frontend/build'))

app.get('*', (req,res) => {
  res.status(200).sendFile(path.join(__dirname, "frontend/build", "index.html"))
});
//login and account management routes (adding all type of mk users and updating their details);

app.post("/api/menu/history", menuHistory);
app.use("/admin/account_management", require("./routes/mkUserRoutes"));
app.use("/login", require("./routes/loginRoute"));

app.use("/admin/menu", require("./routes/menuFoodRoute"));
app.use("/admin/reset_password", require("./routes/emailNotificationRoute"));

app.use("/cooking/ingredients", require("./routes/foodItemRoute"));
app.use("/cooking", require("./routes/cookingRoute"));

app.use("/inventory/addinventory", require("./routes/inventoryItemsRoute"));

app.use("/operation_pipeline", require("./routes/operationPipeLineRoute"));
app.use("/review", require("./routes/menuDeliveryReviewRoute"));

app.use("/vendor", require("./routes/vendorRoutes"));
app.use("/purchase", require("./routes/purchaseRoutes"));
app.use("/pai/procurement", require("./routes/procurementRoutes"));

// app.use("/api/contacts", require("./routes/contactRoutes"));
// app.use("/api/users", require("./routes/userRoutes"));
app.use(errorHandler);

app.listen(port, () => {
  console.log(`listning on ${port}`);
});
