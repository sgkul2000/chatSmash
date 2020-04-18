const express = require('express');
const mongodb = require('mongodb');

const router = express.Router();

const mongo = require('./mongo')

// get chats from a particular room
router.get('/:name', async (req, res) => {
    const dataBase = await mongo.getRoom(req.params.name);
    res.send(await dataBase.find({}).toArray());
});




// get room db
// async function getRoomDb() {
//     const client = await mongodb.MongoClient.connect('mongodb://localhost', {
//         useNewUrlParser: true,
//         useUnifiedTopology: true
//     });
//     return client.db('quarantineQuack').collection('room');
// }

// // return room db
// async function getRoom(roomName) {
//     const client = await mongodb.MongoClient.connect('mongodb://localhost', {
//         useNewUrlParser: true,
//         useUnifiedTopology: true
//     });
//     return client.db('quarantineQuack').collection(roomName);
// }


module.exports = router;