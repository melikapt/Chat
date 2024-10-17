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
    },
    isPrivate:{
        type:Boolean,
        default:false
    },
    room:{
        type:String,
        default:''
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
        message: Joi.string().required(),
        isPrivate:Joi.boolean().default(false),
        room:Joi.string().default('')
    })

    return schema.validate(req)
}

module.exports = { Message, validateMessage }