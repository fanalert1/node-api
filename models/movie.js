var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var movieSchema   = new Schema({
    id: String,
    name: String,
    lang: String,
    link: String,
    poster_url: String,
    actors: Array(),
    director: Array(),
    music_director: Array(),
    genre: Array(),
    producer: Array(),
    type: String,
    prev_type: String,
    notify: String,
    release_ts: Date,
    insert_ts: Date,
    update_ts: Date,
    close_ts: Date
});

module.exports = mongoose.model('Movie', movieSchema);