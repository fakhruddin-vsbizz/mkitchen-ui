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

//login and account management routes (adding all type of mk users and updating their details);

app.post("/api/menu/history", menuHistory);
app.use("/api/admin/account_management", require("./routes/mkUserRoutes"));
app.use("/api/login", require("./routes/loginRoute"));

app.use("/api/admin/menu", require("./routes/menuFoodRoute"));
app.use("/api/admin/reset_password", require("./routes/emailNotificationRoute"));

app.use("/api/cooking/ingredients", require("./routes/foodItemRoute"));
app.use("/api/cooking", require("./routes/cookingRoute"));

app.use("/api/inventory/addinventory", require("./routes/inventoryItemsRoute"));

app.use("/api/operation_pipeline", require("./routes/operationPipeLineRoute"));
app.use("/api/review", require("./routes/menuDeliveryReviewRoute"));

app.use("/api/vendor", require("./routes/vendorRoutes"));
app.use("/api/purchase", require("./routes/purchaseRoutes"));
app.use("/api/pai/procurement", require("./routes/procurementRoutes"));

app.use(express.static('./frontend/build'))

app.get('*', (req,res) => {
  res.status(200).sendFile(path.join(__dirname, "frontend/build", "index.html"))
});

// app.use("/api/contacts", require("./routes/contactRoutes"));
// app.use("/api/users", require("./routes/userRoutes"));
app.use(errorHandler);

app.listen(port, () => {
  console.log(`listning on ${port}`);
});
