var mongoose = require('mongoose');
var schema = mongoose.Schema;
var uniqueValidator = require('mongoose-unique-validator');

var PatientSchema = new schema({
    name: {
        type: String,
        trim: true,
        default: null,
        required: true
    },
    nationalId: {
        type: String,
        trim: true,
        default: null
    },
    mobile: {
        type: String,
        trim: true,
        default: null,
        required: true
    },
    registeredBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    },
    registeredBranch: {
        type: String,
        trim: true,
        default: null,
        required: true
    },
    registrationVisitNo: {
        type: String,
        trim: true,
        required: true,
        unique: true,
        uniqueCaseInsensitive: true
    },
    verifiedVisitNo: {
        type: String,
        trim: true,
        unique: true,
        uniqueCaseInsensitive: true
    },
    verifiedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    },
    verifiedBranch: {
        type: String,
        trim: true,
        default: null
    },
    package: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Packages'
    },
    offer: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Offers'
    }],
    selectedOffer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Offers'
    },
    campaign: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Campaign',
        default: null
    },
    couponCode: {
        type: String,
        trim: true,
        required: true
    },
    isCouponUsed: {
        type: Boolean,
        trim: true,
        default: false
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
PatientSchema.index({
    registeredBy: true,
    mobile: true,
    firstName: true,
    package: true,
    offer: true
});
PatientSchema.pre('save', function(next){
    var patient = this;
    patient.updated_at = Date.now();
    return next();
});
PatientSchema.plugin(uniqueValidator);
module.exports = mongoose.model('Patient', PatientSchema);
