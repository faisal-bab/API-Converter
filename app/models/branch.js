var mongoose = require('mongoose');
var schema = mongoose.Schema;
var BranchSchema = new schema({
    branchName: {
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
BranchSchema.index({
    branchName: true,
    createdBy: true
});
module.exports = mongoose.model('Branch', BranchSchema);
