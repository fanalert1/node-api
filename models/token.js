var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var tokenSchema   = new Schema({
    user_name: String,
    token_id: String,
    insert_ts: Date
   
});

module.exports = mongoose.model('Token', tokenSchema);