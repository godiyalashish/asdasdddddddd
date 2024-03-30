const http = require("http");
const app = require("./app.js");
const mongoose = require("mongoose");
const { ATLAS_PASSWORD, ATLAS_USERNAME } = require("./privates.js");
const MONGO_URL = `mongodb+srv://${ATLAS_USERNAME}:${ATLAS_PASSWORD}@cluster0.liy2xar.mongodb.net/?retryWrites=true&w=majority`;
// const Role = require("./models/Role.js");
// const User = require("./models/User.js");
// const bcrypt = require("bcrypt");

const port = process.env.PORT || 8000;

const server = http.createServer(app);

mongoose.connection.once("open", () => {
  console.log("db connected!!!!!!!!");
});

mongoose.connection.on("error", (err) => {
  console.error(err);
});

// async function createDefaultCreator() {
//   const hashedPassword = await bcrypt.hash("password", 10);
//   const defaultCreator = await User.findOne({
//     email: "default@mail.com",
//   });
//   const creator = await Role.findOne({
//     type: "CREATOR",
//   });
//   if (!defaultCreator) {
//     const newUser = new User({
//       email: "default@mail.com",
//       password: hashedPassword,
//       role: creator._id,
//       name: "default_creator",
//     });

//     await newUser.save();
//   }
// }


async function startServer() {
  await mongoose.connect(MONGO_URL);
  server.listen(port, () => {
    console.log(`listening to port ${port}.....`);
  });
}

startServer();
// createDefaultCreator();
