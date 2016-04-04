// server.js
//chumma
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
                
                 doc.details = movie;
                 //console.log(doc);  
                
                cb(doc);
            });
          }
    
        var date_sort_desc = function (date1, date2) { 
                   if (date1.insert_ts > date2.insert_ts) return -1; 
                   if (date1.insert_ts < date2.insert_ts) return 1; 
                   return 0; 
                };
      
        Event.find({},function(err, events) {
             if (err)
                res.send(err);
            //sort movies by release_ts
             var arrevents = [];
             var completed = 0;
             var complete = function() {
             completed++;
             if (completed === events.length) {
                arrevents.sort(date_sort_desc);
                res.json(arrevents);
             }
             }
                
                 for (var i in events) {
                         //events[i]["event_desc"]="test";
                         var val = events[i];
                         //console.log(new Date(2012,11,10) < new Date(2012, 11, 9))
                         //val.event_type="test";
                         if (val.event_type === "FU")
                         {
                         val.event_type=val.movie_name+" is coming soon. Releasing on";
                         }
                         if (val.event_type === "FR")
                         {
                         val.event_type=val.movie_name+" is open for booking. Releasing on";
                         }
                         if (val.event_type === "RR")
                         {
                         val.event_type=val.movie_name+" is open for booking. Releasing on";
                         }
                         if (val.event_type === "UR")
                         {
                         val.event_type=val.movie_name+" is open for booking. Releasing on";
                         }
                         if (val.event_type === "RC")
                         {
                         val.event_type=val.movie_name+" is closed for booking.";
                         }
                        // insert_ts = val.insert_ts;
                        // val.insert_ts1 = moment(new Date(insert_ts)).tz('Asia/Kolkata').format();
                         console.log(val.movie_name+val.insert_ts);
                         
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
        
       Movie.find({'_id':req.params.movie_id},function(err, movie) {
            if (err)
                res.send(err);

            res.json(movie);
        });
        
    });
    
    
router.get('/movies/name/:movie_name/:lang',function(req, res) {
        
       Movie.find({name:req.params.movie_name},function(err, movie) {
            if (err)
                res.send(err);

            res.json(movie);
        });
        
    });
    
    
router.get('/movies/running',function(req, res) {
        
      
       var current_ts = moment().tz('Asia/Kolkata').format('YYYY/MM/DD');
  
       Movie.find({"type":"running"},function(err, movies) {
            if (err)
                res.send(err);
            
             var arrmovies = [];
                
                 for (var i in movies) {
                         var val = movies[i];
                         //console.log(new Date(2012,11,10) < new Date(2012, 11, 9))
                         console.log(val.name);
                         console.log(new Date(current_ts));
                         console.log(new Date(val.release_ts))
                         if (new Date(val.release_ts) <= new Date(current_ts))
                         {
                         arrmovies.push(val);
                         }
                       //  if (val.ticket_type == "inc") 
                 }
               
                 var date_sort_desc = function (date1, date2) { 
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
                return a.release_ts - b.release_ts 
            });
            
            res.json(movies);
        });
        
    });
    

    
router.get('/movies/upcoming_open',function(req, res) {
    
    var current_ts = moment().tz('Asia/Kolkata').format('YYYY/MM/DD');
  //  var ts = new Date();
   // var today = moment().startOf('day')
//    var tomorrow = moment(today).add(1, 'days')

//dey venna it is getting stored as string in db from php. it should be iso date format

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
                      
                 }
               
             arrmovies.sort(function(a,b) { 
                   // return new Date(a.release_ts).getTime() - new Date(b.release_ts).getTime() 
                   return a.release_ts - b.release_ts
                });
           
             res.send(arrmovies) ;
               
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
  serverURL: 'http://128.199.141.102/parse', // Don't forget to change to https if needed
  verifyUserEmails: true,
  // This will appear in the link that is used to verify email addresses and reset passwords.
  publicServerURL: 'http://128.199.141.102:8080/parse',
  // Your apps name. This will appear in the subject and body of the emails that are sent.
  appName: 'Fan Alert',
  // The email adapter
  emailAdapter: {
    module: 'parse-server-simple-mailgun-adapter',
    options: {
      // The address that your emails come from
      fromAddress: 'fanalert1@gmail.com',
      // Your domain from mailgun.com
      domain: 'geocircle.in',
      // Your API key from mailgun.com
      apiKey: 'key-2ed38e280a30c224064f626acc2aea40',
    }
  }
});

// Serve the Parse API on the /parse URL prefix
app.use('/parse', api);



// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);