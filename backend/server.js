const express = require("express");
const errorHandler = require("./middleware/errorHandler");
const connectDb = require("./config/dbConnection");
const dotenv = require("dotenv").config();
const CORS = require("cors");
connectDb();

const app = express();
const port = process.env.PORT || 5000;

app.use(CORS());

app.use(express.json()); // body parser to parse the request of the client

//login and account management routes (adding all type of mk users and updating their details);

app.use("/admin/account_management", require("./routes/mkUserRoutes"));
app.use("/login", require("./routes/loginRoute"));

app.use("/admin/menu", require("./routes/menuFoodRoute"));
app.use("/cooking/ingredients", require("./routes/foodItemRoute"));

app.use("/inventory/addinventory", require("./routes/inventoryItemsRoute"));

app.use("/operation_pipeline", require("./routes/operationPipeLineRoute"));
app.use("/review", require("./routes/menuDeliveryReviewRoute"));

app.use("/vendor", require("./routes/vendorRoutes"));
app.use("/purchase", require("./routes/purchaseRoutes"));

// app.use("/api/contacts", require("./routes/contactRoutes"));
// app.use("/api/users", require("./routes/userRoutes"));
app.use(errorHandler);

app.listen(port, () => {
  console.log(`listning on ${port}`);
});
