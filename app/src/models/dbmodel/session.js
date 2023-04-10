const session = require('express-session');
const MySqlStore = require('express-mysql-session')(session);
const conf = require('../../databases/user');

const mysqlSession = session({
  secret: "ABCD1234ABAB!@",
  resave: false,
  saveUninitialized: true,
  store: new MySqlStore({
    host: conf.host,
    user: conf.user,
    password: conf.password,
    port: conf.port,
    database: conf.database,
  }),
});

module.exports = mysqlSession;