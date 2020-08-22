const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
const isAuth = require('./middleware/variables');
const userMiddleware = require('./middleware/user');
const User = require('./models/user');

const homeRoutes = require('./routes/home');
const coursesRoutes = require('./routes/courses');
const addRoutes = require('./routes/add');
const cartRoutes = require('./routes/cart');
const ordersRoutes = require('./routes/orders');
const authRoutes = require('./routes/auth');
// const ejs = require('ejs');

const PORT = process.env.PORT || 3000;

const MONGO_DB_NAME = 'test';//'cluster0'
const MONGO_DB_PASS = `AWBKqzKk2pi3P5qO`;
const MONGO_DB_URI = `mongodb+srv://smirnov-d:${MONGO_DB_PASS}@cluster0.u3fhv.mongodb.net/${MONGO_DB_NAME}`;

const server = express();
server.set('view engine', 'ejs');
server.use(express.static(path.join(__dirname, 'public')));
server.use(express.urlencoded({extended: true}));

const store = new MongoDBStore({
  uri: MONGO_DB_URI,
  collection: 'sessions',
});

server.use(session({
  store,
  secret: 'some secret string',
  resave: false,
  saveUninitialized: false,
}));

server.use(csrf());
server.use(isAuth);
server.use(userMiddleware);

// server.use(async (req, res, next) => {
//   try {
//     const userId = '5f2ec06534a93e1568dbfef3';
//     const user = await User.findById(userId);
//     req.user = user;
//     // if (req.user.id === userId) {
//       next();
//     // }
//     // res.redirect('/');
//   } catch (e) {
//     throw e;
//   }
// })

server.use('/', homeRoutes);
server.use('/courses', coursesRoutes);
server.use('/add', addRoutes);
server.use('/cart', cartRoutes);
server.use('/orders', ordersRoutes);
server.use('/auth', authRoutes);

async function start() {
  try {
    await mongoose.connect(MONGO_DB_URI, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false,});

    // let user = await User.findOne();
    // if(!user) {
    //   user = new User({
    //     name: 'User Name',
    //     email: 'test@test.test',
    //     cart: {items:[]},
    //   })
    //   await user.save();
    // }

    server.listen(PORT, () => {
      console.log(`server is running on port ${PORT}`);
    });
  } catch (e) {
    console.log(e);
  }
}

start();
