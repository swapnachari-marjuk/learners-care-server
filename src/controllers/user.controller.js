const { getCollection } = require("../config/db");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");

const signinUser = async (req, res) => {
  try {
    const { name, email, image, password } = req.body;
    const usersColl = await getCollection("users");
    let isSavedUser = await usersColl.findOne({ email });

    // checking if the user already exists
    if (isSavedUser) {
      return res.status(400).send({
        success: true,
        message: "User already exists, proceeding to login",
        insertedId: null,
      });
    }

    // hashing the password using bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = {
      name,
      email,
      role: "User",
      image,
      createdAt: new Date(),
      password: hashedPassword,
    };

    // inserting the user into the database
    const result = await usersColl.insertOne(user);
    console.log("user signed up successfully.");
    res.status(201).send(result);
  } catch (error) {
    // logging the error for debugging purposes
    console.error("Database Insert Error:", error);
    res.status(500).send({
      success: false,
      message: "An error occurred while signing up the user.",
      error: error.message,
    });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const usersColl = await getCollection("users");
  try {
    // finding the user by email
    const user = await usersColl.findOne({ email });
    if (!user) {
      return res.status(401).send({ message: "user not found" });
    }

    // comparing the provided password with the hashed password in the database
    const isMatched = await bcrypt.compare(password, user.password);
    if (!isMatched) {
      return res.status(401).send({ message: "invalid credentials!" });
    }

    const tokenPayload = { email: user.email, role: user.role };

    // generating a JWT token with the user's email and role as payload
    const accessToken = jwt.sign(
      tokenPayload,
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1h" },
    );

    const refreshToken = jwt.sign(
      tokenPayload,
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" },
    );

    const { password: _, ...loggedUser } = user;
    // setting the refresh token in an HTTP-only cookie for security
    res.cookie("refreshToken", refreshToken, {
      secure: true,
      httpOnly: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // sending the access token and user information in the response
    res.status(200).send({
      success: true,
      message: "Login successful",
      accessToken,
      user: loggedUser,
    });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
};

const logoutUser = (req, res) => {
  try {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    res.status(200).send({ success: true, message: "Logout successful" });
  } catch (error) {
    console.error("Logout Error:", error);
    res.status(500).send({ success: false, message: error.message });
  }
};

module.exports = { signinUser, loginUser, logoutUser };
