var mongoose = require('mongoose');
var schema = mongoose.Schema;
var PatientSchema = new schema({
    firstName: {
        type: String,
        trim: true,
        default: null,
        required: true
    },
    lastName: {
        type: String,
        trim: true,
        default: null
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
        type: String,
        trim: true,
        default: null,
        required: true
    },
    package: {
        type: String,
        trim: true,
        default: null
    },
    offer: {
        type: String,
        trim: true,
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
module.exports = mongoose.model('Patient', PatientSchema);
