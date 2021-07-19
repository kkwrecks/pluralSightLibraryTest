/* eslint-disable comma-dangle */
const express = require('express');
const chalk = require('chalk');
const debug = require('debug')('app');
const morgan = require('morgan');
// check if file exists, convert relative path into absolute for a file
const path = require('path');
const bodyParser = require('body-parser');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const app = express();
const port = process.env.PORT || 3000;

app.use(morgan('tiny')); // app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded( {extended: false} )); //pulls out post and adds it to body
app.use(cookieParser());
app.use(session({secret: 'library'}));

require('./src/config/passport.js')(app);

app.use(express.static(path.join(__dirname, '/public/')));
app.use('/css', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/css')));
app.use('/js', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/js')));
app.use('/js', express.static(path.join(__dirname, '/node_modules/jquery/dist')));

// to connect to ejs
app.set('views', './src/views');
app.set('view engine', 'ejs');

const nav = [{ link: '/books', title: 'Books' },
{ link: '/authors', title: 'Authors' },
{ link: '/subjects', title: 'Subjects' }];

const bookRouter = require('./src/routes/bookRoutes')(nav);
const adminRouter = require('./src/routes/adminRoutes')(nav);
const authRouter = require('./src/routes/authRoutes')(nav);
//const appRefresh = setInterval(window.location.reload(false), 6000);

app.use('/books', bookRouter);
app.use('/admin', adminRouter);
app.use('/auth', authRouter);

app.get('/', (req, res) => {
  res.render(
    'index',
    {
      title: 'EJSLibrary',
      nav
    },
  );
  // res.render renders a view of a file called index
  // define variable "title" as 'yourLibrary'
  // over in index.pug - "element= title" will print title as defined
  // h1= title
  // res.render('index', { list: ['a', 'b'] });
});

app.listen(port, () => {
  // console.log(`console.log: listening on port ${chalk.green('3000')}`);
  debug(`listening on port ${chalk.green(port)}`);
});

// RUN IN COMMAND PROMPT
// macOS
// DEBUG=* node app.js
// Windows
// set DEBUG=* & node app.js

// for less info
// set DEBUG=app & node app.js

// NOTE: to run in terminal
// node app.js
// open tab in browser - localhost:3000
