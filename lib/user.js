var Util=require('../api/util');
var mysql=require('mysql');  // you need to know what is mysql..
var db;

exports.getById = function user_get_auth (context, id) {
    db.query('SELECT * FROM users where id= ?', id,
        function(error, results){
            if(error){
                console.log('GetData Error:' + error.message);
                db.end();
            }else{
                if(results){
                    console.log('results', results);
                }else{
                }
            }
        });
};

exports.getByEmail = function user_get_by_email (context, email) {
    db.query('SELECT * FROM users where email= ?', email,
        function(error, results){
            if(error){
                console.log('GetData Error:' + error.message);
                db.end();
            }else{
                if(results){
                    console.log('results', results);
                }else{
                }
            }
        });
};

exports.save = function user_save(context, user) {

};
