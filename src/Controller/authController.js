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
        const { name, email, password, confirmPassword } = req.body;


        if (await User.findOne({ email })){
            return res.status(400).send({error: 'Email já cadastrado'})
        };

        if(name === '' || email === '' || password === ''){
            return res.status(400).send({error: 'Todos os campos são obrigatórios'})
        };

        if(confirmPassword === '') {
            return res.status(400).send({error: 'Confirme sua senha'})
        }else{
            if(confirmPassword !== password) {
                return res.status(400).send({error: 'As senhas precisam ser iguais'})
            }
        }


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

        if(!user || email === ''){
            error =  res.status(400).send({ error: 'Usuário não encontrado' });
            return error
        }

        if(!await bcrypt.compare(password, user.password)){
            error =  res.status(400).send({ error: 'Senha inválida' });
            return error
        }

        user.password = undefined;

        res.send({ user, 
            token: generateToken({ id: user.id }),
        });
    }

}