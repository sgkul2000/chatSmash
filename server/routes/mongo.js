const mongodb = require('mongodb');



module.exports = class mongo {
  //get room db
  static async getRoomDb() {
    const client = await mongodb.MongoClient.connect('mongodb://localhost', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    return client.db('quarantineQuack').collection('room');
  }

  //return custom room db
  static async createRoomDb(roomName) {
    const client = await mongodb.MongoClient.connect('mongodb://127.0.0.1:27017/', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    // console.log(roomName);
    return client.db('quarantineQuack').collection(roomName);
  }

  // get users DB
  static async getUsersDb() {
    const client = await mongodb.connect('mongodb://localhost', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    return client.db('quarantineQuack').collection('Users');
  }
}

// export default getRoomDb;