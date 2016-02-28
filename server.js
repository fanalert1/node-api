// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var moment = require('moment-timezone');

var mongoose   = require('mongoose');
mongoose.connect('mongodb://localhost:27017/firedb'); 

var Movie     = require('./models/movie');
var Token     = require('./models/token');
// 

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;        // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });   
});

// more routes for our API will happen here

router.post('/movies',function(req, res) {
        
        var movie = new Movie();      // create a new instance of the Bear model
        movie.name = req.body.name;  // set the bears name (comes from the request)

        // save the bear and check for errors
        movie.save(function(err) {
            if (err)
                res.send(err);

            res.json({ message: 'Movie created!' });
        });
        
    });


router.get('/movies',function(req, res) {
        
       Movie.find({},function(err, movies) {
            if (err)
                res.send(err);

            res.json(movies);
        });
        
    });
    
    
router.get('/movies/running',function(req, res) {
        
       Movie.find({"type":"running"},function(err, movies) {
            if (err)
                res.send(err);

            res.json(movies);
        });
        
    });
    
router.get('/movies/upcoming',function(req, res) {
        
       Movie.find({"type":"upcoming"},function(err, movies) {
            if (err)
                res.send(err);

            res.json(movies);
        });
        
    });
    
    
router.post('/register', function(req, res){
    //device_token = req.body.device_token;
    device_token = req.body._push.android_tokens;
    current_ts = moment().tz('Asia/Kolkata').format('YYYY/MM/DD HH:mm:ss');
    

    
    console.log(current_ts);
    console.log('device token received');
    console.log(device_token);
    
        var token = new Token({
          token_id: device_token,
          insert_ts: current_ts
        });

token.save(function(err, thor) {
  if (err) return console.error(err);
  console.dir(thor);
});
    
    
  //  Token.save(device_token);
    /*YOUR TODO: save the device_token into your database*/
    res.send('ok');
});


// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);