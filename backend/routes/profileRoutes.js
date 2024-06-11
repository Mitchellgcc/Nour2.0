const express = require('express');
const { getProfile, updateProfile, deleteProfile } = require('../controllers/profileController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', authMiddleware, (req, res, next) => {
  // console.log("Accessing /profile route");
  getProfile(req, res, next);
});
router.put('/', authMiddleware, (req, res, next) => {
  // console.log("Accessing /profile PUT route");
  updateProfile(req, res, next);
});
router.delete('/', authMiddleware, (req, res, next) => {
  // console.log("Accessing /profile DELETE route");
  deleteProfile(req, res, next);
});

module.exports = router;
