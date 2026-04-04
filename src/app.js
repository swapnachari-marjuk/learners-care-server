const express = require("express");
const cors = require("cors");

const userRouter = require("../src/routes/user.route");
const courseRouter = require("../src/routes/course.route");
const purchaseRouter = require("../src/routes/purchaseCourse.route");
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/users", userRouter);
app.use("/api/courses", courseRouter);
app.use("/api/enroll", purchaseRouter);

app.get("/", (req, res) => {
  res.send("Learners Care Server is Peeking! 👀");
});

module.exports = app;
