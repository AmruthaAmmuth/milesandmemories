const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const Memory = sequelize.define('Memory', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    image_path: {
        type: DataTypes.STRING,
        allowNull: false
    },
    category: {
        type: DataTypes.ENUM('Golden', 'Lovely'),
        defaultValue: 'Lovely'
    }
}, {
    timestamps: true,
    tableName: 'memories'
});

// Setup association
User.hasMany(Memory, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Memory.belongsTo(User, { foreignKey: 'user_id' });

module.exports = Memory;
