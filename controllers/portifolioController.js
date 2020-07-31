const portifolioController = {};

const pool = require('../db');
const axios = require('axios');
const totals = require('../customFunctions/totals');

// -----------------
// PORTIFOLIO INDEX
// -----------------

portifolioController.portifolioIndex = async (req, res) => {
  // Getting all symbols from transactions by a specific user
  let dbStock;
  try {
    dbStock = await pool.query(
      'SELECT symbol, shares FROM portifolio WHERE userid=$1',
      [req.user.id]
    );
  } catch (err) {
    console.log(err);
  }
  let portifolioArray = [];

  //Loop to create the array with each symbol in the transactions table

  for (let index = 0; index < dbStock.rows.length; index++) {
    let ticker = dbStock.rows[index].symbol;
    let duplicatedSymbol = portifolioArray.find(
      ({ symbol }) => symbol === ticker
    );
    // Removing duplicated symbols
    if (typeof duplicatedSymbol !== 'undefined') {
      continue;
    }
    // Calculating total of shares for each symbol in the portifolio

    let totalShares;
    try {
      totalShares = await totals.totalShares(req.user.id, ticker);
      // Fetching the current price from an external API (FREE VERSION LIMIT = 5 requests per minute)
      let endOfDayPriceApi;
      try {
        endOfDayPriceApi = await axios.get(
          `https://api.tiingo.com/tiingo/daily/${ticker}/prices?token=${process.env.TIINGO_TOKEN}`
        );
      } catch (err) {
        console.log(err);
      }
      // Final object
      let finalStock = {
        symbol: ticker,
        totalShares: totalShares.rows[0].total,
        currentPrice: endOfDayPriceApi.data[0].adjClose,
      };
      // Pushing the final stock object to the array
      portifolioArray.push(finalStock);
    } catch (err) {
      console.log(err);
    }
  }
  res.render('stock/portifolio', {
    portifolio: portifolioArray,
  });
};

// -----------------
// NEW TRANSACTION
// -----------------

portifolioController.getNewTransaction = (req, res) => {
  res.render('stock/newTransaction');
};

portifolioController.postNewTransaction = (req, res) => {
  let { symbol, shares, avgPrice, type } = req.body;
  // Reversing the shares sign if equals to sell
  if (type === 'sell') {
    shares = shares * -1;
  }
  // Inserting transaction into the db
  pool.query(
    'INSERT INTO portifolio(symbol, shares, avg_price, userid, type) VALUES($1, $2, $3, $4, $5)',
    [symbol, shares, avgPrice, req.user.id, type],
    (err, result) => {
      if (err) {
        console.log(err);
      }
      res.redirect('/portifolio/');
    }
  );
};

// -----------------
// UPDATE TRANSACTION
// -----------------

portifolioController.getUpdateTransaction = async (req, res) => {
  let transaction;
  try {
    transaction = await pool.query(
      'SELECT * FROM portifolio WHERE transactionid=($1)',
      [req.params.transactionid]
    );
  } catch (err) {
    console.log(err);
  }
  res.render('stock/update', { transaction: transaction.rows[0] });
};

portifolioController.patchUpdateTransaction = (req, res) => {
  const { shares, avgPrice, type } = req.body;

  pool.query(
    'UPDATE portifolio SET shares=($1), avg_price=($2), type=($3) WHERE transactionid=($4)',
    [shares, avgPrice, type, req.params.transactionid],
    (err, result) => {
      if (err) {
        console.log(err);
      }
      res.redirect('/portifolio/');
    }
  );
};

// -----------------
// DELETE TRANSACTION
// -----------------

portifolioController.deleteTransaction = (req, res) => {
  pool.query(
    'DELETE FROM portifolio WHERE transactionid=($1)',
    [req.params.transactionid],
    (err, result) => {
      if (err) {
        console.log(err);
      }
      res.redirect('/portifolio/');
    }
  );
};

// -----------------
// SHOW PAGE
// -----------------

portifolioController.stockShowPage = async (req, res) => {
  const upperSymbol = req.params.symbol.toUpperCase();
  let dbStock;

  //finding the stock info in the DB
  try {
    dbStock = await pool.query(
      'SELECT * FROM portifolio WHERE userid=$1 AND symbol=$2',
      [req.user.id, upperSymbol]
    );
  } catch (err) {
    console.log(err);
  }
  if (dbStock.rows.length === 0) {
    return res.json({ message: 'Stock not found' });
  }

  // getting data from the stock api
  let endOfDayPriceApi;
  try {
    endOfDayPriceApi = await axios.get(
      `https://api.tiingo.com/tiingo/daily/${upperSymbol}/prices?token=${process.env.TIINGO_TOKEN}`
    );
  } catch (err) {
    console.log(err);
  }

  //getting data from the stock news api
  let stockNews;

  try {
    stockNews = await axios.get(
      `https://newsapi.org/v2/everything?q=${upperSymbol}&language=en&domains=finance.yahoo.com,fool.com,cnbc.com,investors.com&apiKey=2ab77b0b4af442d9851c5e7fe42bd557`
    );
  } catch (err) {
    console.log(err);
  }

  // total shares
  let tShares;
  try {
    tShares = await totals.totalShares(req.user.id, upperSymbol);
  } catch (err) {
    console.log(err);
  }

  const stockObj = {
    symbol: upperSymbol,
    currentPrice: endOfDayPriceApi.data[0].adjClose,
    shares: tShares.rows[0].total,
    avgPrice: dbStock.rows[0].avg_price,
    news: stockNews.data.articles,
    transactions: dbStock.rows,
  };

  res.render('stock/stock', { stock: stockObj });
};

module.exports = portifolioController;
