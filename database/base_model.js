var Util=require('./util'); // you need to know what is Util
var mysql=require('mysql');  // you need to know what is mysql..
var dbClient;

module.exports =function(){
	_constructor();

	this.findOneById=function(tableName,idJson,callback){
       dbClient.query('SELECT * FROM ' + tableName +' where ?', idJson, 
       	   function(error, results){
       	   	   if(error){
       	   	   	   console.log('GetData Error:' + error.message);
       	   	   	   dbClient.end();
       	   	   	   callback(false);// return false;; if there are some error....
       	   	   }else{

       	   	   	     if(results){ // if you can look up one data...
       	   	   	     	callback(results.pop());  //in this pop(), it is good when you want to console one item of the json..
       	   	   	     }else{ // if the pop data is empty.....
       	   	   	    	callback(results);
       	   	   	     }
       	   	   }
       	   });
	};

this.findAllById=function(tableName,idJson,callback){
       dbClient.query('SELECT * FROM ' + tableName +' where ?', idJson, 
           function(error, results){
               if(error){
                   console.log('GetData Error:' + error.message);
                   dbClient.end();
                   callback(false);// return false;; if there are some error....
               }else{

                     if(results){ // if you can look up one data...
                      callback(results);  //in this pop(), it is good when you want to console one item of the json..
                     }else{ // if the pop data is empty.....
                      callback(results);
                     }
               }
           });
  };

	this.insert=function(tableName,rowInfo,callback){
        dbClient.query('INSERT INTO ' +tableName+' SET ?',rowInfo, function(error,result){  //change rowInfo's JSON to "key==value" format
        	if(error){
            console.log("InsertData Error"+ error.message);
            dbClient.end();
            callback(false);
          }else{
            callback(true);
          }
       });
	};

	this.modify=function(tableName,idJson,rowInfo,callback){
         dbClient.query('UPDATE ' + tableName +' SET ? where ?',[rowInfo, idJson], function(err, result){
         	if(err){
         		console.log("ClientReady Error: " +err.message);
         		callback(false);
         	}else{
         		callback(result);
         	}
         });
	};


	this.remove=function(tableName,idJson,callback){
         dbClient.query('DELETE FROM '+tableName +' where ?',idJson,
          function(err,results){
         	if(err){
         		console.log("ClientReady Error: "+err.message);
         		dbClient.end();
         		callback(false);
         	}else{
         		callback(true);
         	}
         });
	};

  this.finduser=function(tableName,username,password,callback){
        dbClient.query('SELECT * FROM ' + tableName +' where?', [username, password], 
          function(error,results){
          if(error){
             console.log("ClientReady Error: "+error.message);
             callback(false);
          }else{
            callback(true);
          }
        });
  };

	this.find=function(tableName, whereStr, orderStr, limitStr, fieldsStr, callback){
         dbClient.query('SELECT' +fieldsStr +'FROM' +tableName +'where' + andStr + orStr +orderStr +limitStr, function(err,results){
          if(err){
            console.log("ClientReady Error: "+err.message);
            dbClient.end();
            callback(false);
          }else{
            callback(result);
          }
         });
	};

	function _constructor(){
		
		var dbConfig=Util.get('config.json','db');

		client={};
		client.host=dbConfig['host'];
		client.port=dbConfig['port'];
		client.user=dbConfig['user'];
		client.password=dbConfig['password'];
        
		dbClient=mysql.createConnection(client);  //create the connection object... 
		dbClient.connect();  //connect to mysql...

		dbClient.query('USE '+dbConfig['dbName'], function(error, results){  // USE is used to connect MYSQL's one database....
			if(error){
				console.log('ClientConnectionReady Error:'+ error.message);
				dbClient.end();
			}else{
			console.log('connection local mysql success');
		    }
		});

	}
}