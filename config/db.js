const mongoose = require("mongoose");
// Replace this with your MONGOURI.
// const MONGOURI = "mongodb://testuser:testpassword@ds257698.mlab.com:57698/node-auth";
// mongodb+srv://root:<password>@recharge-9yeed.mongodb.net/<dbname>?retryWrites=true&w=majority



const MONGOURI = "mongodb+srv://betauser:betauser@hitcluster.m2pyu.mongodb.net/hitrecharge?retryWrites=true&w=majority";
// const MONGOURI = "mongodb+srv://root:root@recharge-9yeed.mongodb.net/recharge?retryWrites=true&w=majority";
const InitiateMongoServer = async () => {
  await mongoose.connect(MONGOURI, {
    useNewUrlParser: true
  });
  console.log("Connected to DB !!");

};
module.exports = InitiateMongoServer;