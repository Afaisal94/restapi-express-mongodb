const express = require("express");
const app = express();
const mongoose = require("mongoose");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const PORT = process.env.PORT || 5000;
const DB_CONNECTION =
  process.env.DB_CONNECTION || "mongodb://localhost:27017/db_shop";

app.use(morgan("tiny"));
app.use(express.static("uploads"));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Import Routes
const authRoutes = require("./routes/auth");
const categoryRoutes = require("./routes/category");
const productRoutes = require("./routes/product");

app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.use("/auth", authRoutes);
app.use("/categories", categoryRoutes);
app.use("/products", productRoutes);

// Connect DB
mongoose.connect(DB_CONNECTION, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});
let db = mongoose.connection;

db.on("error", console.error.bind(console, "Database connection failed"));
db.once("open", () => {
  console.log("Database connection successful");
});
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
