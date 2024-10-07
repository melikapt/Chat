const mongoose = require('mongoose');
const Joi = require('joi');

const messageSchema = new mongoose.Schema({
    username: {
        type: String,
        min: 3,
        max: 255,
        required: true
    },
    message: {
        type: String,
        required: true
    }
},
    {
        timestamps: true
    }
)

const Message = mongoose.model('message', messageSchema);

function validateMessage(req) {
    const schema = Joi.object({
        username: Joi.string().min(3).max(255).required(),
        message: Joi.string().required()
    })

    return schema.validate(req)
}

module.exports = { Message, validateMessage }