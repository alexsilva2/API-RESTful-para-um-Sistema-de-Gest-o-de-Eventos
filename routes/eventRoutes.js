const express = require('express');
const { Transaction, fn, col } = require('sequelize');
const sequelize = require('../database');
const { Event, Registration } = require('../models');
const { validateEvent, validateRegistration } = require('../middleware/validation');

const router = express.Router();

router.post('/', validateEvent, async (req, res) => {
  const event = await Event.create(req.body);
  res.status(201).json(event);
});

router.get('/', async (req, res) => {
  const events = await Event.findAll({
    attributes: {
      include: [[fn('COUNT', col('registrations.id')), 'registrationCount']],
    },
    include: [{ model: Registration, as: 'registrations', attributes: [] }],
    group: ['Event.id'],
    order: [['id', 'ASC']],
  });

  res.json(events);
});

router.post('/:id/register', validateRegistration, async (req, res) => {
  const eventId = Number(req.params.id);

  if (!/^\d+$/.test(req.params.id) || !Number.isSafeInteger(eventId) || eventId < 1) {
    return res.status(400).json({ message: 'O ID do evento deve ser um inteiro positivo.' });
  }

  const result = await sequelize.transaction(
    { type: Transaction.TYPES.IMMEDIATE },
    async (transaction) => {
      const event = await Event.findByPk(eventId, { transaction });

      if (!event) {
        return { status: 404, body: { message: 'Evento não encontrado.' } };
      }

      const registrationCount = await Registration.count({ where: { eventId }, transaction });

      if (registrationCount >= event.capacity) {
        return { status: 403, body: { message: 'O evento está lotado.' } };
      }

      const registration = await Registration.create(
        { ...req.body, eventId },
        { transaction },
      );

      return { status: 201, body: registration };
    },
  );

  res.status(result.status).json(result.body);
});

module.exports = router;
