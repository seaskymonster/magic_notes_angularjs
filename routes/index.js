var express = require('express');
var router = express.Router();


//var BaseModel = require('./api/user');

router.get('/', function(req, res) {
  res.render('index', { title: 'Home' });
});




module.exports = router;

