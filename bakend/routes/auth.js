const { User, validateUser } = require('../models/users');
const bcrypt=require('bcrypt');
const express = require('express');
const router = express.Router();

router.post('', async (req, res) => {
    try {
        const { error } = validateUser(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        const user=await User.findOne({username:req.body.username})
        if(!user) return res.status(404).send('Invalid username or password');

        const validPass=await bcrypt.compare(req.body.password,user.password);
        if(!validPass) return res.status(404).send('Invalid username or password');

        const token=await user.generateToken();

        res.status(200).send({username:user.username,token});
    } catch (error) {
        console.error(error);
    }
})

module.exports = router;