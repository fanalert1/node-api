var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var movieSchema   = new Schema({
    name: String,
    lang: String,
    type: String,
    prev_type: String,
    notify: Boolean,
    release_ts: Date,
    insert_ts: Date,
    update_ts: Date
});

module.exports = mongoose.model('Movie', movieSchema);