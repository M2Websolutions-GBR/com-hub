const express = require('express');
const {
  getHistories,
  createHistory,
  deleteHistory,
  deleteHistories
} = require('../controllers/histories');

const History = require('../models/History');

const router = express.Router();

const advancedResults = require('@comhub/middleware/advancedResults');
const { protect } = require('@comhub/middleware/auth');

router.use(protect);

router
  .route('/')
  .get(
    advancedResults(History, [{ path: 'videoId' }, { path: 'userId' }], {
      type: 'watch' // Filter nach Typ 'watch'
    }),
    getHistories
  )
  .post(createHistory);

router.route('/:id').delete(deleteHistory);

router.delete('/:type/all', deleteHistories);

module.exports = router;
