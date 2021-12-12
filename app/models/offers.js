var mongoose = require('mongoose');
var schema = mongoose.Schema;
var OffersSchema = new schema({
    offerName: {
        ar: {
            type: String,
            default: null,
            required: true,
            index: 'text'
        },
        eng: {
            type: String,
            default: null,
            required: true,
            index: 'text'
        }
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    packageName: {
        type: String,
        trim: true,
        required: true
    },
    packageId: {
        type: Array,
        trim: true,
        required: true
    },
    department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Department'
    },
    amount: {
        type: Number,
        trim: true,
        required: true
    },
    validity: {
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
OffersSchema.index({
    offerName: true,
    packageName: true,
    createdBy: true
});
module.exports = mongoose.model('Offers', OffersSchema);
