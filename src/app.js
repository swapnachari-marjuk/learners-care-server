const express = require("express");
const cors = require("cors");

const userRouter = require("../src/routes/user.route");
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/users", userRouter);

app.get("/", (req, res) => {
  res.send("Learners Care Server is Peeking! 👀");
});

module.exports = app;
