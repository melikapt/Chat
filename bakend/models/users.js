const mongoose = require('mongoose');
const Joi = require('joi');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        min: 3,
        max: 255,
        required: true
    },
    password: {
        type: String,
        min: 5,
        max: 255,
        required: true
    }
},
    {
        timestamps: true
    }
)

userSchema.methods.generateToken = function () {
    return jwt.sign({ username: this.username, _id: this._id }, '123456')
}

const User = mongoose.model('user', userSchema);



function validateUser(req) {
    const schema = Joi.object({
        username: Joi.string().min(3).max(255).required(),
        password: Joi.string().min(5).max(255).required(),
    })

    // console.log(schema);


    return schema.validate(req);
}

module.exports = { User, validateUser };