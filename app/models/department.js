var mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
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
            required: true,
            index: 'text',
            unique: true
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
DepartmentSchema.plugin(uniqueValidator);
module.exports = mongoose.model('Department', DepartmentSchema);
