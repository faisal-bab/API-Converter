var mongoose = require('mongoose');
var schema = mongoose.Schema;
var uniqueValidator = require('mongoose-unique-validator');

var CampaignPatientsSchema = new schema({
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
    isDeleted: {
        type: Boolean,
        trim: true,
        default: false
    },
    couponCode: {
        type: String,
        trim: true,
        uppercase: true
    },
    isCouponUsed: {
        type: Boolean,
        trim: true,
        default: false
    },
    campaignId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Campaign'
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
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
CampaignPatientsSchema.index({
    mobile: true,
    name: true,
    couponCode: true
});
CampaignPatientsSchema.pre('save', function(next){
    var patient = this;
    patient.updated_at = Date.now();
    return next();
});
CampaignPatientsSchema.plugin(uniqueValidator);
module.exports = mongoose.model('CampaignPatients', CampaignPatientsSchema);
