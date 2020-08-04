const pool = require('../db');

class UserShares {
  constructor(symbol, userId) {
    (this.symbol = symbol), (this.userId = userId), (this.totalShares = 0);
  }

  async calculatingTotalShares() {
    this.totalShares = await pool.query(
      'SELECT SUM (shares) AS total FROM portifolio WHERE userid=$1 AND symbol=$2',
      [this.userId, this.symbol]
    );
    console.log(this.totalShares.rows);
    return this;
  }
}

const testUser = new UserShares('DIS', 2);
testUser.calculatingTotalShares();

function totalShares(userId, ticker) {
  return pool.query(
    'SELECT SUM (shares) AS total FROM portifolio WHERE userid=$1 AND symbol=$2',
    [userId, ticker]
  );
}

exports.totalShares = totalShares;
