const { ObjectId } = require("mongodb");
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

const getSingleCourse = async (req, res) => {
  const { id } = req.params;
  try {
    const coursesColl = getCollection("courses");
    const filter = new ObjectId(id.trim());
    const result = await coursesColl.findOne({ _id: filter });
    console.log(result);
    res.status(200).send(result);
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "internal server error during getting courses!",
      error: error.message,
    });
  }
};

const updateCourse = async (req, res) => {
  const { id } = req.params;
  try {
    if (!ObjectId.isValid(id)) {
      return res.status(400).send({
        message: "Object is invalid. Try with valid objectId.",
      });
    }

    const coursesColl = getCollection("courses");
    const updatedData = req.body;
    const filter = { _id: new ObjectId(id) };
    const updateDoc = {
      $set: updatedData,
    };
    const result = await coursesColl.updateOne(filter, updateDoc);

    if (result.matchedCount === 0) {
      return res.status(404).send({
        success: false,
        message: "No course found with this ID to update.",
      });
    }

    res.status(200).send(result);
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      error,
    });
  }
};

const deleteCourse = async (req, res) => {
  const { id } = req.params;
  try {
    const coursesColl = getCollection("courses");
    const filter = new ObjectId(id);
    const result = await coursesColl.deleteOne({ _id: filter });
    res.status(200).send(result);
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      error,
    });
  }
};

module.exports = {
  saveCourses,
  getCourses,
  getSingleCourse,
  deleteCourse,
  updateCourse,
};
