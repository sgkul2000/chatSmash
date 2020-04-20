const express = require('express')
// const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
// const http = require('http').createServer(app);
// const io = require('socket.io')(http);
if(process.env.NODE_ENV !== 'production') require('dotenv').config({ path: __dirname + '/.env' });



const app = express();
// middleware
app.use(bodyParser.json());
app.use(cors());



//handle production
if(process.env.NODE_ENV === 'production'){
  //static folder to public
  app.use(express.static(__dirname + '/public'));
  //handle single page app
  app.get(/.*/, (req, res) => res.sendFile(__dirname + '/public/index.html'));
}

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`server started at ${port}`)
});
