const router = require('express').Router();
const User = require('../models/User');

router.post('/signup', async (req, res) => {
    const {username, firstname, lastname, password} = req.body;
    try {
        const user = new User({username, firstname, lastname, password});
        await user.save();
        res.status(201).json({message: 'User created successfully'});
    } catch (err) {
        res.status(400).json({error: err.message});
    }
});

router.post('/login', async (req, res) => {
    const {username, password} = req.body;
    const user = await User.findOne({username, password});
    if(!user) return res.status(401).json({error: 'Invalid credentials'});
    res.json({message: 'Login successful', user});
});

module.exports = router;