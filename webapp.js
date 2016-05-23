var express = require('express');
var mongodb = require('mongodb').MongoClient;
var bodyParser = require('body-parser');
var assert = require('assert'); // Unit Testing
var passwordHash = require('password-hash');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var schedule = require('node-schedule');
var Scraping = require('./ScrapingAPI');
var https = require('https');

var events = require('events');
var eventEmitter = new events.EventEmitter();

var app = express();
var app_port =  process.env.PORT || 3000;
var db1_url = 'mongodb://Kevin:adrian@ds011883.mlab.com:11883/acaidata';
var db2_url = 'mongodb://Kevin:crook@ds011883.mlab.com:11883/gamedata';
var datadb, appdb;
var req; // HTTPS request for AppTweak
var latestColl = ""; // latest collection which was fetch from AppTweak
var sched; // Schedule/frequency of fetching data
var sendData = "";

app.use(bodyParser.json());
app.use(express.static('static'));
app.use(session({
	secret: 'K33p1tS3cr3t',
	//cookie: { maxAge: 2628000000 },
	store: new MongoStore({
		url: db1_url,
		collection: 'mySessions',
	}),
	resave: false,
	saveUninitialized: true
}));



/**********************************************/
/**** Scraping API ****************************/
/**********************************************/

//Route to display the information on the table -> filtering is work in progress
app.get('/api/bugs', function(req, res){
	var filter = {};
	var reqCollName = req.query.collName;
	var collName = "";

	// If requested collection is not given then use the latest collection
	if(reqCollName == null || reqCollName == "") {
		collName = latestColl;
	} else {
		collName = reqCollName;
	}
	
	// Create filtering if requested
	if(req.query.title)
		filter.title = {"$in": [new RegExp(req.query.title,"i")]};
	if(req.query.developer)
		filter.developer = {"$in" : [new RegExp(req.query.developer,"i")]};

	datadb.collection(collName).find(filter).toArray(function(err, docs) {
		assert.equal(null, err);
		res.json(docs); 
	});
});

app.get('/datadb/collections', function(req, res){
	datadb.listCollections().toArray(function(err, collections){
		assert.equal(null, err);
		res.json(collections);
	});
});

app.get('/field', function(req, res) {
	appdb.collection("fields").find({}).toArray(function(err, docs) {
		assert.equal(null, err);
		res.json(docs); 
	});
});

app.get('/api/gameDetails', function(req, res) {	
	var device = req.query.device;
	var id = req.query.id;
	requestForGameDetails(id, device);
	eventEmitter.once('got_data', function() {
		return res.json(sendData);
	});
});


//  Passes a data of the game being clicked in BugList and grabs all relevant data
//  @param {id} is the id of the game
//  @param {device} is the device used for the game
function requestForGameDetails(id, device) {
	var datapath = "/" + device + "/applications/" + id + "/information.json";
	var header = {"X-Apptweak-Key": "QS5NiFFrLERBRML_ptL208cJoWc"};
	var options = {
		hostname: "api.apptweak.com",
		port: 443,
		path: datapath,
		"rejectUnauthorized": false,
		method:"GET",
		headers: header
	};
	
	req = https.request(options, function(res) {
		var responseBody =""; 
		res.setEncoding("UTF-8"); 
		//retrieve the data in chunks
		res.on("data", function(chunk) {
			responseBody += chunk;
		});

		res.on("end", function(){
			//Once completed we parse the data in JSON format
			sendData = JSON.parse(responseBody);
			//console.log(sendData);
			eventEmitter.emit('got_data');
		});
	});
	
	req.on("error", function(err) {
		console.log(`problem with request: ${err.message}`);
	});
	req.end();
}

/**********************************************/
/**** Login Authentication ********************/
/**********************************************/

// Inserts a user into the "users" collection db
// user: username, password, role
// @param {req} form.username, form.password
app.post('/signup', function(req, res) {
	var username = { "username" : req.body.username };
	var newUser = {
		"username" : req.body.username,
		"password" : passwordHash.generate(req.body.password),
		"role" : "user"
	}; 
	// Checking if there's duplicate username
	appdb.collection("users").find(username).next(function(err, doc) {
		assert.equal(null, err);
		if(doc == null) { // Valid user
			// Inserting the user into the database
			appdb.collection("users").insertOne(newUser, function(err2, doc2) {
				assert.equal(null, err2);
				res.json(newUser);
			});
		} else { // null => found duplicate
			res.json(null);
		}
	});
	
});

// Checks if the username and password is in the database and logs the user in 
// if its in the database.
// @param {req} form.username, form.password
app.post('/login', function(req, res) {
	var username = req.body.username;
	var username_query = { "username" : username };
	
	appdb.collection("users").find(username_query).next(function(err, doc) {
		assert.equal(null, err);
		if(doc != null && passwordHash.verify(req.body.password, doc.password)) {
			req.session.username = doc.username;
			req.session.role = doc.role;
			res.json({
				"username": doc.username,
				"role": doc.role,
				"coll": latestColl
			});
		} else {
			res.json(null); // No username found or password does not match
		}
		
	});
});

// Logs out the logged user and destroys the session
app.post('/logout',function(req,res){
	req.session.destroy();
	res.end();
});

// Relogs an user that hasn't logout and it's in the session
app.get('/relog', function(req, res) {
	var session = {
		"username": req.session.username,
		"role": req.session.role,
		"coll": latestColl
	};
	if(req.session.username != null) {
		res.json(session);
	} else {
		res.json(null);
	}	
});





/**********************************************/
/**** Admin Content ***************************/
/**********************************************/

app.get('/users', function(req, res){
	var users = {};
	if(req.query.username)
		users.username = req.query.username;

	appdb.collection("users").find(users).toArray(function(err, docs) {
		assert.equal(null, err);
		res.json(docs); 
	});
});

app.put('/users/switchRole', function(req, res) {
	var query = {};
	query.username = req.body.username;
	var update = {$set : {role: req.body.role}};
	
	appdb.collection("users").update(query, update);
	res.end();
});

app.post('/field/add', function(req, res) {
	var field = { name: req.body.field} ;
	// Checking if field exist
	appdb.collection("fields").find(field).next(function(err, doc) {
		assert.equal(null, err);
		if(doc == null) { // valid field
			// Inserting the field into the database 
			appdb.collection("fields").insertOne(field, function(err2, doc2) {
				assert.equal(null, err2);
				res.json(field);
			});
		} else { // null => found duplicate
			res.json(null);
		}
	});
});

app.delete('/field/remove', function(req, res) {
	var field = { name: req.body.field} ;
	// Checking if field exist
	appdb.collection("fields").find(field).next(function(err, doc) {
		assert.equal(null, err);
		if(doc != null) { // field exists -> remove
			appdb.collection("fields").remove(field);
			res.json(true);
		} else { 
			res.json(false);
		}
	});
});

app.put('/field/data/update', function(req, res) {
	var fieldName = { "name" : req.body.field };
	var gameTitle = { "title" : req.body.title };
	var update = {$set : {[req.body.field]: req.body.data}};
	
	var reqCollName = req.body.collName;
	var collName = "";
	
	// If requested collection is not given then use the latest collection
	if(reqCollName == null || reqCollName == "") {
		collName = latestColl;
	} else {
		collName = reqCollName;
	}
	
	appdb.collection("fields").find(fieldName).next(function(err, doc) {
		if(doc != null) { // exists
			datadb.collection(collName).find(gameTitle).next(function(err2, doc2) {
				if(doc2 != null) { // exists
					datadb.collection(collName).update(gameTitle, update);
				} 
			});
		} 
	});

	res.json("end");
});
// Sends back an array of all documents in the "fields" collection
// to use their filed's name
app.get('/field', function(req, res) {
	appdb.collection("fields").find({}).toArray(function(err, docs) {
		assert.equal(null, err);
		res.json(docs); 
	});
});
// @param {req} has a JSON object for dropping collections.
// req.body.items is an array with fields: (name)
app.delete('/datadb/collection/drop', function(req, res) {
	var selected = req.body.items;
		
	for(var i=0; i < selected.length; i++) {
		datadb.collection(selected[i].name).drop();
	}
	res.end()
});
// Sends back the latest fetch collection name
app.get('/datadb/collection/latest', function(req, res) {
	res.json(latestColl);
});





/**********************************************/
/**** Server **********************************/
/**********************************************/

function requestAPI() {
	// For every minute: '*/1 * * * *'
	// Scheduled a minute apart to prevent race conditions
	/* sched = schedule.scheduleJob('1 0 * * *', function() {
		Scraping.requestToAppTweak("/ios/categories/6014/top.json", datadb, curColl);
	});
	sched = schedule.scheduleJob('2 0 * * *', function() {
		Scraping.requestToAppTweak("/ios/categories/6014/top.json?type=paid", datadb, curColl);
	});
	sched = schedule.scheduleJob('3 0 * * *', function() {
		Scraping.requestToAppTweak("/ios/categories/6014/top.json?type=grossing", datadb, curColl);
	});
	sched = schedule.scheduleJob('4 0 * * *', function() {
		Scraping.requestToAppTweak("/android/categories/game/top.json", datadb, curColl);
	});
	sched = schedule.scheduleJob('5 0 * * *', function() {
		Scraping.requestToAppTweak("/android/categories/game/top.json?type=paid", datadb, curColl);
	});
	sched = schedule.scheduleJob('6 0 * * *', function() {
		Scraping.requestToAppTweak("/android/categories/game/top.json?type=grossing", datadb, curColl);
	});  */
	
	// Use these for testing only.git 
	Scraping.requestToAppTweak("/ios/categories/6014/top.json", datadb);
	// Scraping.requestToAppTweak("/ios/categories/6014/top.json?type=paid", datadb);
	// Scraping.requestToAppTweak("/ios/categories/6014/top.json?type=grossing", datadb);
	// Scraping.requestToAppTweak("/android/categories/game/top.json", datadb);
	// Scraping.requestToAppTweak("/android/categories/game/top.json?type=paid", datadb);
	// Scraping.requestToAppTweak("/android/categories/game/top.json?type=grossing", datadb);
	
	latestColl = Scraping.getColl();
}
	
// Connecting to the database
mongodb.connect(db1_url, function(err, dbConnection) {
	assert.equal(null, err);
	appdb = dbConnection;	
	
	mongodb.connect(db2_url, function(err2, dbConnection2) {
		assert.equal(null, err2)
		datadb = dbConnection2;
		requestAPI();
	
		var server = app.listen(app_port, function() {
			console.log('> Application listening on port ' + app_port + '!');
		});
	});
});
