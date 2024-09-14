const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const mongoose = require('mongoose')
const User = require('./models/user.model.js')
const { getDate, getDateDb } = require('./utils/getDate.js')
const Exercise = require('./models/exercise.model.js')

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
    let date = "";

    console.log("body - ", req.body);

    date = await getDateDb((inDate));

    console.log("did date", date);
    let user = await User.findById(id);
    console.log("1st user  = ", user);

    let exercise = await Exercise.create({
      userId: id,
      description: description,
      duration: +duration,
      date: date
    });
    const dateOut = await getDate(date);
    res.send({ username: user.username, description: exercise.description, duration: exercise.duration, date: dateOut, _id: user._id });
    console.log("saved result - ", exercise);
  }
  catch (error) {
    res.json({ error: error.message })
  }
});
// logs api

app.get('/api/users/:_id/logs', async (req, res) => {

  console.log("req query = ", req.query);
  const { from, to, limit } = req.query;
  console.log("from ", from, "to ", to, "limit ", limit);
  const start = await getDateDb(from);
  const end = await getDateDb(to);


  const { _id: id } = req.params;
  let search = {
    userId: id
  }
  const filter = {};
  if (from) {
    filter.$gte = start;
  };
  if (to) {
    filter.$lte = end;
  };
  if (from || to) {
    search["date"] = filter;
  };
  try {
    const user = await User.findById(id);
    console.log("user object = ", user);
    console.log("search", search);
    const log = await Exercise.find(search)
      .limit(limit || 1000)
      ;
    console.log("log", log)

    const cleanLog = log.map((ex) => {
      let { description, duration, date, _id } = ex;
      date = new Date(date).toDateString();
      return { description, duration, date }
    });
    console.log(cleanLog);

    const count = log.length;
    res.json({ username: user.username, _id: id, count: count, log: cleanLog });
  }

  catch (error) {
    res.json({ error: error.message })
  }
});


app.delete('/api/deleteAll', async (req, res) => {
  try {
    const result = await User.deleteMany({});
    const result2 = await Exercise.deleteMany({});
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
