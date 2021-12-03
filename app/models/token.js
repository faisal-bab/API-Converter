var mongoose = require('mongoose');
var schema = mongoose.Schema;
var TokenSchema = new schema({
    user_id: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    token: {
        type: String,
        trim: true,
        default: null
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    }
});
TokenSchema.index({
    user_id: true
});
TokenSchema.pre('save', function(next){
    var token = this;
    token.updated_at = Date.now();
    return next();
});
module.exports = mongoose.model('Token', TokenSchema);
