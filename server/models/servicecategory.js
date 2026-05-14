const sequelize = require('../db')
const {DataTypes} = require('sequelize')

const ServiceCategory = sequelize.define("service_categories", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {timestamps: false})

module.exports = ServiceCategory