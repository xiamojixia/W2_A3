const express = require('express');
const router = express.Router();
const {
  adminGetRegistrations,
  adminCreateRegistration,
  adminUpdateRegistration,
  adminDeleteRegistration
} = require('../../controllers/adminRegistrationsController');

router.get('/', adminGetRegistrations);
router.post('/', adminCreateRegistration);
router.put('/:id', adminUpdateRegistration);
router.delete('/:id', adminDeleteRegistration);

module.exports = router;
