const routes = require('./routes',);
const mongoose = require('mongoose');
const cors = require('cors');
const express = require('express');

const app = express();

mongoose.connect('mongodb+srv://luxus:luxus@cluster0-rkxid.mongodb.net/rpgaux?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

require('./Controller/projectController')(app);

app.use(cors())
app.use(express.json());
app.use(routes);

app.listen(3333);
