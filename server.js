// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var app        = express();   
var ParseServer = require('parse-server').ParseServer;// define our app using express
var bodyParser = require('body-parser');
var moment = require('moment-timezone');
var request = require("request");

var mongoose   = require('mongoose');
mongoose.connect('mongodb://localhost:27017/firedb'); 

var Movie     = require('./models/movie');
var Token     = require('./models/token');
var Event     = require('./models/event');
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

router.get('/events',function(req, res) {
    
    
      function findMovie(doc,cb){
         Movie.find({name:doc.movie_name},function(err, movie) {
            if (err)
                res.send(err);
             doc.details=[];
            //res.json(movie);
             doc.details = movie;
             console.log(doc);  
            
            cb(doc);
        });
      }
    
       
        
        
       Event.find({},function(err, events) {
             if (err)
                res.send(err);
            //sort movies by release_ts
             var arrevents = [];
             var completed = 0;
             var complete = function() {
             completed++;
             if (completed === events.length) {
                res.send(arrevents);
             }
             }
                
                 for (var i in events) {
                         //events[i]["event_desc"]="test";
                         var val = events[i];
                         //console.log(new Date(2012,11,10) < new Date(2012, 11, 9))
                         //val.event_type="test";
                         if (val.event_type === "FU")
                         {
                         val.event_type=val.movie_name+" is releasing soon. Expected Release Date:";
                         }
                         if (val.event_type === "FR")
                         {
                         val.event_type=val.movie_name+" is open for booking";
                         }
                         if (val.event_type === "UR")
                         {
                         val.event_type=val.movie_name+" is open for booking";
                         }
                         if (val.event_type === "RC")
                         {
                         val.event_type=val.movie_name+" is closed for booking";
                         }
                         console.log(val);
                         
                       //  if (val.ticket_type == "inc") 
                       
                        findMovie(val,function cb(doc){
                            arrevents.push(doc);
                            complete();
                        });
                                   
                 }
            //res.send(arrevents);
        });
        
});




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
    
router.get('/movies/id/:movie_id',function(req, res) {
        
       Movie.find({id:req.params.movie_id},function(err, movie) {
            if (err)
                res.send(err);

            res.json(movie);
        });
        
    });
    
router.get('/movies/name/:movie_name',function(req, res) {
        
       Movie.find({name:req.params.movie_name},function(err, movie) {
            if (err)
                res.send(err);

            res.json(movie);
        });
        
    });
    
    
router.get('/movies/running',function(req, res) {
        
      
      var current_ts = moment().tz('Asia/Kolkata').format('YYYY/MM/DD HH:mm:ss');
  //  var ts = new Date();
   // var today = moment().startOf('day')
//    var tomorrow = moment(today).add(1, 'days')

//dey venna it is getting stored as string in db from php. it should be iso date format
//Model.find({"date": {'$gte': new Date('3/1/2014'), '$lt': new Date('3/16/2014')}}, callback);
     //  console.log(ts);
       Movie.find({"type":"running"},function(err, movies) {
            if (err)
                res.send(err);
            
             var arrmovies = [];
                
                 for (var i in movies) {
                         var val = movies[i];
                         //console.log(new Date(2012,11,10) < new Date(2012, 11, 9))
                         if (new Date(val.release_ts) <= new Date(current_ts))
                         {
                         arrmovies.push(val);
                         }
                       //  if (val.ticket_type == "inc") 
                 }
                //end of change
            //console.log(arrmovies);
             //sort movies by release_ts
             
                 var date_sort_desc = function (date1, date2) { 
                   // This is a comparison function that will result in dates being sorted in 
                   // DESCENDING order. 
                   if (date1.release_ts > date2.release_ts) return -1; 
                   if (date1.release_ts < date2.release_ts) return 1; 
                   return 0; 
                }; 

            
                arrmovies.sort(date_sort_desc);
            
        
            res.send(arrmovies) ;
        });
        
    });
    
router.get('/movies/upcoming',function(req, res) {
        
       Movie.find({"type":"upcoming"},function(err, movies) {
            if (err)
                res.send(err);
            //sort movies by release_ts
            
            movies.sort(function(a,b) { 
                return new Date(a.release_ts).getTime() - new Date(b.release_ts).getTime() 
            });
            
            res.json(movies);
        });
        
    });
    

    
router.get('/movies/upcoming_open',function(req, res) {
    
    var current_ts = moment().tz('Asia/Kolkata').format('YYYY/MM/DD HH:mm:ss');
  //  var ts = new Date();
   // var today = moment().startOf('day')
//    var tomorrow = moment(today).add(1, 'days')

//dey venna it is getting stored as string in db from php. it should be iso date format
//Model.find({"date": {'$gte': new Date('3/1/2014'), '$lt': new Date('3/16/2014')}}, callback);
     //  console.log(ts);
       Movie.find({"type":"running"},function(err, movies) {
            if (err)
                res.send(err);
            
             var arrmovies = [];
                
                 for (var i in movies) {
                         var val = movies[i];
                         //console.log(new Date(2012,11,10) < new Date(2012, 11, 9))
                         if (new Date(val.release_ts) > new Date(current_ts))
                         {
                         arrmovies.push(val);
                         }
                       //  if (val.ticket_type == "inc") 
                 }
                //end of change
            //console.log(arrmovies);
             arrmovies.sort(function(a,b) { 
                    return new Date(a.release_ts).getTime() - new Date(b.release_ts).getTime() 
                });
           
             res.send(arrmovies) ;
                //change for filtering dates
               
            //res.json(movies);
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

// Specify the connection string for your mongodb database
// and the location to your Parse cloud code
var api = new ParseServer({
  databaseURI: 'mongodb://localhost:27017/dev',
  cloud: '/root/node_api/node_modules/parse-server/lib/cloud/main.js', // Provide an absolute path
  appId: '12345',
  masterKey: '12345', //Add your master key here. Keep it secret!
  fileKey: 'optionalFileKey',
  serverURL: 'http://128.199.141.102/parse' // Don't forget to change to https if needed
});

// Serve the Parse API on the /parse URL prefix
app.use('/parse', api);



// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);