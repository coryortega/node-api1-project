// implement your API here
const express = require("express");

const db = require('./data/db.js'); // 1. import database file

const server = express();

server.use(express.json()); // needed to parse JSON from the body

server.get('/', (req, res) => {
    res.send({ api: 'up and running...'});
});

// add a user
server.post('/api/users', (req, res) => {
    //get the data the client sent
    const userData = req.body; // express does not know how to parse JSON 
    //call the db and add the hub
    if (!userData.name || !userData.bio) {
        res
        .status(400)
        .json({errorMessage: "Please Provide name and bio for the user."});
    } else {
        db.insert(userData)
        .then(user =>{
            res.status(201).json(user)
        })
        .catch(
            error => {
                console.log('error', error);
                res
                .status(500)
                .json({ errorMessage: "There was an error while saving the user to the database"});
            }); 
    
    }
});

server.get('/api/users', (req, res) => {
    // get the list of users from database
    db.find()
    .then(users => {
        res.status(200).json(users)
    })
    .catch( error => {
        console.log('error on GET /users', error);
        res
        .status(500)
        .json({ errorMessage: "The users information could not be retrieved."});
    });
});

server.get('/api/users/:id', (req, res) => {
    const id = req.params.id;

    db.findById(id)
    .then(user => {
        // res.status(200).json(user)
        if(!user){
            // there was no hub with that id
            res.status(404).json({ message: "user not found"})
        } else {
            res.status(200).json(user)
        }
    })
    .catch( error => {
        console.log('error on GET /users/:id', error);
        res
        .status(500)
        .json({ errorMessage: "The users information could not be retrieved."});
    });
});

server.delete('/api/users/:id', (req, res) => {
    const id = req.params.id;

    db.remove(id)
    .then(user => {
        // res.status(200).json(user)
        if(!user){
            // there was no hub with that id
            res.status(404).json({ message: "user not found"})
        } else {
            res.status(200).json({message: `you have successfully deleted user ${id}`})
        }
    })
    .catch( error => {
        console.log('error on GET /users', error);
        res
        .status(500)
        .json({ errorMessage: "error deleting"});
    });
});


server.put('/api/users/:id', (req, res) => {

    const userData = req.body;
    const id = req.params.id;

    db.update(id, userData)
    .then(user => {
    if (!user) {
        res
        .status(404)
        .json({errorMessage: "not user with that id"});
    } else if(
        (!userData.name || !userData.bio)
    ){
        res
        .status(400)
        .json({errorMessage: "you gotta update name and bio"});
    } else {
        db.update(id, userData)
        .then(user =>{
            res.status(200).json(userData)
        })
        .catch(
            error => {
                console.log('error', error);
                res
                .status(500)
                .json({ errorMessage: "There was an error while saving the user to the database"});
            }); 
        
        }
    })
});

const port = 4000;
server.listen(port, () => console.log(`\n** API running on port ${port} **\n`)
);