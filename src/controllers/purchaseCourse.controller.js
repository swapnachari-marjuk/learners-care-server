// const { ObjectId } = require("mongodb");
const { getCollection } = require("../config/db");

const enrollCourse = async (req, res) => {
  try {
    const enrollmentData = req.body; 
    const { userEmail, courseId, transactionId, price } = enrollmentData;

    const purchaseColl = getCollection("purchased_courses");

    // checking if the user enrolled
    const alreadyPurchased = await purchaseColl.findOne({ 
      userEmail: userEmail, 
      courseId: courseId 
    });

    if (alreadyPurchased) {
      return res.status(400).send({ 
        success: false, 
        message: "You have already enrolled in this course!" 
      });
    }

    // obj to save in db
    const newEnrollment = {
      userEmail,
      courseId,
      price: price || 0, 
      transactionId: transactionId || "free", 
      enrolledAt: new Date(),
      status: "completed"
    };

    const result = await purchaseColl.insertOne(newEnrollment);
    res.status(201).send(result);

  } catch (error) {
    console.error("Enrollment Error:", error);
    res.status(500).send({
      success: false,
      message: "Internal Server Error during enrollment",
      error: error.message,
    });
  }
};




module.exports = { enrollCourse };
