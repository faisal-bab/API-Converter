var mongoose = require('mongoose');
var schema = mongoose.Schema;
var uniqueValidator = require('mongoose-unique-validator');

var CampaignSchema = new schema({
    name: {
        type: String,
        trim: true,
        default: null,
        required: true,
        unique: true,
        uniqueCaseInsensitive: true
    },
    // patientName: {
    //     type: String,
    //     trim: true,
    //     default: null,
    //     required: true
    // },
    // nationalId: {
    //     type: String,
    //     trim: true,
    //     default: null
    // },
    // mobile: {
    //     type: String,
    //     trim: true,
    //     default: null,
    //     required: true
    // },
    isDeleted: {
        type: Boolean,
        trim: true,
        default: false
    },
    isCorporate: {
        type: Boolean,
        trim: true,
        default: false
    },
    couponCode: {
        type: String,
        trim: true,
        required: false,
        default: null,
        index: true
    },
    registeredBranch: {
        type: String,
        trim: true,
        default: null
    },
    maxNoOfCoupons: {
        type: Number,
        required: false,
        default: null
    },
    date: {
        type: String,
        trim: true,
        default: null,
        required: true
    },
    // couponCode: {
    //     type: String,
    //     trim: true,
    //     uppercase: true
    // },
    // isCouponUsed: {
    //     type: Boolean,
    //     trim: true,
    //     default: false
    // },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    /**
     * 1. Not Launched
     * 2. Launched
     * 3. In Progress
     */
    status: {
        type: Number,
        default: 1,
        enum: [1, 2, 3]
    },
    package: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Package'
    },
    offer: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Offers'
    }],
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    }
});
CampaignSchema.index({
    mobile: true,
    name: true,
    package: true,
    offer: true
});
CampaignSchema.pre('save', function(next){
    var patient = this;
    patient.updated_at = Date.now();
    return next();
});
CampaignSchema.plugin(uniqueValidator);
module.exports = mongoose.model('Campaign', CampaignSchema);
