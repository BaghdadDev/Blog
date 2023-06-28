const mongoose = require("mongoose");

const mongodbURL =
  process.env.NODE_ENV === "production"
    ? process.env.BLOG_MONGODB_URI_ATLAS
    : process.env.BLOG_MONGODB_URI_LOCAL;

async function connectToDatabase() {
  try {
    await mongoose.connect(mongodbURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Successful connecting to the database");
  } catch (error) {
    throw new Error(`Error connecting to Mongoose: ${error.message}`);
  }
}

module.exports = connectToDatabase;
