const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Registration = sequelize.define('Registration', {
  participantName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: { notEmpty: true },
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: { isEmail: true },
  },
  eventId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'Events', key: 'id' },
  },
});

module.exports = Registration;
