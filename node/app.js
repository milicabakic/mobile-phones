const express = require('express');
const mobiles = require('./routes/mobiles');  // Nas ruter (REST API)
const reviews = require('./routes/reviews');  // Nas ruter (REST API)
const users = require('./routes/users');
const history = require('connect-history-api-fallback');
const path = require('path');
const jwt = require('jsonwebtoken');

const app = express();

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Authorization,Accept");
  next();
});


//app.use(jwt({
//  secret: "MySecret",
//  algorithms: 
//}));

// Kazemo aplikaciji da za rute koje pocinju sa '/api' koristi nas ruter
app.use('/api/users', users.route);


 //ne zelimo da useri bez tokena pristupaju /telefoni i /ocene
app.use(function (req, res, next) {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    //ako postoji, izvlacimo token
    const token = authHeader;
    const t1 = users.expiredTokens.find(element => element === token);

    //ako se ne nalazi u nizu, validan je
    if (!t1) {
      jwt.verify(token, "MySecret", (err, user) => {
        if (err) {
          res.json({ success: false, error: err });
        }
        else {
          req.user = user;
          next();
        }
      });
    }
    else {
      res.json({ success: false, error: "expired" });
    }
  }
  else {
    res.json({ success: false, error: "expired" });
  }
});
 

app.use(function (req, res, next) {
  if (!req.user) {
    res.sendStatus(401);
  }
  else
    next();
});  

app.use('/api', mobiles);
app.use('/api', reviews);


const staticMiddleware = express.static(path.join(__dirname, 'dist'));

app.use(staticMiddleware);
app.use(history());
app.use(staticMiddleware);

app.listen(8080);
