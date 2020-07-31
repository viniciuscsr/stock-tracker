const express = require('express');
const router = express.Router();

const pool = require('../db');
const middlewareObj = require('../middleware/index');
const axios = require('axios');
const totals = require('../customFunctions/totals');
const portifolioController = require('../controllers/portifolioController');

router.get('/', async (req, res) => {
  res.render('home');
});

// -----------------
// PORTIFOLIO INDEX
// -----------------

router.get(
  '/portifolio/',
  middlewareObj.isLoggedIn,
  portifolioController.portifolioIndex
);

// -----------------
// NEW TRANSACTION
// -----------------

router.get(
  '/portifolio/new',
  middlewareObj.isLoggedIn,
  portifolioController.getNewTransaction
);

router.post(
  '/portifolio/',
  middlewareObj.isLoggedIn,
  portifolioController.postNewTransaction
);

// -----------------
// UPDATE TRANSACTION
// -----------------

router.get(
  '/portifolio/:transactionid/edit',
  middlewareObj.isLoggedIn,
  portifolioController.getUpdateTransaction
);

router.patch(
  '/portifolio/:transactionid',
  middlewareObj.isLoggedIn,
  portifolioController.patchUpdateTransaction
);

// -----------------
// DELETE TRANSACTION
// -----------------

router.delete(
  '/portifolio/:transactionid',
  middlewareObj.isLoggedIn,
  portifolioController.deleteTransaction
);

// -----------------
// SHOW PAGE
// -----------------

router.get(
  '/portifolio/:symbol',
  middlewareObj.isLoggedIn,
  portifolioController.stockShowPage
);

module.exports = router;
