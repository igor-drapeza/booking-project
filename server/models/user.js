const sequelize = require('../db.js')
const {DataTypes} = require('sequelize')
const Role = require('./role')

const User = sequelize.define("users", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password_hash: {
        type: DataTypes.STRING,
        allowNull: false
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false
    },
    avatar_url: {
        type: DataTypes.STRING,
        allowNull: true
    },
    role_id: {
        type: DataTypes.UUID,
        allowNull: false
    }
})

Role.hasMany(User, {foreignKey: 'role_id'})

User.belongsTo(Role, {foreignKey: 'role_id'})

module.exports = { 
    Role,
    User
}