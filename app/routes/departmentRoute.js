var express = require('express');

module.exports = function(Department){
    var departmentRouter = express.Router();
    departmentRouter.post('/create', function(req, res) {
        var department = new Department();
        department.departmentName.eng = req.body.departmentNameEng;
        department.departmentName.ar = req.body.departmentNameAr;
        department.createdBy = req.decoded._doc._id;
        department.save(function(err) {
            if(!err){
                res.status(200).send({
                    status: 201,
                    success: true,
                    message: {
                        eng: 'created department successfully.',
                    },
                    data: department
                });
            } else if(err){
                res.status(200).send({
                    status: 411,
                    success: false,
                    message: {
                        eng: 'Server error.',
                    },
                    error: err
                });
            }
        });
    });
    departmentRouter.get('/departments', function(req, res){
        Department.find({ isDeleted: {$ne: true} }, function(err, department){
            if(err){
                res.status(200).send({
                    status: 411,
                    success: false,
                    message: {
                        eng: 'Server error.',
                    },
                    error: err
                });
            } else {
                res.status(200).send({
                    status: 200,
                    success: true,
                    message: {
                        eng: 'Departments retreived successfully.'
                    },
                    data: department
                });
            }
        });
    });
    departmentRouter.post('/delete', function(req, res){
        let departmentId = req.body.id;
        Department.update({ _id: departmentId}, {
            $set: {
                isDeleted: true
            }
        }, function(err, department){
            if(err){
                res.status(200).send({
                    status: 411,
                    success: false,
                    message: {
                        eng: 'Server error.',
                    },
                    error: err
                });
            } else {
                res.status(200).send({
                    status: 200,
                    success: true,
                    message: {
                        eng: 'Department deleted successfully.'
                    }
                });
            }
        });
    });
    return departmentRouter;
};
