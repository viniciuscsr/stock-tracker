const pool = require('../db');

function totalShares(userId, ticker) {
  return pool.query(
    'SELECT SUM (shares) AS total FROM portifolio WHERE userid=$1 AND symbol=$2',
    [userId, ticker]
  );
}

exports.totalShares = totalShares;
