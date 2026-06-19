require('dotenv').config();
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const authrouter = require('./routes/auth.routes');
const musicrouter = require('./routes/music.routes');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

app.use(express.static(path.join(__dirname, '../../frontend')));

app.use('/api/auth', authrouter);
app.use('/api/music', musicrouter);

module.exports = app;