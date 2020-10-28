const mongoose = require('mongoose');
const fs = require('fs');
var credentials = JSON.parse(fs.readFileSync("./database-credentials.json"));

const server = 'mongodb+srv://' + credentials.user + ':' + credentials.password + '@nodejs-training.o0y47.mongodb.net/online-shop?retryWrites=true&w=majority';
console.log(server)

class Database {
  constructor() {
    this._connect()
  }
  
_connect() {
     mongoose.connect(server, { useNewUrlParser: true, useUnifiedTopology: true})
       .then(() => {
         console.log('Database connection successful')
       })
       .catch(error => {
         console.error('Database connection error: ' + error.toString())
       })
  }
}

module.exports = new Database()