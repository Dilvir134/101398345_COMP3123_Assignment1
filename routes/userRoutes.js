const express = require('express');
const userModel = require('../models/userModel');
const passwordHash = require('password-hash');

const router = express.Router();

router.post('/signup', async (req, res) => {
    if(!req.body) {
        return res.status(400).send({
            message: "User content can not be empty"
        });
    }

    const userData = req.body;
    try {
        userData.password = passwordHash.generate(userData.password);
        const user = new userModel(userData);
        const newUser = await user.save()
        res.send({"message": "User created successfully", "user_id":newUser._id});
    }
    catch(err) {
        res.status(500).send({message: err.message});
    }
});

router.post('/login',  (req, res) => {
    if(!req.body) {
        return res.status(400).send({
            message: "User content can not be empty"
        });
    }

    const loginData = req.body;
    userModel.findOne({email: req.body.email})
        .then(user => {
            if (user) {
                if (passwordHash.verify(loginData.password, user.password)) {
                    res.send({message: "User login successfully"});
                } else {
                    res.status(401).send({message: "Wrong Password"});
                }
            }
            else {
                res.status(401).send({message: "Wrong email"});
            }
        }).catch(err => {
            res.status(500).send({message: err.message});
    })
});


module.exports = router;