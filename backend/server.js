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

app.use("/adduser", require("./routes/mkUserRoutes"));
app.use("/login", require("./routes/loginRoute"));
app.use("/operation_pipeline", require("./routes/operationPipeLineRoute"));

app.use("/menu", require("./routes/menuFoodRoute"));
app.use("/ingridient", require("./routes/inventoryItemsRoute"));
app.use("/fooditem", require("./routes/foodItemRoute"));

app.use("/review", require("./routes/menuDeliveryReviewRoute"));

app.use("/vendor", require("./routes/vendorRoutes"));
app.use("/purchase", require("./routes/purchaseRoutes"));

// app.use("/api/contacts", require("./routes/contactRoutes"));
// app.use("/api/users", require("./routes/userRoutes"));
app.use(errorHandler);

app.listen(port, () => {
  console.log(`listning on ${port}`);
});
