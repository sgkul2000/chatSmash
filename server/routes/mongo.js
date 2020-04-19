const mongodb = require('mongodb');
const mongoUri = "mongodb://localhost"


module.exports = class mongo {
  //get room db
  static async getRoomDb() {
    const client = await mongodb.MongoClient.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    return client.db('quarantineQuack').collection('room');
  }

  //return custom room db
  static async createRoomDb(roomName) {
    const client = await mongodb.MongoClient.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    // console.log(roomName);
    return client.db('quarantineQuack').collection(roomName);
  }

  // get users DB
  static async getUsersDb() {
    const client = await mongodb.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    return client.db('quarantineQuack').collection('Users');
  }
}

// export default getRoomDb;