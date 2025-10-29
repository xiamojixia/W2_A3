const express = require('express');
const router = express.Router();
const {
  adminGetOrgs,
  adminCreateOrg,
  adminUpdateOrg,
  adminDeleteOrg
} = require('../../controllers/adminOrganisationsController');

router.get('/', adminGetOrgs);
router.post('/', adminCreateOrg);
router.put('/:id', adminUpdateOrg);
router.delete('/:id', adminDeleteOrg);

module.exports = router;
