const passport = require('passport');
const { Strategy } = require('passport-local');
const { MongoClient } = require('mongodb');
const debug = require('debug')('app:local.strategy');

module.exports = function localStrategy() {
    passport.use(new Strategy(
        {
            usernameField: 'username',
            passwordField: 'password'
        }, (username, password, done) => {
            const url = 'mongodb://localhost:27017';
            const dbName = 'libraryApp';
            (async function mongo() {
                let client;

                try {
                    client = await MongoClient.connect(url);

                    debug('Connected correctly to server');

                    const db= client.db(dbName);
                    const col = db.collection('users');

                    //find user associated to login posted to server

                    const user = await col.findOne({ username });

                    if(user.password === password) {
                        done(null, user); //pw match pass to give user 
                        debug('success')
                    } else {
                        done(null, false);
                        debug('fail') //null and not err cos it failed due to wrong pw
                    }
                } catch (err) {
                    console.log(err.stack);
                }
                //close connection
                client.close();
            }());
        }));
};