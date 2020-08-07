const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const homeRoutes = require('./routes/home');
const coursesRoutes = require('./routes/courses');
const addRoutes = require('./routes/add');
const cartRoutes = require('./routes/cart');
// const ejs = require('ejs');

const PORT = process.env.port || 3000;

const server = express();
server.set('view engine', 'ejs');
server.use(express.static(path.join(__dirname, 'public')));
server.use(express.urlencoded({extended: true}));

server.use('/', homeRoutes);
server.use('/courses', coursesRoutes);
server.use('/add', addRoutes);
server.use('/cart', cartRoutes);

async function start() {
  try {
    const dbname = 'test';//'cluster0'
    const pass = `5vuBO6QDCqOy4c86`;
    const url = `mongodb+srv://smirnov-d:${pass}@cluster0.u3fhv.mongodb.net/${dbname}?retryWrites=true&w=majority
`;
    await mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true});

    server.listen(PORT, () => {
      console.log(`server is running on port ${PORT}`);
    });
  } catch (e) {
    console.log(e);
  }
}

start();
