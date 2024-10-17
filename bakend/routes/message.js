const auth = require('../middleware/auth');
const { Message, validateMessage } = require('../models/messages');
const express = require('express');
const router = express.Router();


router.post('/message', auth, async (req, res) => {
    try {
        let message;
        const { error } = validateMessage({ username: req.body.username, message: req.body.message });
        if (error) return res.status(400).send(error.details[0].message);

        if (req.body.room === '') {
            message = new Message({
                username: req.body.username,
                message: req.body.message,
                room: '',
                isPrivate: false
            })
        }

        if (req.body.room !== '') {
            message = new Message({
                username: req.body.username,
                message: req.body.message,
                room: req.body.room,
                isPrivate: true
            })
        }

        message.save();

        await Message.findById({ _id: message._id })
            .select('createdAt -_id')

        res.status(200).send(message);

    } catch (error) {
        console.error(error);
    }
})

router.get('/messages/:room?', auth, async (req, res) => {
    try {
        let room = req.params.room;
        let messages;
        if (room === undefined) {
            messages = await Message.find()
                .where({ isPrivate: false, room: '' })
                .select('username message createdAt -_id')
                .sort('-createdAt')
                .limit(10)
        }
        if (room) {
            messages = await Message.find()
                .where({ isPrivate: true, room })
                .select('username message createdAt -_id')
                .sort('-createdAt')
                .limit(10)
        }
        return res.status(200).send(messages);
    } catch (error) {
        console.error(error);
    }
})

module.exports = router;