var mongoose = require('mongoose');
var schema = mongoose.Schema;
var DepartmentSchema = new schema({
    departmentName: {
        ar: {
            type: String,
            default: null,
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
    isDeleted: {
        type: Boolean,
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
DepartmentSchema.index({
    departmentName: true,
    createdBy: true
});
module.exports = mongoose.model('Department', DepartmentSchema);
