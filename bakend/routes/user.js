const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { User, validateUser } = require('../models/users');

router.post('/', async (req, res) => {
    try {
        const { error } = validateUser(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        const existUser = await User.findOne({ username: req.body.username })
        if (existUser) return res.status(400).send('Username already exist');


        const salt = await bcrypt.genSalt(15);
        const hashPass = await bcrypt.hash(req.body.password, salt);

        const newUser = new User({
            username: req.body.username,
            password: hashPass
        })
        newUser.save();

        const token = newUser.generateToken();

        return res.status(200).send({ username: newUser.username, token });
    } catch (error) {
        console.error(error);
    }
})

module.exports = router;