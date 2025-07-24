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
    console.log("✅ Connected to MongoDB successfully");
  } catch (err) {
    console.log("❌ MongoDB Connection Failed:");
    console.error(err.message);
    console.log("💡 Make sure MongoDB is running or use MongoDB Atlas");
    console.log("🔧 Current connection string:", process.env.DBURI);
    
    // Don't exit the process, let the app run without DB for development
    console.log("⚠️  Continuing without database connection...");
  }
};

module.exports = ConnectDB;
