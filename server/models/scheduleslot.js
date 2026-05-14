const sequelize = require('../db.js')
const {DataTypes} = require('sequelize')
const { User } = require('./user.js')

const ScheduleSlot = sequelize.define("schedule_slots", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    master_id: {
        type: DataTypes.UUID,
        allowNull: false
    },
    start_time: {
        type: DataTypes.DATE,
        allowNull: false
    },
    end_time: {
        type: DataTypes.DATE,
        allowNull: false
    },
    is_booked: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
})

User.hasMany(ScheduleSlot, {foreignKey: 'master_id'})
ScheduleSlot.belongsTo(User, {foreignKey: 'master_id'})

module.exports = {
    ScheduleSlot,
    User
}