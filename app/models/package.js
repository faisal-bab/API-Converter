var mongoose = require('mongoose');
var schema = mongoose.Schema;
var uniqueValidator = require('mongoose-unique-validator');
var PackageSchema = new schema({
    packageName: {
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
    // validity: {
    //     type: Number,
    //     trim: true,
    //     required: true
    // },
    // price: {
    //     type: Number,
    //     trim: true,
    //     required: true
    // },
    isDeleted: {
        type: Boolean,
        default: false
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
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
    packageName: true,
    createdBy: true,
    userPermission: true
});
PackageSchema.plugin(uniqueValidator);
module.exports = mongoose.model('Package', PackageSchema);
