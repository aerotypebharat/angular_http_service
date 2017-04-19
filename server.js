var express = require('express');
var bodyParser = require('body-parser');
var mysql = require("mysql");
var connection = require("express-myconnection");
var app = express();

app.use(bodyParser.json());  //to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ //to support URL-encoded bodies
    extended:true
}));

//Hosting static files
app.use(express.static(__dirname + '/'));
console.log("Static files initialized...");

// Create Sql Connection
app.use(connection(mysql, {
    host     : 'localhost',
    user     : 'uibatch6',
    password : 'password123',
    database : 'sampledb'
},'request'));

console.log("Query Setup complete...")

//collection of services.
var services ={
    "person":{
        "get":{
            
            "all":{
                "url":"/service/person/all",
                "query":"SELECT * FROM persontbl",
                "params":[]
            },
            "active":{
                "url":"/service/person",
                "query":"SELECT * FROM persontbl WHERE active = 1",
                "params":[]
            },
            "inactive":{
                "url":"/service/person/inactive",
                "query":"SELECT * FROM persontbl WHERE active = 0",
                "params":[]
            },
            "byId":{
                "url":"/service/person/:personid",
                "query":"SELECT * FROM persontbl where personid = ?",
                "params":['personid']
            }
        },
        "post":{
            "url":"/service/person",
            "query":"INSERT INTO persontbl SET ?",
            "params":[]
        },
        "put":{
            "url":"/service/person/:id",
            "query":"UPDATE persontbl SET ? WHERE personid = ?",
            "params":[]
        },
        "delete":{
            "url":"/service/person/:personid",
            "query":"DELETE FROM persontbl WHERE personid = ?",
            "params":["personid"]
        }
    },
    "company":{
        "get":{
            "active":{
                "url":"/service/company",
                "query":"select * from companytbl where active = 1",
                "params":[]    
            }
        },
        "put":{
            "url":"/service/companies/:id",
            "query":"UPDATE companytbl SET ? WHERE companyid = ?",
            "params":[]
        },
        "delete":{
            "url":"/service/companies/:companyid",
            "query":"DELETE FROM companytbl WHERE companyid = ?",
            "params":["companyid"]
        }
    }
};
console.log("Service API collections instantiated...");

//Generating API from service collection
for(var key in services){
    if (services[key].hasOwnProperty('post')){
        createPostServices(services[key].post.url,services[key].post.query,services[key].post.params);   
    }
    
    //Creating rest services for different properties in the GET object
    if (services[key].hasOwnProperty('get')){
        for (var service in services[key]["get"]){
            createGetServices(services[key]['get'][service].url,services[key]['get'][service].query,services[key]['get'][service].params); 
        } 
    }
    if (services[key].hasOwnProperty('put')){
        createPutServices(services[key].put.url,services[key].put.query,services[key].put.params);
    }
    if (services[key].hasOwnProperty('delete')){
        createDeleteServices(services[key].delete.url,services[key].delete.query,services[key].delete.params);
    }
    
} 
console.log("REST API modules ready for launch...");

//Function to create get services
function createGetServices(url,query,params){
    console.log("Creating GET services for... " + url);
    app.get(url,function(req,res,next){
        //Array to store dynamic parameters
        var ids = [];
        for (var i=0;i<params.length;i++){
            ids.push(req.params[params[i]]);
        }
       req.getConnection(function(err, connection) {
          if (err) return next(err);

          connection.query(query,ids, function(err, results) {
            if (err){
              console.log(err);
              return next("Mysql error, check your query");  
            }         
            res.json(results);
          });      
        });   
    });
}

/**
Function to genreate the post service
**/
function createPostServices(url,query,params){
    console.log("Creating POST services for... " + url);
    app.post(url,function(req,res,next){
        var reqObj = req.body;
        req.getConnection(function(err, connection){
            if (err) return next(err);
            var queryx =connection.query(query,reqObj,function(err,results){
                if (err){
                    console.log(err);
                    return next("Mysql error, check your query ");  
                }         
                res.json(results);
            });
        });
    });
}

/**
Function to generate the put services
**/
function createPutServices(url,query,params){
    console.log("Creating PUT services for... "+url);
    app.put(url,function(req,res,next){
        var id=req.params.id;
        var reqObj = req.body;
        req.getConnection(function(err, connection){
            if (err) return next(err);
            var queryx =connection.query(query,[reqObj,id],function(err,results){
                if (err){
                    console.log(err);
                    return next("Mysql error, check your query ");  
                }         
                res.json(results);
            });
        });
    });
}

function createDeleteServices(url,query,params){
    console.log("Creating DELETE services for ... "+url);
    app.delete(url,function(req,res,next){
        //Array to store dynamic parameters
        var ids = [];
        for (var i=0;i<params.length;i++){
            ids.push(req.params[params[i]]);
        }
        req.getConnection(function(err, connection){
            if (err){
                return next(err);
            }
            connection.query(query, ids, function(err, results){
                if (err){
                    console.log(err);
                }
                res.json(results);
            })
        })
        
    })
}

//Routes
app.get('/', function (req, res) {
    res.redirect('/views/index.html');
});

//Launching server
app.listen(8000, function (req,res) {
  console.log("Opening port 8000");    
  console.log('application launched at localhost:8000');
});