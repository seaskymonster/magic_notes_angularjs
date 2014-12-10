var express = require('express');
var dust = require('dustjs-linkedin');
var cons = require('consolidate');
var gzippo = require('gzippo');
var path = require('path');

var BaseModel=require('./database/base_model');
var app = express();
// var routes = require('./routes/index');

app.configure(function() {
        //app.use(gzippo.staticGzip(__dirname + '/static'));
        app.use(express.static(path.join(__dirname, 'static')));
        //app.use(gzippo.compress());
        app.use(express.methodOverride());
        app.use(express.bodyParser());
        app.use(app.router);

        app.get("/auth/getUserInfo/:id", function(req,res){
          var baseModel=new BaseModel();
          var tableName="users";
          var idJson={};
              idJson.id=req.params.id;
          baseModel.findAllById(tableName,idJson, function(ret){
          res.send(ret);
         });

        });

         app.post("/auth/login", function(req,res){
          var baseModel=new BaseModel();
          var tableName="users";
          
          var rowInfo={};
          console.log(req.body.identity);
          console.log(req.body.password);
          var username=req.body.identity;
          var password=req.body.password;
     
          baseModel.finduser(tableName,username,password,function(ret){
          console.log(ret);
          res.send(ret);
         });

        });

       app.post("/auth/create_user", function(req,res){
          var baseModel=new BaseModel();
          var tableName="users";
          
          var rowInfo={};
          
          rowInfo.first_name=req.body.first_name;
          rowInfo.last_name=req.body.last_name;
          rowInfo.email=req.body.email;
          rowInfo.phone=req.body.phone;
          // rowInfo.phone2=req.body.phone2;
          // rowInfo.phone3=req.body.phone3;
          rowInfo.company=req.body.company;
          rowInfo.password=req.body.password;
          // rowInfo.passowrd_confirm=req.body.password_confirm;
          baseModel.insert(tableName,rowInfo,function(ret){
          console.log(ret);
          res.send(ret);
         });

        });


    app.get("/notebook/getBookList", function(req,res){
          var baseModel=new BaseModel();
          var tableName="NOTEBOOKS";
          var idJson={};
            idJson.user_id=2;
            baseModel.findAllById(tableName,idJson, function(ret){
            res.send(ret);
         });  
    });
    


       // app.post("notebook/createNotebook", function(req,res){  //create new note book
       //    var baseModel=new BaseModel();
       //    var tableName="NOTEBOOKS";
          
       //    var rowInfo={};
          
       //    rowInfo.first_name=req.body.first_name;
       //    rowInfo.last_name=req.body.last_name;
       //    rowInfo.email=req.body.email;
       //    rowInfo.phone=req.body.phone;
       //    // rowInfo.phone2=req.body.phone2;
       //    // rowInfo.phone3=req.body.phone3;
       //    rowInfo.company=req.body.company;
       //    rowInfo.password=req.body.password;
       //    // rowInfo.passowrd_confirm=req.body.password_confirm;
       //    baseModel.insert(tableName,rowInfo,function(ret){
       //    console.log(ret);
       //    res.send(ret);
       //   });

       //  });
    

      app.get("/notes/getNoteList/:notebookId?", function(req,res){  //get the note list
          var baseModel=new BaseModel();
          var tableName="NOTES";
          var idJson={};
            idJson.notebook_id=req.param('notebookId');
            console.log(req.param('notebookId'));
            baseModel.findAllById(tableName,idJson, function(ret){
            res.send(ret);
         });  
    });
    
   app.get("/notes/getNoteContent/:noteId?", function(req,res){ //get the note content
          var baseModel=new BaseModel();
          var tableName="NOTES";
          var idJson={};
            idJson.id=req.param('noteId');
            console.log(req.param('noteId'));
            baseModel.findOneById(tableName,idJson, function(ret){
           //   console.log(ret);
            res.send(ret);
         });  
    });
   
      app.post("/notes/saveNote", function(req,res){
          var baseModel=new BaseModel();
          var tableName="NOTES";
          var rowInfo={};
          rowInfo.notename=req.body.notename;
          rowInfo.content=req.body.content;
         
          
          console.log(rowInfo);
          var idJson={};
         
          idJson.id=req.body.noteId;
          
          // rowInfo.passowrd_confirm=req.body.password_confirm;
          baseModel.modify(tableName,idJson,rowInfo,function(ret){
          console.log(ret);
          res.send(ret);
         });

        });

       app.post("/notes/createNote", function(req,res){
          var baseModel=new BaseModel();
          var tableName="NOTES";
          
          var rowInfo={};
          rowInfo.notename=req.body.notename;
          rowInfo.content=req.body.content;
          rowInfo.notebook_id=req.body.notebookId;
          var idJson={};
         
          idJson.id=req.body.noteId;
          
          // rowInfo.passowrd_confirm=req.body.password_confirm;
          baseModel.update(tableName,idJson,rowInfo,function(ret){
          console.log(ret);
          res.send(ret);
         });

        });
  




        app.set('view options', {
                layout: false
        });
        app.set('view engine', 'dust');
});

app.listen(8000);

