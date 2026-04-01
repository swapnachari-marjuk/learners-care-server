const app = require("./app");
const { connectDB } = require("./config/db");
const port = process.env.PORT || 5000;

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    connectDB();

    app.listen(port, () => {
      console.log(`Learners Care Server is running on port ${port}`);
    });
  } catch (error) {
    console.log(error);
  }
}
run().catch(console.dir);
