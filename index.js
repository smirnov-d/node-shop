const express = require('express');
const path = require('path');
const fs = require('fs');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const helmet = require('helmet');
const compression = require('compression');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const isAuth = require('./middleware/variables');
const userMiddleware = require('./middleware/user');
const errorMiddleware = require('./middleware/error');

const PORT = process.env.PORT || 3000;

const server = express();
server.set('view engine', 'ejs');
server.use(expressLayouts);
server.set('layout', path.join(__dirname, 'views', 'layouts', 'default'));

// static folders
server.use(express.static(path.join(__dirname, 'public')));
server.use('/images', express.static(path.join(__dirname, 'images')));

server.use(express.urlencoded({extended: true}));

const MONGO_DB_URI = `mongodb+srv://smirnov-d:${process.env.MONGO_DB_PASS}@cluster0.u3fhv.mongodb.net/${process.env.MONGO_DB_NAME}`;

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
server.use(helmet());
server.use(compression());
server.use(csrf());
server.use(flash());
server.use(isAuth);
server.use(userMiddleware);

function initRoutes() {
  const routesDir = './routes';

  let files;

  try {
    files = fs.readdirSync(routesDir);

    files.forEach(file => {
      const withoutExt = path.basename(file, path.extname(file));
      server.use(withoutExt === 'home' ? '/' : `/${withoutExt}`, require(path.resolve(routesDir, file)));
    });
  } catch(err) {
    throw err;
  }
}

async function start() {
  initRoutes();

  // 404
  server.use(errorMiddleware)

  try {
    // db connect
    await mongoose.connect(MONGO_DB_URI, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false,});

    // server
    server.listen(PORT, () => {
      console.log(`server is running on port ${PORT}`);
    });
  } catch (e) {
    console.log(e);
  }
}

start();
