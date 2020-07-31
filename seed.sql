CREATE TABLE user1(
    id SERIAL PRIMARY KEY,
    name VARCHAR(50),
    username VARCHAR(50),
    email VARCHAR(50),
    password VARCHAR(200)
);

CREATE TABLE portifolio(
    symbol VARCHAR(50),
    shares INT,
    avg_price NUMERIC(10,4),
    userid VARCHAR(50),
    type VARCHAR(50),
    transactionid SERIAL PRIMARY KEY
);