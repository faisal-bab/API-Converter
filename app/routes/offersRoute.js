var express = require('express');

module.exports = function(Offers, Package){
    var offerRouter = express.Router();
    offerRouter.post('/create', function(req, res) {
        if(!req.body.packageId) {
            res.status(200).send({
                status: 400,
                success: false,
                message: {
                    eng: 'packageId is required.',
                },
                error: err
            });
        }
        var packageId = req.body.packageId;
        const findQuery = {
            _id: packageId
        };
        Package.find(findQuery).exec((err, package)=>{
            if(err) {
                res.status(200).send({
                    status: 411,
                    success: false,
                    message: {
                        eng: 'Server error while finding the package.',
                    },
                    error: err
                });
            } else if(package.length == 0) {
                res.status(200).send({
                    status: 411,
                    success: false,
                    message: {
                        eng: 'No Package found',
                    },
                    error: err
                });
            } else {
                var offer = new Offers();
                offer.packageId = packageId;
                offer.packageName = package[0].packageName.eng;
                offer.offerName.eng = req.body.offerNameEng;
                offer.offerName.ar = req.body.offerNameAr;
                offer.amount = parseFloat(req.body.amount);
                offer.validity = req.body.validity;
                offer.createdBy = req.decoded._doc._id;
                offer.save(function(err) {
                    if(!err){
                        res.status(200).send({
                            status: 201,
                            success: true,
                            message: {
                                eng: 'created offer successfully.',
                            },
                            data: offer
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

            }
        });
    });
    offerRouter.get('/offers', function(req, res){
        let findQuery = {};
        if(req.query.packageId) {
            findQuery.packageId = req.query.packageId;
        }
        Offers.find(findQuery, function(err, user){
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
                        eng: 'Offers retreived successfully.'
                    },
                    data: user
                });
            }
        });
    });
    return offerRouter;
};