const sequelize = require('../db.js')
const { DataTypes } = require('sequelize')

const { User } = require('./user.js')
const { Service } = require('./service.js')
const { ScheduleSlot } = require('./scheduleSlot.js')
const BookingStatuse = require('./bookingStatuse.js')

const Booking = sequelize.define("bookings", {

    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
    },

    user_id: {
        type: DataTypes.UUID,
        allowNull: false
    },

    master_id: {
        type: DataTypes.UUID,
        allowNull: false
    },

    service_id: {
        type: DataTypes.UUID,
        allowNull: false
    },

    slot_id: {
        type: DataTypes.UUID,
        allowNull: false,
        unique: true
    },

    status_id: {
        type: DataTypes.UUID,
        allowNull: false
    },

    booking_date: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },

    total_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },

    comment: {
        type: DataTypes.TEXT
    },

    confirmedAt: {
        type: DataTypes.DATE
    },

    completedAt: {
        type: DataTypes.DATE
    },

    cancelledAt: {
        type: DataTypes.DATE
    }

})

User.hasMany(Booking, {foreignKey: 'user_id'})
Booking.belongsTo(User, {foreignKey: 'user_id', as: 'user'})
User.hasMany(Booking, {foreignKey: 'master_id'})
Booking.belongsTo(User, {foreignKey: 'master_id', as: 'master'})
Service.hasMany(Booking, {foreignKey: 'service_id'})
Booking.belongsTo(Service, {foreignKey: 'service_id'})
ScheduleSlot.hasOne(Booking, {foreignKey: 'slot_id'})
Booking.belongsTo(ScheduleSlot, {foreignKey: 'slot_id'})
BookingStatuse.hasMany(Booking, {foreignKey: 'status_id'})
Booking.belongsTo(BookingStatuse, {foreignKey: 'status_id', as: 'status'})

module.exports = {
    Booking,
    User,
    Service,
    ScheduleSlot,
    BookingStatuse
}