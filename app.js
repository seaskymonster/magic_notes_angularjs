var express = require('express');
var dust = require('dustjs-linkedin');
var cons = require('consolidate');
var gzippo = require('gzippo');
var path = require('path');

var session = require('express-session');
var BaseModel=require('./database/base_model');
var app = express();

// var routes = require('./routes/index');

app.configure(function() {
        //app.use(gzippo.staticGzip(__dirname + '/static'));
        app.use(express.static(path.join(__dirname, 'static')));
        //app.use(gzippo.compress());
        app.use(express.cookieParser());
        app.use(express.session({secret: 'ssshhhhh'}));

        app.use(express.methodOverride());
        app.use(express.bodyParser());

        app.use(app.router);
        var sess;

        app.get("/auth/getUserInfo", function(req,res){
          var baseModel=new BaseModel();
          var tableName="users";
        
          sess=req.session;
          if(sess.idx){
               var idJson={};
                  console.log(sess.idx+"dddddddd");
                  idJson.id=sess.idx;
               baseModel.findOneById(tableName,idJson, function(ret){
               console.log(ret);
               res.send(ret);
               }); 
          }else{
            res.send(false);
          }
         

        });

         app.post("/auth/login", function(req,res){
          var baseModel=new BaseModel();
          var tableName="users";
          
          var whereJson={};
          
          var orJson={};
          var andJson1={};
              andJson1["key"]="username";
              andJson1["opts"]="=";
              andJson1["value"]=JSON.stringify(req.body.identity);
          var andJson2={};
              andJson2["key"]="password";
              andJson2["opts"]="=";
              andJson2["value"]=JSON.stringify(req.body.password);

          var andArr=[andJson1,andJson2];
          var orArr=[];
              whereJson["and"]=andArr;
              whereJson["or"]=orArr;
          
         
          
          console.log(whereJson);
          

          // var whereJson={
          //   'and': [{'key':'username', 'opts':'=', 'value':'""'},
          //           {'key':'password', 'opts':'=', 'value':'"2760ede5bc23a257c714a0eb93aff50da98eb662"'}],
          //   'or':[]
          // };

          var fieldsArr=[];
          var orderByJson;
          var limitArr=[];

          sess=req.session;
          sess.username=req.body.identity;
          sess.password=req.body.password;
          // console.log(sess.username+"username"+sess.password);
          baseModel.find(tableName,whereJson,orderByJson,limitArr,fieldsArr,function(ret){
            var tmp=ret.pop();
            sess.idx=tmp.id;
            res.send(tmp);

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
            sess=req.session;
            console.log(sess);
            console.log(sess.idx+"session_id");
            idJson.user_id=sess.idx;
            console.log(idJson.user_id);
            baseModel.findAllById(tableName,idJson, function(ret){
            res.send(ret);
         });  
    });

    app.get("/notebook/getPublicBookList", function(req,res){
          var baseModel=new BaseModel();
          var tableName="NOTEBOOKS";
          var whereJson={};
          
          var orJson={};
          var andJson1={};
              andJson1["key"]="private";
              andJson1["opts"]="=";
              andJson1["value"]="0";
          var andArr=[andJson1];
          var orArr=[];
              whereJson["and"]=andArr;
              whereJson["or"]=orArr;
          var fieldsArr=[];
          var orderByJson;
          var limitArr=[];
          
            baseModel.find(tableName,whereJson,orderByJson,limitArr,fieldsArr,function(ret){
            res.send(ret);
         });  
    });
    


        app.post("/notebook/createNotebook", function(req,res){  //create new note book
             var baseModel=new BaseModel();
             var tableName="NOTEBOOKS";
             sess=req.session;
             var rowInfo={};
             rowInfo.user_id=sess.idx;
             rowInfo.name=req.body.strNotebookName;
             rowInfo.private=req.body.isPrivate;
             baseModel.insert(tableName,rowInfo,function(ret){
                 
                 rowInfo.id=ret.insertId;
                 res.send(rowInfo);
             });
  
        });
    

      app.get("/notes/getNoteList/:notebookId?", function(req,res){  //get the note list
          var baseModel=new BaseModel();
          var tableName="NOTES";
          var idJson={};
            idJson.notebook_id=req.param('notebookId');
            console.log(req.param('notebookId'));
            baseModel.findAllById(tableName,idJson, function(ret){
            // ret.each(function(note){
            //    note.ownership=true;
            // });

            console.log(ret);
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
        
          // rowInfo.passowrd_confirm=req.body.password_confirm;
          baseModel.insert(tableName,rowInfo,function(ret){
          console.log(ret);
          res.send(ret);
         });

        });
  
      app.post("/notebook/deleteBook", function(req,res){
        var baseModel=new BaseModel();
        var tableName="NOTEBOOKS";
        var idJson={};
        idJson.id=req.body.noteBookId;
        baseModel.remove(tableName,idJson,function(ret){
          console.log(ret);
          res.send(ret);
        });
      })

      app.post("/notes/deleteNote", function(req,res){
        var baseModel=new BaseModel();
        var tableName="NOTES";
        var idJson={};
        idJson.id=req.body.noteId;
        baseModel.remove(tableName,idJson,function(ret){
          console.log(ret);
          res.send(ret);
        });
      })
      
      
      app.post("/auth/edit_user/:id",function(req,res){
         var baseModel=new BaseModel();
         var tableName="users";
         // sess=req.session;
         var idJson={};
         idJson.id=req.params.id;
         var rowInfo={};
         rowInfo.first_name=req.body.first_name;
         rowInfo.last_name=req.body.last_name;
         rowInfo.email=req.body.email;
         rowInfo.password=req.body.password;
         baseModel.modify(tableName,idJson,rowInfo,function(ret){
          console.log(ret);
          res.send(ret);
         });


      })


        app.set('view options', {
                layout: false
        });
        app.set('view engine', 'dust');
});

app.listen(8000);

