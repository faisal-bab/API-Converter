var mongoose = require('mongoose');
var schema = mongoose.Schema;
var uniqueValidator = require('mongoose-unique-validator');
var bcrypt = require('bcrypt-nodejs');
var UserSchema = new schema({
    userName: {
        type: String,
        trim: true,
        default: null,
        required: true
    },
    firstName: {
        type: String,
        trim: true,
        default: null
    },
    lastName: {
        type: String,
        trim: true,
        default: null
    },
    branch: {
        type: String,
        trim: true,
        default: null
    },
    role: {
        type: String,
        trim: true,
        lowercase: true,
        default: null,
        required: true,
        enum: ['admin', 'employee'],
        index: true
    },
    password: {
        type: String,
        trim: true,
        default: null,
        required: true
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
UserSchema.index({
    role: true,
    userName: true,
    firstName: true,
    branch: true
});
UserSchema.pre('save', function(next){
    var user = this;
    user.updated_at = Date.now();
    if(!user.isModified('password')){
        return next();
    }
    bcrypt.genSalt(10, function(err, salt){
        if(err){
            return next(err);
        }
        bcrypt.hash(user.password, salt, null, function(err, hash){
            if(err){
                return next(err);
            }
            user.password = hash;
            next();
        });
    });
});
UserSchema.path('password').validate(function(password){
    return password.length >= 6;
}, 'The minimum length for password is 6 chars');
UserSchema.methods.toJSON = function(){
    var usr = this.toObject();
    delete usr.password;
    return usr;
};
UserSchema.plugin(uniqueValidator);
module.exports = mongoose.model('User', UserSchema);
