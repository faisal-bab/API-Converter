var express = require('express');

module.exports = function(Package, Offers){
    var packageRouter = express.Router();
    packageRouter.post('/create', function(req, res) {
        var package = new Package();
        package.packageName.eng = req.body.packageNameEng;
        package.packageName.ar = req.body.packageNameAr;
        package.createdBy = req.decoded._doc._id;
        package.save(function(err) {
            if(!err){
                res.status(200).send({
                    status: 201,
                    success: true,
                    message: {
                        eng: 'created package successfully.',
                    },
                    data: package
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
    packageRouter.get('/packages', function(req, res){
        Package.find({ isDeleted: {$ne: true} }, function(err, user){
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
                        eng: 'Packages retreived successfully.'
                    },
                    data: user
                });
            }
        });
    });
    packageRouter.post('/searchById', function(req, res){
        if (!req.body.ids) {
            return res.status(200).send({
                status: 400,
                success: false,
                message: {
                    eng: 'ids are required.',
                }
            });
        }
        let findQuery = {
            _id: {
                $in: req.body.ids
            }
        };
        Package.find(findQuery, function(err, user){
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
                        eng: 'Packages retreived successfully.'
                    },
                    data: user
                });
            }
        });
    });
    packageRouter.post('/delete',async function(req, res){
        let packageId = req.body.id;
        let associatedOffer = await Offers.find({ packageId: packageId }).exec();
        if(associatedOffer.length > 0) {
            return res.status(200).send({
                status: 203,
                success: false,
                message: {
                    eng: `This package is associated with ${associatedOffer.length} offers.`,
                }
            });
        } else {
            Package.update({ _id: packageId }, {
                $set: {
                    isDeleted: true
                }
            }, function(err, package){
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
                            eng: 'Package deleted successfully.'
                        }
                    });
                }
            });
        }
        
    });
    return packageRouter;
};
