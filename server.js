const express = require("express");
const cors = require("cors");
require("./db");

const app = express();

app.use(cors());
app.use(express.json());

// 🔥 THIS LINE IS NON-NEGOTIABLE
app.use("/students", require("./routes/students"));

app.get("/", (req, res) => {
  res.send("API running");
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
