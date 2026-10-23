const Event = require('./Event');
const Registration = require('./Registration');

Event.hasMany(Registration, { foreignKey: 'eventId', as: 'registrations' });
Registration.belongsTo(Event, { foreignKey: 'eventId', as: 'event' });

module.exports = { Event, Registration };
