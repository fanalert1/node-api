var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var eventSchema   = new Schema({
    movie_name: String,
    event_type: String,
    insert_ts: Date,
    notify: String
   
});

module.exports = mongoose.model('Event', eventSchema);