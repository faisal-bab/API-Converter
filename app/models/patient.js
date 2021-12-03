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
    firstName: true
});
PatientSchema.pre('save', function(next){
    var patient = this;
    patient.updated_at = Date.now();
    return next();
});
module.exports = mongoose.model('Patient', PatientSchema);
