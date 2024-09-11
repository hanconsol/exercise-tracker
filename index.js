const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const mongoose = require('mongoose')
const User = require('./models/user.model.js')

// middleware
app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// create user
app.post('/api/users',  async(req, res) => {
  try{
    console.log(req.body)
    const username = await User.create(req.body);
    res.json(username);
  }
  catch(error) {
    res.json({error: error.message})
  }
});
// get all users
app.get('/api/users', async (req, res) => {
  try {
    const allUsers = await User.find({});
    console.log(allUsers);
    res.send(allUsers);
  }
  catch(error) {
    res.json({error: error.message})
  }
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Database Connected!'));


const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
