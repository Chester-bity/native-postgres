const express = require('express');
var cors = require('cors')
var app = express()
app.use(cors());
app.use(express.json({ limit: '50mb' }));

const port = process.env.PORT || 5000; 

const config = require('./knexfile');
const environmentConfig = config["development"];
const knex = require('knex');
const connection = knex(environmentConfig);
app.listen(port,async () =>{ 
    await connection.migrate.latest().then(function () {
      }).catch(ex => {
        console.log("\x1b[31mMigrate Failed\x1b[37m");
      });
    console.log(`Listening on port ${port}`)
    }); 

//API   
//USER
const queryUser = require("./knex/queries/user")
app.get('/user/all', (req, res,next) => { 
    queryUser.getAll().then(data=>{
        console.log("data",data);
        res.json(data);
    }).catch(err=>{
        console.log("err",err);
        next(err);
    })
}); 

app.delete('/user/:id', (req, res,next) => { 
    const id = req.params.id;
    queryUser.delete(id).then(data=>{
        res.json({});
    }).catch(err=>{
        next(err);
    })
});

app.patch('/user/:id', (req, res,next) => { 
    const id = req.params.id;
    const body = req.body;
    queryUser.update(id,body).then(data=>{
        res.json({});
    }).catch(err=>{
        next(err);
    })
});

app.post('/user', (req, res,next) => {
    const body = req.body;
    queryUser.create(body).then(data=>{
        res.json({});
    }).catch(err=>{
        next(err);
    })
})