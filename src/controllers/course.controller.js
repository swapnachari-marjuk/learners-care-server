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

const getCourses = async (req, res) => {
  try {
    const coursesColl = getCollection("courses");
    const result = await coursesColl.find({}).toArray();
    res.status(200).send(result);
  } catch (err) {
    console.error(err);
    res.status(500).send({
      success: false,
      message: "internal server error during getting courses!",
      error: err.message,
    });
  }
};

module.exports = { saveCourses, getCourses };
