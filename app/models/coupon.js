var mongoose = require('mongoose');
var schema = mongoose.Schema;
var CouponSchema = new schema({
    couponCode: {
        type: String,
        trim: true,
        required: true
    },
    givenTo: {
        type: String,
        trim: true,
        required: true
    },
    amount: {
        type: Number,
        trim: true,
        required: true
    },
    createdBy: {
        type: String,
        trim: true,
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
CouponSchema.index({
    couponCode: true,
    givenTo: true,
    createdBy: true,
    branch: true
});
// CouponSchema.plugin(uniqueValidator);
module.exports = mongoose.model('Coupon', CouponSchema);
