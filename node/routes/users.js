const { response } = require('express');
const express = require('express');
const Joi = require('joi');
const mysql = require('mysql');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

let expiredTokens = [];

const pool = mysql.createPool({
    connectionLimit: 100,
    host: 'localhost',
    user: 'root',
    // password: '',
    database: 'skriptproj'
});

//instaciranje rutera
const route = express.Router();

route.use(express.json());

route.post('/sign-up', (req, res) => {
    bcrypt.hash(req.body.password, 10, (err, hash) => {
        if (err) {
            return res.status(500).send({
                msg: err
            });
        } else {
            let query = "insert into baza_users (username, password) values (?,?)";
            let formated = mysql.format(query, [req.body.username, hash]);
            console.log(formated);
            //izvrsavanje query-ja
            pool.query(formated, (err, response) => {
                if (err) {
                    res.status(500).send(err.sqlMessage);
                }
                else {
                    query = "select id,username from baza_users where id=?";
                    formated = mysql.format(query, [response.insertId]);

                    pool.query(formated, (err, rows) => {
                        if (err) {
                            res.status(500).send(err.sqlMessage);
                        }
                        else {
                            // res.send(rows[0]);
                            const token = jwt.sign({ user: rows[0] }, "MySecret", { expiresIn: 100 * 60 * 100000 });
                            res.json(token);
                        }
                    });
                }
            });
        }
    });
});

route.post('/login', (req, res) => {
    const password = req.body.password;
    const query = "select * from baza_users where username=?";
    const formated = mysql.format(query, [req.body.username]);
    console.log(formated);

    pool.query(formated, (err, response) => {
        console.log(response);
        if (err) {
            res.status(500).send(err.sqlMessage);
        }
        else {
            if (!response || response.length === 0) {
                res.status(404).send("Bad credentials");
            }
            else {
                console.log(response[0]['password']);
                console.log(password);
                if (!bcrypt.compareSync(password, response[0]['password'])) {
                    res.status(404).send("Invalid password");
                }
                else {
                    const token = jwt.sign({ user: { id: response[0].id, username: response[0].username } }, "MySecret", { expiresIn: 100 * 60 });
                    // res.json(token);
                    res.json({ id: response[0].id, username: response[0].username, token: token });

                }


            }
        }
    });

});

//u telu zahteva prosledjujemo token
route.post('/logout', (req, res) => {
    const token = req.body.token;

    //nalazimo prvi elem niza koji se poklapa sa tokenom
    const t1 = expiredTokens.find(element => element === token);

    if (!t1) {
        expiredTokens.push(token);
    }

    console.log(token);
    console.log(expiredTokens);

    res.json({ status: true });
});

//provera validnosti tokena
route.post('/verify', (req, res) => {
    const token = req.body.token;

    const t1 = expiredTokens.find(element => element === token);

    //ako se ne nalazi u nizu, validan je
    if (!t1) {
        jwt.verify(token, "MySecret", (err, user) => {
            if (err) {
                res.json({ success: false, error: err });
            }
            else {
                res.json({ success: true, user: user });
            }
        });
    }
    else {
        res.json({ success: false, error: "expired" });
    }

});

module.exports = { expiredTokens: expiredTokens, route: route };
//module.exports = route;