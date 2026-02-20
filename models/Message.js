const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const Message = sequelize.define('Message', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    text: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    sender_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    receiver_id: {
        type: DataTypes.INTEGER,
        allowNull: true // Optional if just broadcasting thoughts generally
    }
}, {
    timestamps: true,
    tableName: 'messages'
});

// Setup associations
User.hasMany(Message, { as: 'SentMessages', foreignKey: 'sender_id', onDelete: 'CASCADE' });
User.hasMany(Message, { as: 'ReceivedMessages', foreignKey: 'receiver_id', onDelete: 'CASCADE' });
Message.belongsTo(User, { as: 'Sender', foreignKey: 'sender_id' });
Message.belongsTo(User, { as: 'Receiver', foreignKey: 'receiver_id' });

module.exports = Message;
