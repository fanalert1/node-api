var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var eventSchema   = new Schema({
    movie_name: String,
    movie_id: String,
    lang: String,
    event_type: String,
    opened_at: String,
    insert_ts: Date,
    insert_ts1: Date,
    notified_ts: Date,
    notify: String,
    details: []
   
});

module.exports = mongoose.model('Event', eventSchema);