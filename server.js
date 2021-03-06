var express = require('express');
var morgan = require('morgan');
var mongoose = require('mongoose');
var app = express();
var port = process.env.PORT || 8080;
var bodyParser = require('body-parser');
var router = express.Router();

mongoose.connect('mongodb://vatsal:vatsal1@ds123171.mlab.com:23171/chirpapp', function(err){
	if(err){
		console.log('NOT connected to MongoDB' + err);
	}
	else{
		console.log('Succesfully connected to MongoDB');
	}
});
require('./app/models/user.js');

var appRoutes = require('./app/routes/api')(router);
var path = require('path');
var passport = require('passport');
var social = require('./app/passport/passport')(app, passport);

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));
app.use('/api', appRoutes);

app.get('*', function(req, res){
	res.sendFile(path.join(__dirname + '/public/app/views/index.html'));
});

app.listen(port, function(){
	console.log('Running the server on port ' + port);
});