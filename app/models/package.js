var mongoose = require('mongoose');
var schema = mongoose.Schema;
var PackageSchema = new schema({
    packageName: {
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
    validity: {
        type: Number,
        trim: true,
        required: true
    },
    price: {
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
PackageSchema.index({
    price: true,
    packageName: true,
    createdBy: true
});
module.exports = mongoose.model('Package', PackageSchema);
