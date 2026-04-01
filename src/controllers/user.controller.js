const { getCollection } = require("../config/db");
const saveUser = async (req, res) => {
  try {
    const user = req.body;
    // console.log("Saving user to logic layer:", user);
    const usersColl = getCollection("users");
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
