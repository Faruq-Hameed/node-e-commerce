const mongoose = require("mongoose");
require("dotenv").config({ path: "./.env" });

const URI = process.env.MONGODB_URL;

// creating and exporting db connection module
module.exports = async () => {
  return await mongoose
    .connect(URI)
    .then(() => {
      console.log(`connected to database successfully `);
    })
    .catch((err) => {
      console.log("error connecting to database:", err.message);
      process.exit(1);
    });
};
