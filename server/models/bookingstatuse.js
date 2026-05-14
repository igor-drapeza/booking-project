const sequelize = require('../db')
const {DataTypes} = require('sequelize')

const BookingStatuse = sequelize.define("booking_statuses", {
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
    }
}, {timestamps: false})

module.exports = BookingStatuse