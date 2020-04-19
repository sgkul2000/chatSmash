const express = require('express');
const mongodb = require('mongodb');

const router = express.Router();

// get posts
router.get('/', async (req, res) => {
    const posts = await loadPosts();
    res.send(await posts.find({}).toArray());
});

// add posts
router.post('/', async (req, res) => {
    const posts = await loadPosts();
    await posts.insertOne({
        text: req.body.text,
        date: new Date()
    });
    res.status(201).send();
});

// delete posts
router.post('/:id', async (req, res) => {
    const posts = await loadPosts();
    await posts.deleteOne({
        _id: new mongodb.ObjectID(req.params.id)
    });
    res.status(200).send();
});






//junk
// watch: {
//     allInOne: val => {
//       var nameOfRoom = this.$route.params.room;
//       if (nameOfRoom === "Home") {
//         nameOfRoom = "team quarantine quack";
//       }
//       var roomie = all.find(room => {
//         return room.roomName === nameOfRoom;
//       });
//       this.chatMessages = roomie.chats;
//     }
//   },


async function loadPosts() {
    const client = await mongodb.MongoClient.connect('mongodb://localhost', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    return client.db('socialPost').collection('posts');
}

module.exports = router;



// const Port = (process.env.PORT).toString()
// console.log(Port)
