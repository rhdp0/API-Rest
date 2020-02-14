const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
    },

    email:{
        type: String,
        unique: true,
        require: true,
        lowercase: true,
    },

    password: {
        type: String,
        require: true,
        select: false, //para quando buscar as informações de um usuário a senha não venha junto na array
    },
    passwordResetToken: {
        type: String,
        select: false,
    },
    passwordResetExpires: {
        type: Date,
        select: false,
    },

    creatdAt: {
        type: Date,
        default: Date.now,
    },
});

UserSchema.pre('save', async function(next) {
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;

    next();
})

module.exports = mongoose.model('User', UserSchema);