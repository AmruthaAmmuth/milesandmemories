const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const sequelize = require('./config/database');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());
app.use('/uploads', express.static('uploads'));

// Basic Route
app.get('/', (req, res) => {
    res.send('Miles & Memories API is running!');
});

// Use Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/user'));
app.use('/api/diary', require('./routes/diary'));
app.use('/api/memories', require('./routes/memory'));
app.use('/api/events', require('./routes/event'));
app.use('/api/messages', require('./routes/message'));

// Sync Database and Start Server
sequelize.sync({ alter: true }) // Uses alter to safely update schema without dropping data
    .then(() => {
        console.log('MySQL Database Assured via Sequelize');
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });
