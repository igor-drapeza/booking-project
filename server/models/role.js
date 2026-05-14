const sequelize = require('../db')
const {DataTypes} = require('sequelize')

const Role = sequelize.define("roles", {
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
    description: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {timestamps: false})

module.exports = Role