const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const User = require('./models/user');

const homeRoutes = require('./routes/home');
const coursesRoutes = require('./routes/courses');
const addRoutes = require('./routes/add');
const cartRoutes = require('./routes/cart');
const ordersRoutes = require('./routes/orders');
// const ejs = require('ejs');

const PORT = process.env.port || 3000;

const server = express();
server.set('view engine', 'ejs');
server.use(express.static(path.join(__dirname, 'public')));
server.use(express.urlencoded({extended: true}));

server.use(async (req, res, next) => {
  try {
    const userId = '5f2ec06534a93e1568dbfef3';
    const user = await User.findById(userId);
    req.user = user;
    // if (req.user.id === userId) {
      next();
    // }
    // res.redirect('/');
  } catch (e) {
    throw e;
  }
})

server.use('/', homeRoutes);
server.use('/courses', coursesRoutes);
server.use('/add', addRoutes);
server.use('/cart', cartRoutes);
server.use('/orders', ordersRoutes);

async function start() {
  try {
    const dbname = 'test';//'cluster0'
    const pass = `AWBKqzKk2pi3P5qO`;
    const url = `mongodb+srv://smirnov-d:${pass}@cluster0.u3fhv.mongodb.net/${dbname}`;
    await mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false,});

    let user = await User.findOne();
    if(!user) {
      user = new User({
        name: 'User Name',
        email: 'test@test.test',
        cart: {items:[]},
      })
      await user.save();
    }

    server.listen(PORT, () => {
      console.log(`server is running on port ${PORT}`);
    });
  } catch (e) {
    console.log(e);
  }
}

start();
