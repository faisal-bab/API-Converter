var express = require('express');
var voucher_codes = require('voucher-code-generator');
var moment = require('moment');
var smsFunction = require('../controllers/sendSMS');

module.exports = function(Patient, Offer, Package, User){
    var patientRouter = express.Router();
    patientRouter.post('/create', function(req, res) {
        var patient = new Patient();
        patient.name = req.body.name;
        patient.nationalId = req.body.nationalId;
        patient.mobile = req.body.mobile;
        patient.registeredBy = req.decoded._doc._id;
        patient.registeredBranch = req.body.registeredBranch;
        patient.package = req.body.package;
        patient.offer = req.body.offer;
        patient.registrationVisitNo = req.body.registrationVisitNo;
        const code = voucher_codes.generate({
            length: 8,
            count: 1
        });
        patient.couponCode = code[0].toUpperCase();
        patient.save(function(err) {
            if(!err){
                if(req.body.offer) {
                    Offer.find({ _id: patient.offer}).exec(function(err, offer) {
                        var expiryDate = moment().add(offer[0].validity, 'days').format('DD MMM YYYY');
                        var message = `Dear ${patient.firstName}
Congratulations, you have earned a discount of ${offer[0].amount}SR on ${offer[0].offerName.eng}.
This coupon is Valid until ${expiryDate}.
Coupon Code - ${patient.couponCode}`;
                        var country_code = req.body.countryCode ? req.body.countryCode : '+966';
                        smsFunction.sendSMS(req.body.mobile, message, 'otp', country_code);
                    });
                }
                res.status(200).send({
                    status: 201,
                    success: true,
                    message: {
                        eng: 'patient registered successfully.',
                    },
                    data: patient
                });
            } else if(err) {
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
    patientRouter.get('/patients', function(req, res){
        Patient.find({})
        .populate({ path: 'offer', model: Offer })
        .populate({ path: 'package', model: Package })
        .populate({ path: 'registeredBy', model: User })
        .populate({ path: 'verifiedBy', model: User })
        .exec(function(err, user){
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
                        eng: 'Patients retreived successfully.'
                    },
                    data: user
                });
            }
        });
    });
    patientRouter.get('/markCouponUsed', function(req, res){
        var patientId = req.query.patientId;
        let isUsed = req.query.isUsed ? true : false;
        if (isUsed && req.decoded._doc.role !== 'admin') {
            return res.status(200).send({
                status: 403,
                success: false,
                message: {
                    eng: 'You don\'t have permission to do this action.',
                },
                error: err
            });
        }
        Patient.update({_id: patientId}, {
            $set: {
                isCouponUsed: !isUsed,
                selectedOffer: !isUsed ? req.query.selectedOffer : null,
                verifiedBy: !isUsed ? req.decoded._doc._id : null,
                verifiedBranch: !isUsed ? req.query.verifiedBranch : null,
                verifiedVisitNo: !isUsed ? req.query.verifiedVisitNo : null
            }
        }, function (err, patient) {
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
                        eng: 'Patients updated successfully.'
                    },
                    data: patient
                });
            }
        });
    });
    patientRouter.get('/search', function (req, res) {
        let findQuery = {};
        if (req.query.mobile) {
            findQuery.mobile = req.query.mobile;
        }
        if (req.query.couponCode) {
            findQuery.couponCode = req.query.couponCode;
        }
        if (req.query.registeredBy) {
            findQuery.registeredBy = req.query.registeredBy;
        }
        Patient.find(findQuery).populate({ path: 'offer', model: Offer }).populate({ path: 'selectedOffer', model: Offer }).populate({ path: 'package', model: Package }).populate({ path: 'registeredBy', model: User }).populate({ path: 'verifiedBy', model: User })
        .exec( function(err, patient){
            if(err) {
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
                    status: 201,
                    success: true,
                    data: patient
                });
            }
        })
    });
    patientRouter.get('/patientById', function (req, res) {
        let findQuery = {};
        if (req.query.patientId) {
            findQuery._id = req.query.patientId;
        }
        Patient.find(findQuery).populate({ path: 'offer', model: Offer }).populate({ path: 'package', model: Package }).populate({ path: 'registeredBy', model: User }).populate({ path: 'verifiedBy', model: User })
        .exec( function(err, patient){
            if(err) {
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
                    status: 201,
                    success: true,
                    data: patient
                });
            }
        })
    });
    return patientRouter;
};
