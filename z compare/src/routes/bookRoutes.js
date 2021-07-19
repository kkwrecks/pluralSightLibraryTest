/* eslint-disable comma-dangle */
const express = require('express');
const { MongoClient, ObjectID } = require('mongodb');
const debug = require('debug')('app:bookRoutes');

const bookRouter = express.Router();

function router(nav) {

  bookRouter.use((req,res,next) => {
    if (req.user) {
      next();
    } else {
      res.redirect('/');
    }
  });

//   //other ways to ultilise
//   bookRouter.use((req,res,next) => {
//       if (req.user.admin) {
//       next();
//     } else {
//       //do what
//     }
//   });

// bookRouter.use((req,res,next) => {
//       if (req.user.roles) {
//       next();
//     } else {
//       res.redirect('/auth/signin');
//       debug('redirected successful')
//     }
//   });

  bookRouter.route('/') //no variable required to pass thru, so dont need to define as a function
    .get((req, res) => {
    const url = 'mongodb://localhost:27017'; //27017 is standard port for mongdb
    const dbName = 'libraryApp';

    (async function mongo(){
        let client;
        try{
          client = await MongoClient.connect(url);
          debug('Connected correctly to server');

          const db = client.db(dbName);
          const col = await db.collection('books')

          const books = await col.find().toArray(); //col.find() will give you everything. array will give less.

          res.render('books',
            {
              title: 'EJSLibrary',
              nav,
              books,
            });
        } catch (err) {debug(err.stack);};
        client.close();
      }());
    });

// '/:id' means that express takes what's behind the slash and sticks it in a variable name called ID
  bookRouter.route('/:id') 
    .get((req, res) => {
    // const { id } = req.params; is another way to write it
    const {id} = req.params;
    const url = 'mongodb://localhost:27017'; //27017 is standard port for mongdb
    const dbName = 'libraryApp';

    (async function mongo(){
      let client;
      try{
        client = await MongoClient.connect(url);
        debug('Connected correctly to server');

        const db = client.db(dbName);
        const col = await db.collection('books');
        const book = await col.findOne({ _id: new ObjectID(id) });
        debug(book);

        res.render(
          'bookView',
          {
            nav,
            title: 'Library',
            book 
          }
      );

      } catch (err) {
        debug(err.stack); //if there's an error, debug error stack
      } 

      }());


    });

    return bookRouter;
};

module.exports = router;