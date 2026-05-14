const sequelize = require('../db.js')
const {DataTypes} = require('sequelize')
const ServiceCategory = require('./serviceCategory.js')
const { User } = require('./user.js')

const Service = sequelize.define("services", {
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
    category_id: {
        type: DataTypes.UUID,
        allowNull: false
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    duration_minutes: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 60
    },
    rating: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
})

User.hasMany(Service, {foreignKey: 'master_id'})
Service.belongsTo(User, {foreignKey: 'master_id'})

ServiceCategory.hasMany(Service, {foreignKey: 'category_id'})
Service.belongsTo(ServiceCategory, {foreignKey: 'category_id'})

module.exports = {
    ServiceCategory,
    User,
    Service
}