const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 4001;
const allowedOrigins = (process.env.FRONTEND_DOMAIN || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error("Origin is not allowed by CORS."));
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());

app.use("/api/v1", require("./routes/userRoute"));
app.get("/", (req, res) => res.send("Welcome to Smart Shopping"));

async function startServer() {
  try {
    await require("./database/connection").dbConnect();
    app.listen(port, () => console.log(`Smart Shopping API listening on port ${port}`));
  } catch (error) {
    console.error("Unable to start application:", error);
    process.exit(1);
  }
}

if (require.main === module) startServer();
module.exports = app;
