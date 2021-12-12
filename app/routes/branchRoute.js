var express = require('express');

module.exports = function(Branch){
    var branchRouter = express.Router();
    branchRouter.post('/create', function(req, res) {
        var branch = new Branch();
        branch.branchName.eng = req.body.branchNameEng;
        branch.branchName.ar = req.body.branchNameAr;
        branch.createdBy = req.decoded._doc._id;
        branch.save(function(err) {
            if(!err){
                res.status(200).send({
                    status: 201,
                    success: true,
                    message: {
                        eng: 'created branch successfully.',
                    },
                    data: branch
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
    branchRouter.get('/branches', function(req, res){
        Branch.find({ isDeleted: {$ne: true} }, function(err, branch){
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
                        eng: 'Branches retreived successfully.'
                    },
                    data: branch
                });
            }
        });
    });
    branchRouter.post('/delete', function(req, res){
        let branchId = req.body.id;
        Branch.update({ _id: branchId},  {
            $set: {
                isDeleted: true
            }
        }, function(err, branch){
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
                        eng: 'Branch deleted successfully.'
                    }
                });
            }
        });
    });
    return branchRouter;
};
