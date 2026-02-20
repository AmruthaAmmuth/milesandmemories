const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const Event = sequelize.define('Event', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false
    }
}, {
    timestamps: true,
    tableName: 'events'
});

// Setup association
User.hasMany(Event, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Event.belongsTo(User, { foreignKey: 'user_id' });

module.exports = Event;
