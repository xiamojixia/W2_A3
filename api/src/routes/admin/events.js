const express = require('express');
const router = express.Router();
const {
  adminGetEvents,
  adminCreateEvent,
  adminUpdateEvent,
  adminDeleteEvent
} = require('../../controllers/adminEventsController');

router.get('/', adminGetEvents);
router.post('/', adminCreateEvent);
router.put('/:id', adminUpdateEvent);
router.delete('/:id', adminDeleteEvent);

module.exports = router;
