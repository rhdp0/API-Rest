const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authconfig = require('../config/auth');

function generateToken(params = {}) {
    return jwt.sign({ params }, authconfig.secret, {
        expiresIn: 86400,
    });
}

module.exports = {
    async store(req, res) {
        const { name, email, password } = req.body;


        if (await User.findOne({ email })){
            return res.status(400).send({error: 'User already exists'})
        };

        user = await User.create({ 
            name, 
            email, 
            password 
        });

        user.password = undefined;
        return res.json({ 
            user,
            token: generateToken({ id: user.id })
        });
    },

    async show(req, res) {
        const { email, password } = req.body;

        const user = await User.findOne({ email }).select('+password');

        if(!user){
            return res.status(400).send({ error: 'User not found' });
        }

        if(!await bcrypt.compare(password, user.password)){
            return res.status(400).send({ error: 'Invalid password' });
        }

        user.password = undefined;

        

        res.send({ user, 
            token: generateToken({ id: user.id }),
        });
    }
}