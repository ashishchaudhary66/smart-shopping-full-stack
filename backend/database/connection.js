const mongoose = require("mongoose");

exports.dbConnect = async () => {
  const connectionURL = process.env.MONGOOSE_URL;
  if (!connectionURL) throw new Error("MONGOOSE_URL is not configured.");
  await mongoose.connect(connectionURL);
  console.log("DB Connected Successfully!");
};
