// const { default: mongoose } = require("mongoose")

// const ConnectDB = async () => {

//     await mongoose.connect(process.env.DBURI)
//     .then(()=>{console.log("Connected to DB.....")})
//     .catch(()=>{console.log("Connection Failed.....")})

// }


// module.exports = ConnectDB
// .catch((err) => {
//   console.log("Connection Failed.....");
//   console.error(err); // Shows the real reason
// });
const mongoose = require("mongoose");

const ConnectDB = async () => {
  try {
    await mongoose.connect(process.env.DBURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to DB.....");
  } catch (err) {
    console.log("Connection Failed.....");
    console.error(err);
  }
};

module.exports = ConnectDB;
