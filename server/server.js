require("dotenv").config();

const express = require("express");
const connectDB = require("./config/db.config.js");
const cors = require("cors");
const app = express();
// app.use(
//   cors({
//     origin: "http://localhost:4200", //angular server
//   }),
// );
connectDB();
app.use(express.json());

//routing
const userRoute = require("./routes/user.route.js");
const authRoute = require("./routes/auth.route.js");
const productRoute = require("./routes/product.route.js");
const categoryRoute = require("./routes/category.route.js");
const subCategoryRoute = require("./routes/subCategory.route.js");
const cartRoute = require("./routes/cart.route.js");

app.use("/api/user/", userRoute);
app.use("/api/auth/", authRoute);
app.use("/api/product/", productRoute);
app.use("/api/category", categoryRoute);
app.use("/api/subCategory", subCategoryRoute);
app.use("/api/cart", cartRoute);

//listen
const PORT = process.env.PORT;
app.listen(PORT, (_) => console.log(`Server started at port: ${PORT}`));
