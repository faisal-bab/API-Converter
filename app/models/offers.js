var mongoose = require('mongoose');
var schema = mongoose.Schema;
var uniqueValidator = require('mongoose-unique-validator');
var OffersSchema = new schema({
    offerName: {
        ar: {
            type: String,
            default: null,
            required: true,
            index: 'text',
            unique: true,
            trim: true,
            uniqueCaseInsensitive: true
        },
        eng: {
            type: String,
            default: null,
            required: true,
            index: 'text',
            unique: true,
            trim: true,
            uniqueCaseInsensitive: true
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
    visitType: {
        type: String,
        trim: true,
        required: true,
        default: 'all',
        enum: ['all', 'ldm', 'blazma'],
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
OffersSchema.plugin(uniqueValidator);
module.exports = mongoose.model('Offers', OffersSchema);
