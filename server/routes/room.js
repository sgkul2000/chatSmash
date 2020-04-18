const express = require('express');
const mongodb = require('mongodb');
// const stringify = require('json-stringify-safe');

const router = express.Router();

const mongo = require('./mongo');

// get room list
router.get('/', async (req, res) => {
    const rooms = await mongo.getRoomDb();
    res.send(await rooms.find({}).toArray());
});



// get room list for a single user
router.get('/getRoomList/:username/', async (req, res) => {
    try {
        const rooms = await mongo.getUsersDb();
        res.send(await rooms.find({
            "username": req.params.username
        }).project({
            rooms: 1,
            _id: 0
        }).toArray());
    } catch (err) {
        console.log(err.message);
    }

});


//create user
router.post('/newUser/', async (req, res) => {
    const userDB = await mongo.getUsersDb();
    await userDB.update({
        username: req.body.name
    },{
        username: req.body.name,
        nickname: req.body.nickname,
        dateCreated: new Date,
        rooms: ['team quarantine quack']
    },{
        upsert: true
    });
    res.status(200).send();
});


// create and initiate a room
router.post('/newRoom/', async (req, res) => {
    try {
        // console.log(req.body.roomName);
        const dataBase = await mongo.createRoomDb(req.body.roomName);
        const rooms = await mongo.getRoomDb();
        const userdb = await mongo.getUsersDb();
        await rooms.insertOne({
            name: req.body.roomName,
            dateCreated: new Date,
            users: [req.body.user]
        });
        await dataBase.insertOne({
            user: "team quarantine Quack",
            text: "Room Created",
            type: "alert",
            dateCreated: new Date
        });
        await userdb.update({
            username: req.body.user
        }, {
            $push: {
                rooms: req.body.roomName
            }
        });
        res.status(201).send('Room "'+ req.body.roomName +'" was successfully created!');
    } catch (err) {
        console.log(err);
        res.status(404).send();
    }
});

// join room
router.get('/join/:name/:user/', async (req, res) => {
    try {
        const userDB = await mongo.getUsersDb();
        const roomDB = await mongo.getRoomDb();
        const roomdb = await mongo.createRoomDb(req.params.name)
        await roomdb.insertOne({
            user: req.params.user,
            text: req.params.user + " joined the room",
            type: "alert",
            dateCreated: new Date
        });
        await roomDB.update({
            name: req.params.name
        }, {
            $push: {
                users: req.params.user
            }
        })
        await userDB.update({
            username: req.params.user
        }, {
            $push: {
                rooms: req.params.name
            }
        });

        res.status(201).send('Joined successfully');
    } catch (err) {
        console.log(err);
        res.status(404).send();
    }
});



//chat routes

//get room chats
router.get('/:name/', async (req, res) => {
    try{
        const dataBase = await mongo.createRoomDb(req.params.name);
        res.send(await dataBase.find({}).toArray());
    } catch(err) {
        console.log(err);
        console.log(err.message);
    }
});




// get room DB
// async function getRoomDb() {
//     const client = await mongodb.MongoClient.connect('mongodb://localhost', {
//         useNewUrlParser: true,
//         useUnifiedTopology: true
//     });
//     return client.db('quarantineQuack').collection('room');
// }

// return room DB
// async function createRoomDb(roomName) {
//     const client = await mongodb.MongoClient.connect('mongodb://127.0.0.1:27017/', {
//         useNewUrlParser: true,
//         useUnifiedTopology: true
//     });
//     console.log(roomName);
//     return client.db('quarantineQuack').collection(roomName);
// }

// // get users DB
// async function getUsersDb() {
//     const client = await mongodb.connect('mongodb://localhost', {
//         useNewUrlParser: true,
//         useUnifiedTopology: true
//     });
//     return client.db('quarantineQuack').collection('Users');
// }

module.exports = router;