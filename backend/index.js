const express = require('express')
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 4001;

const corsOptions = {
  origin: process.env.FRONTEND_DOMAIN, 
  methods: ["GET", "POST", "PUT"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

require("./database/connection").dbConnect();

const smartShopping=require("./routes/userRoute")
app.use("/api/v1",smartShopping);

app.get('/', (req, res) => {
  res.send('<h1 style="text-align:center">Welcome to Smart Shopping</h1>')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})