const { getCollection } = require("../config/db");
const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");

const saveUser = async (req, res) => {
  try {
    const { name, email, role, image, createdAt, password } = req.body;
    const usersColl = getCollection("users");
    let isSavedUser = await usersColl.findOne({ email });
    if (isSavedUser) {
      return res.status(200).send({
        success: true,
        message: "User already exists, proceeding to login",
        insertedId: null,
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = {
      name,
      email,
      role,
      image,
      createdAt,
      password: hashedPassword,
    };
    const result = await usersColl.insertOne(user);
    res.status(201).send(result);
  } catch (error) {
    // ৬. error handling
    console.error("Database Insert Error:", error);
    res.status(500).send({
      success: false,
      message: "Internal Server Error during saving user",
      error: error.message,
    });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const usersColl = getCollection("users");
  try {
    // finding the user based on email
    const user = await usersColl.findOne({ email });
    if (!user) {
      return res.send({ message: "user not found" });
    }

    // checking the user by using bcrypt
    const isMatched = await bcrypt.compare(password, user.password);
    if (!isMatched) {
      return res.send({ message: "invalid credentials!" });
    }

    // creating a token
    const token = jwt.sign(
      { email: user.email, role: user.role },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1hr" },
    );

    // sending Response
    const { password: _, ...loggedUser } = user;
    res.status(200).send({
      success: true,
      message: "Login successful",
      token,
      user: loggedUser,
    });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
};

module.exports = { saveUser, loginUser };
