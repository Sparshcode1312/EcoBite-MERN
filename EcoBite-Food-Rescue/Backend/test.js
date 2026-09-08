require("dotenv").config();
const mongoose = require("mongoose");

console.log("URI:", process.env.MONGO_URI);

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected Successfully");
    process.exit(0);
  })
  .catch((err) => {
    console.log("❌ Connection Error:");
    console.log(err);
    process.exit(1);
  });