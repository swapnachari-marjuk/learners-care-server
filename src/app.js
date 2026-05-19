const express = require("express");
const cors = require("cors");

const userRouter = require("../src/routes/user.route");
const courseRouter = require("../src/routes/course.route");
const purchaseRouter = require("../src/routes/purchaseCourse.route");
const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());

app.use("/auth", userRouter);
app.use("/courses", courseRouter);
app.use("/enroll", purchaseRouter);

app.get("/", (req, res) => {
  res.send("Learners Care Server is Peeking! 👀");
});

module.exports = app;
