const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const mongoose = require('mongoose')
const User = require('./models/user.model.js')
const getDate = require('./utils/getDate.js')
// const {Exercise, Log} = require('./models/exercise.model.js')

// middleware
app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// create user
app.post('/api/users', async (req, res) => {
  try {
    console.log(req.body)
    const user = await User.create(req.body);
    console.log(user);
    res.json({ username: user.username, _id: user._id });
  }
  catch (error) {
    res.json({ error: error.message })
  }
});
// get all users
app.get('/api/users', async (req, res) => {
  try {
    const allUsers = await User.find({});

    res.send(allUsers);
  }
  catch (error) {
    res.json({ error: error.message })
  }
});
// add exercise
app.post('/api/users/:_id/exercises', async (req, res) => {
  console.log("exercises req body", req.body);
  try {
    const { _id: id } = req.params;
    let { description, duration, date: inDate } = req.body;
    console.log("req date", inDate);
    // let parDate = Date.parse(inDate)
    let date = "";

    console.log("body - ", req.body);

    date = await getDate((inDate));

    console.log("did date", date);
    let user = await User.findById(id);
    console.log("1st user  = ", user);

    user.log.push({ description: description, duration: +duration, date: date });
    const result = await user.save();
    const index = user.log.length - 1

    res.send({ username: user.username, description: user.log[index].description, duration: user.log[index].duration, date: user.log[index].date, _id: user._id });
    console.log("saved result - ", result);
  }
  catch (error) {
    res.json({ error: error.message })
  }
});
// logs api
app.get('/api/users/:_id/logs', async (req, res) => {

  try {
    const { _id: id } = req.params;
    const user = await User.findById(id);
    console.log("user object = ", user);
    const cleanLog = user.log.map((ex) => {
      let { description, duration, date, _id } = ex;
      return { description, duration, date }
    });
    console.log(cleanLog);

    const count = user.log.length;
    res.json({ username: user.username, _id: id, count: count, log: cleanLog });
  }

  catch (error) {
    res.json({ error: error.message })
  }
});


app.delete('/api/deleteAll', async (req, res) => {
  try {
    const result = await User.deleteMany({});
    // const result2 = await Exercise.deleteMany({});
    res.send("Collections Deleted");
  }
  catch (error) {
    res.json({ error: error.message })
  }
})

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Database Connected!'));


const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
