const express = require("express");
const { MongoClient } = require('mongodb');
const debug = require('debug')('app:adminRoutes');

const adminRouter = express.Router();
const books = [
    {
      title: 'The Midnight Library',
      genre: 'Fiction',
      author: 'Matt Haig',
      image: 'cabin.png',
      read: false
    },
    {
      title: 'To Sleep in a Sea of Stars',
      genre: 'Science Fiction',
      author: 'Christopher Paolini',
      image: 'cake.png',
      read: false
    },
    {
      title: 'Strange Planet',
      genre: 'Humour',
      author: 'Nathan W. Pyle',
      image: 'circus.png',
      read: false
    },
    {
      title: 'Buy Yourself the F*cking Lilies',
      genre: 'Self Help',
      author: 'Tara Schuster',
      image: 'game.png',
      read: false
    },
    {
      title: 'Axioms End',
      genre: 'Science Fiction',
      author: 'Lindsay Ellis',
      image: 'safe.png',
      read: false
    },
    {
      title: 'Such a Fun Age',
      genre: 'Fiction',
      author: 'Kiley Reid',
      image: 'submarine.png',
      read: false
    },
  ];

function router(nav) { //use function cos need to pass nav in as a variable
    adminRouter.route("/")
        .get((req, res) => {
        const url = 'mongodb://localhost:27017'; //27017 is standard port for mongdb
        const dbName = 'libraryApp';

        (async function mongo(){
            let client;
            try{
                client = await MongoClient.connect(url);
                debug('Connected correctly to server');

                const db = client.db(dbName);
                const response = await db.collection('books').insertMany(books);
                res.json(response);

            } catch (err) {
                debug(err.stack);}

            client.close();
        }());
        //res.send("from function inserting books");
      });
    return adminRouter; //without which won't see anything
}

module.exports = router; //has to be router cos we running in the fxn called router
