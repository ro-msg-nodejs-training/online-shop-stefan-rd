const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const server =
  "mongodb+srv://" +
  process.env.MONGO_DB_USER +
  ":" +
  process.env.MONGO_DB_PASSWORD +
  "@nodejs-training.o0y47.mongodb.net/online-shop?retryWrites=true&w=majority";

class Database {
  constructor() {
    this._connect();
  }

  _connect() {
    mongoose
      .connect(server, { useNewUrlParser: true, useUnifiedTopology: true })
      .then(() => {
        console.log("Database connection successful");
      })
      .catch((error) => {
        console.error("Database connection error: " + error.toString());
      });
  }
}

module.exports = new Database();
