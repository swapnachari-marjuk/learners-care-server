const { getCollection } = require("../config/db");

const saveUser = async (req, res) => {
  try {
    const user = req.body;
    const usersColl = getCollection("users");
    let isSavedUser = await usersColl.findOne({ email: user.email });
    if (isSavedUser) {
      return res.status(200).send({
        success: true,
        message: "User already exists, proceeding to login",
        insertedId: null,
      });
    }
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

module.exports = { saveUser };
