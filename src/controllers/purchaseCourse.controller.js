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
      courseId: courseId,
    });

    if (alreadyPurchased) {
      return res.status(400).send({
        success: false,
        message: "You have already enrolled in this course!",
      });
    }

    // obj to save in db
    const newEnrollment = {
      userEmail,
      courseId,
      price: price || 0,
      transactionId: transactionId || "free",
      enrolledAt: new Date(),
      status: "completed",
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

const getMyCourses = async (req, res) => {
  const { email } = req.params;
  try {
    const purchaseColl = getCollection("purchased_courses");
    const pipeline = [
      { $match: { userEmail: email } },

      {
        $addFields: {
          courseIdObj: { $toObjectId: "$courseId" },
        },
      },

      {
        $lookup: {
          from: "courses", // কোন কালেকশন থেকে ডাটা আনবে
          localField: "courseIdObj", // কেনা কোর্সের কোন ফিল্ডটি ম্যাচ করবে
          foreignField: "_id", // মেইন কোর্স কালেকশনের কোন ফিল্ডের সাথে (অবশ্যই ObjectId হতে হবে)
          as: "courseDetails", // নতুন যে অ্যারেতে ডাটা জমা হবে
        },
      },
      
    ];
    const result = await purchaseColl.aggregate(pipeline).toArray();
    res.status(200).send(result);
  } catch (error) {
    res
      .status(500)
      .send({ success: false, message: error.message, error: error.message });
  }
};

const checkEnrollment = async (req, res) => {
  const { email, courseId } = req.query;
  try {
    const purchaseColl = getCollection("purchased_courses");
    const isEnrolled = await purchaseColl.findOne({
      userEmail: email,
      courseId: courseId,
    });
    res.status(200).send({ enrolled: !!isEnrolled, message: "enrolment" });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
};

module.exports = { enrollCourse, getMyCourses, checkEnrollment };
