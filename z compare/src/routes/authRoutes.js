const express = require('express');
const {MongoClient} = require('mongodb');
const debug = require('debug')('app:authRoutes');
const passport = require('passport');

const authRouter = express.Router();

function router(nav) {

    authRouter.route('/signUp') 
        .post((req,res) => {
            const { username, password } = req.body;
            const url = 'mongodb://localhost:27017';
            const dbName = 'libraryApp';

            (async function addUser() {
                let client;
                try {
                    client = await MongoClient.connect(url);
                    debug('Connected correctly to server');

                    const db = client.db(dbName);

                    const col = db.collection('users');
                    const user = { username, password };
                    const results = await col.insertOne(user);
                    debug(results); //prints huge chunk of code in terminal

                    //add user to database instead of just storing auth/profile in cookie
                    req.login(results.ops[0], () => {
                        res.redirect('/auth/profile');
                    });
                } catch(err) {
                    debug(err);
                }
            }());
            debug(req.body);
            //redirect go to '/auth/profile'
            req.login(req.body, ()=> {
                res.redirect('/auth/profile');
            });
        });
    
    authRouter.route('/signin') //anyone can access
        .get((req,res) => {
            res.render('signin', {
                nav,
                title: 'SignIn'
            });
        })
        //post to passport to handle what we submitting thru the form
        //use localStrategy as we chose for passport
        .post(passport.authenticate('local', {
            successRedirect: '/auth/profile', //success redirect to '/auth/profile'
            failureRedirect: '/' //if fail redirect to '/'
        }));
        
    authRouter.route('/profile') //need PROTECT - cos it's only for users who signin success
        .all((req,res,next) => {
            if(req.user){ //if there is a request for user ie user and pw are entered
                next(); //go next
            } else { //if there is no request for user - ie they key /profile without signing in
                res.redirect('/'); //redirect them somewhere else
            }
        })
        //print json of user & pw on /profile
        .get((req,res) => {
            res.json(req.user);
        });
    return authRouter;
};

module.exports = router;