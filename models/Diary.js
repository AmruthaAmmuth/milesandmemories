const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const Diary = sequelize.define('Diary', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    text: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    timestamps: true,
    tableName: 'diaries'
});

// Setup association
User.hasMany(Diary, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Diary.belongsTo(User, { foreignKey: 'user_id' });

module.exports = Diary;
