
/**
 * Module dependencies.
 */

var express = require('express'),
	ct = require('./ct'),
	user = require('./users'),
	mongoose = require('mongoose'),
	form_models = require('./models/forms'),
	calendar = require('./models/Calendar.Model'),
	ct_form;

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({ secret: 'smorge is cool' }));
  app.use(express.compiler({ src: __dirname + '/public', enable: ['sass'] }));
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
  app.use(express.bodyParser());
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

app.helpers({
});

app.dynamicHelpers({ messages: require('express-messages'),  
	scripts: function(req, res){
		return ['jquery-1.5.1.min.js', 'jquery-ui-1.8.11.custom.min.js', 'jquery.toastmessage.js',
			'jquery.tools.min.js', 'app.effects.js', 'app.models.js'];
	},
	styles: function(req, res){
		return ['effects.css', 'jquery-ui-1.8.11.custom.css'];
	}
});

// mongodb models
form_models.defineFormModels(mongoose, function(){
	app.ct_form = CTForm = mongoose.model('ct_form');
});

// Routes

app.get('/', function(req, res){
  res.render('index', { title: 'layout'});
});

app.get('/message', function( req, res){
	res.render('index', {
		title: 'message in a bottle',
		layout: 'demo'
	});
});

app.get('/:area/:action.:format?/:target/:id?', setupDB, function(req, res){
	if(req.params.area == 'ct'){
		ct.dispatch(req.params, req, res);
	}
});

app.get('/:area/:action.:format?/:target/:year?/:month?/:day?', setupDB, function(req, res){
	if(req.params.area == 'ct'){
		ct.dispatch(req.params, req, res);
	}
});

// ct form
app.get('/forms/:area/:id?', function(req, res){
	switch(req.params.area){
		case 'ct_form':
			ct.view(req, res);
			break;
	}
});

app.post('/forms/:area/:action', connectToMongoose, function(req, res){
	switch(req.params.action){
		case 'process':
			ct.post(req, res);
			break;
	}
});

// user manipulation
app.post('/user/:action', setupDB, function(req, res){
	switch(req.params.action){
		case 'login':
			user.login(req, res);
			break;
	}
});

// errors
app.error(function(err, req, res){
  res.render('500', {
     error: err
  });
});

// custom middleware

function setupDB(req, res, next){
	var Client = require('mysql').Client,
		client = new Client();
	client.typeCast = false;
	client.user = 'nodeapp';
	client.password = 'n0d34pp';
	//client.user = 'root';
	//client.password = 'georgie';
	client.database = 'radiology';
	client.port = '/Applications/XAMPP/xamppfiles/var/mysql/mysql.sock';
	res.db = { client: client };

	next();
}

function connectToMongoose(req, res, next){
	mongoose.connect('mongodb://localhost/radiology');
	var model = mongoose.model(req.params.area);
	model = new model();
	req.mongoose = {
		db: mongoose,
		model: model
	};
	delete model;
	next();
}

/**
process.on('uncaughtException', function (err) {
  console.log('Caught exception: ' + err);
	console.log('arguments: ' + arguments[0])
});
**/

// Only listen on $ node app.js
if (!module.parent) {
  app.listen(3000);
  console.log("Express server listening on port %d", app.address().port)
}
