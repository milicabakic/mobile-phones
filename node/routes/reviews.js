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

const route = express.Router();

const schema = Joi.object().keys({
    user: Joi.string().trim().min(4).max(20).required(),
    user_id: Joi.number().required(),
    idTelefona: Joi.number().greater(0),
    ocena: Joi.number().max(10).greater(0).required()
});

route.use(express.json());


route.get('/ocena', (req,res)=>{
    pool.query('select * from baza_ocena', (err, rows)=>{
        if(err){
            res.status(500).send(err.sqlMessage);
        }
        else{
            res.send(rows);
        }
    });
});

route.post('/ocena', (req, res)=> {
    let { error } = Joi.validate(req.body, schema);

    if(error){
        res.status(400).send(error.details[0].message);
        console.log(error.details[0].message);
    }
    else{
        let query = "insert into baza_ocena (user_id, user, idTelefona_id, ocena) values (?,?,?,?)";
        let formated = mysql.format(query, [req.body.user_id, req.body.user, req.body.idTelefona, req.body.ocena]);

        //izvrsavanje query-ja
        pool.query(formated, (err, response)=> {
            if(err){
                res.status(500).send(err.sqlMessage);
            }
            else{
                query = "select * from baza_ocena where id=?";
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




route.get('/ocena/:idTelefona', (req, res) => {
    let query = "select * from baza_ocena where idTelefona_id=?";
    let formated = mysql.format(query, [req.params.idTelefona]);

    pool.query(formated, (err, rows)=>{
        if(err){
            res.status(500).send(err.sqlMessage);
        }
        else{
            res.send(rows);
        }
    });
})


route.put('/ocena/:idOcene/:idTelefona/:userId', (req,res)=>{
       let query = "update baza_ocena set ocena=? where id=? and idTelefona_id=? and user_id=?";
       let formated = mysql.format(query, [req.body.ocena,req.params.idOcene, req.params.idTelefona, req.params.userId]);

       pool.query(formated, (err,response)=>{
           if(err){
               res.status(500).send(err.sqlMessage);
           }
           else{
               query = "select * from baza_ocena where id=? and idTelefona_id=?";
               formated = mysql.format(query, [req.params.idOcene, req.params.idTelefona]);

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
});


module.exports = route;
