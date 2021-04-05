const { response } = require('express');
const express = require('express');
const Joi = require('joi');
const mysql = require('mysql');

const pool = mysql.createPool({
    connectionLimit: 100,
    host: 'localhost',
    user: 'root',
   // password: '',
    database: 'skriptproj'
});

//instaciranje rutera
const route = express.Router();

const schema = Joi.object().keys({
    marka: Joi.string().max(20).required(),
    model: Joi.string().min(1).max(20).required(),
    memorija: Joi.string().min(3).required(),
    boja: Joi.string().max(15).required(),
    cena: Joi.number().positive().greater(30).required()
});

route.use(express.json());

route.get('/telefon', (req,res) => {
    //salje se upit ka bazi
    pool.query('select * from baza_telefon', (err,rows)=> {
        if(err){
            res.status(500).send(err.sqlMessage);
        }
        else{
            res.send(rows);
        }
    });
});

route.post('/telefon', (req,res)=> {
    let { error } = Joi.validate(req.body, schema);

    if(error){
        res.status(400).send(error.details[0].message);
    }
    else{
        let query = "insert into baza_telefon (marka, model, memorija, boja, cena) values (?,?,?,?,?)";
        let formated = mysql.format(query, [req.body.marka, req.body.model, req.body.memorija, req.body.boja, req.body.cena]);
        console.log(formated);
        //izvrsavanje query-ja
        pool.query(formated, (err, response)=> {
            if(err){
                res.status(500).send(err.sqlMessage);
            }
            else{
                query = "select * from baza_telefon where id=?";
                formated = mysql.format(query, [response.insertId]);

                pool.query(formated, (err,rows)=> {
                    if(err){
                        res.status(500).send(err.sqlMessage);
                    }
                    else{
                        res.send(rows[0]);
                    }
                });
            }
        });
    }
});


route.get('/telefon/:id', (req, res) => {
    let query = "select * from baza_telefon where id=?";
    let formated = mysql.format(query, [req.params.id]);

    pool.query(formated, (err, rows)=>{
        if(err){
            res.status(500).send(err.sqlMessage);
        }
        else{
            res.send(rows[0]);
        }
    });
})


route.put('/telefon/:id', (req,res)=>{
   let { error } = Joi.validate(req.body, schema);
   
   if(error){
       res.status(400).send(error.details[0].message);
   }
   else{
       let query = "update baza_telefon set marka=?, model=?, memorija=?, boja=?, cena=? where id=?";
       let formated = mysql.format(query, [req.body.marka,req.body.model,req.body.memorija,req.body.boja,req.body.cena,req.params.id]);

       pool.query(formated, (err,response)=>{
           if(err){
               res.status(500).send(err.sqlMessage);
           }
           else{
               query = "select * from baza_telefon where id=?";
               formated = mysql.format(query, [req.params.id]);

               pool.query(formated, (err, rows)=> {
                   if(err){
                       res.status(500).send(err.sqlMessage);
                   }
                   else{
                       res.send(rows[0]);
                   }
               });
           }
       });
   }
});

route.delete('/telefon/:id', (req, res) => {
    let query = 'select * from baza_telefon where id=?';
    let formated = mysql.format(query, [req.params.id]);

    pool.query(formated, (err, rows) => {
        if (err)
            res.status(500).send(err.sqlMessage);
        else {
            let telefon = rows[0];

            let query = 'delete from baza_telefon where id=?';
            let formated = mysql.format(query, [req.params.id]);

            pool.query(formated, (err, rows) => {
                if (err)
                    res.status(500).send(err.sqlMessage);
                else
                    res.send(telefon);
            });
        }
    });
});

module.exports = route;