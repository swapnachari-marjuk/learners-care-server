const { getCollection } = require("../config/db");
const saveCourses = async (req, res) => {
  try {
    const courseData = req.body;
    const coursesColl = getCollection("courses");
    const result = await coursesColl.insertOne(courseData);

    res.status(201).send(result);
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Internal Server Error during saving course",
      error: error.message,
    });
  }
};

module.exports = { saveCourses };
