const { getCollection } = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const signupUser = async (req, res) => {
  try {
    const { name, email, image, password } = req.body;
    const usersColl = await getCollection("users");
    let isSavedUser = await usersColl.findOne({ email });

    // checking if the user already exists
    if (isSavedUser) {
      return res.status(400).send({
        success: false,
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

    const tokenPayload = {
      name: user.name,
      email: user.email,
      role: user.role,
    };

    // generating a JWT token with the user's email and role as payload
    const accessToken = jwt.sign(
      tokenPayload,
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "30m" },
    );

    const refreshToken = jwt.sign(
      tokenPayload,
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" },
    );

    // setting the refresh token in an HTTP-only cookie for security
    res.cookie("refreshToken", refreshToken, {
      secure: true,
      httpOnly: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const { password: _, ...loggedUser } = user;

    console.log("user signed up successfully.");
    res.status(201).send({ success: true, user: loggedUser, accessToken });
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

    const tokenPayload = {
      name: user.name,
      email: user.email,
      role: user.role,
    };

    // generating a JWT token with the user's email and role as payload
    const accessToken = jwt.sign(
      tokenPayload,
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "30m" },
    );

    const refreshToken = jwt.sign(
      tokenPayload,
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" },
    );

    const { password: _, _id: __, ...loggedUser } = user;
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
      user: loggedUser,
      accessToken,
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

const refreshToken = async (req, res) => {
  try {
    // ১. ক্লায়েন্টের কুকি থেকে রিফ্রেশ টোকেনটি নেওয়া
    const cookies = req.cookies;
    if (!cookies?.refreshToken)
      return res
        .status(401)
        .json({ message: "Unauthorized: No refresh token" });

    const refreshToken = cookies.refreshToken;

    // ২. রিফ্রেশ টোকেনটি ভেরিফাই করা (এখানে রিফ্রেশ সিক্রেট ব্যবহার হচ্ছে)
    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, decoded) => {
      if (err)
        return res
          .status(403)
          .json({ message: "Forbidden: Invalid or expired refresh token" });

      // ৩. টোকেন ভ্যালিড হলে নতুন একটি পে-লোড তৈরি করা
      const tokenPayload = {
        name: decoded.name,
        email: decoded.email,
        role: decoded.role,
      };

      // ৪. নতুন একটি নতুন স্বল্পমেয়াদী Access Token জেনারেট করা
      const newAccessToken = jwt.sign(
        tokenPayload,
        process.env.JWT_ACCESS_SECRET,
        { expiresIn: "30m" },
      );

      // ৫. নতুন Access Token-টি রেসপন্স হিসেবে ফ্রন্টএন্ডে পাঠানো
      res.json({ accessToken: newAccessToken });
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { signupUser, loginUser, logoutUser, refreshToken };
