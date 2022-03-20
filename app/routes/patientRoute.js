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
        patient.language = req.body.language ? req.body.language : 'eng';
        patient.registrationVisitNoLDM = req.body.registrationVisitNoLDM ? req.body.registrationVisitNoLDM : null;
        patient.registrationVisitNoBlazma = req.body.registrationVisitNoBlazma ? req.body.registrationVisitNoBlazma : null;
        const code = voucher_codes.generate({
            length: 8,
            count: 1
        });
        patient.couponCode = code[0].toUpperCase();
        patient.save(function(err) {
            if(!err){
                if(req.body.offer) {
                    Offer.find({ _id: patient.offer}).exec(function(err, offer) {
                        var expiryDate = moment.utc().add(offer[0].validity, 'days').format('DD MMM YYYY');
                        patient.expiresOn = expiryDate;
                        patient.save();
                        var message = '';
                        if(req.body.language == 'ar') {
                            message = `عزيزي ${patient.name}
تهانينا ، لقد ربحت خصمًا بقيمة ${offer[0].amount} ريال سعودي على ${offer[0].offerName.eng}.
هذه القسيمة صالحة حتى ${expiryDate}.
رمز القسيمة - ${patient.couponCode}`
                        } else {
                            message = `Dear ${patient.name}
Congratulations, you have earned a discount of ${offer[0].amount}SR on ${offer[0].offerName.eng}.
This coupon is Valid until ${expiryDate}.
Coupon Code - ${patient.couponCode}`;
                        }
//                         var message = `Dear ${patient.name}
// Congratulations, you have earned a discount of ${offer[0].amount}SR on ${offer[0].offerName.eng}.
// This coupon is Valid until ${expiryDate}.
// Coupon Code - ${patient.couponCode}`;
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
            } else if(err && err.errors && err.errors.registrationVisitNoLDM) {
                res.status(200).send({
                    status: 203,
                    success: false,
                    message: {
                        eng: 'Visit No (LDM) should be unique',
                    },
                    error: err
                });
            } else if(err && err.errors && err.errors.registrationVisitNoBlazma) {
                res.status(200).send({
                    status: 203,
                    success: false,
                    message: {
                        eng: 'Visit No (Blazma) should be unique',
                    },
                    error: err
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
        Patient.find({waitingForLaunch: { $ne: true }})
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
        let updateObj = {
            isCouponUsed: !isUsed,
            verifiedBy: !isUsed ? req.decoded._doc._id : null,
            verifiedBranch: !isUsed ? req.query.verifiedBranch : null
        };
        if (req.query.selectedOffer) {
            updateObj.selectedOffer = !isUsed ? req.query.selectedOffer : null
        }
        if (req.query.verifiedVisitNoLDM) {
            updateObj.verifiedVisitNoLDM = !isUsed ? req.query.verifiedVisitNoLDM : null
        }
        if (req.query.verifiedVisitNoBlazma) {
            updateObj.verifiedVisitNoBlazma = !isUsed ? req.query.verifiedVisitNoBlazma : null
        }
        Patient.update({_id: patientId}, {
            $set: updateObj
        }, function (err, patient) {
            if(err && err.errors && err.errors.verifiedVisitNoLDM) {
                res.status(200).send({
                    status: 203,
                    success: false,
                    message: {
                        eng: 'Visit No (LDM) should be unique',
                    },
                    error: err
                });
            } if(err && err.errors && err.errors.verifiedVisitNoBlazma) {
                res.status(200).send({
                    status: 203,
                    success: false,
                    message: {
                        eng: 'Visit No (Blazma) should be unique',
                    },
                    error: err
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
    patientRouter.get('/search', async function (req, res) {
        let findQuery = {
            waitingForLaunch: {
                $ne: true
            }
        };
        if (req.query.mobile) {
            findQuery.mobile = req.query.mobile;
        }
        if (req.query.couponCode) {
            findQuery.couponCode = req.query.couponCode;
        }
        if (req.query.registeredBy) {
            findQuery.registeredBy = req.query.registeredBy;
        }
        if (req.query.fromDate) {
            findQuery.created_at = { $gte: req.query.fromDate };
        }
        if (req.query.toDate) {
            findQuery.created_at = { $lte: req.query.toDate };
        }
        try {
            let count = await Patient.find(findQuery).populate({ path: 'offer', model: Offer }).populate({ path: 'selectedOffer', model: Offer }).populate({ path: 'package', model: Package }).populate({ path: 'registeredBy', model: User }).populate({ path: 'verifiedBy', model: User }).count().exec();
            console.log(count);
            let promiseArray = [];
            let skip = 0;
            if(count > 2000) {
                console.log("in count")
                while(count >= 0) {
                    console.log("in while")
                    promiseArray.push(Patient.find(findQuery).populate({ path: 'offer', model: Offer }).populate({ path: 'selectedOffer', model: Offer }).populate({ path: 'package', model: Package }).populate({ path: 'registeredBy', model: User }).populate({ path: 'verifiedBy', model: User }).skip(skip).limit(2000))
                    skip += 2000;
                    count -= 2000;
                }
            }
            // let patient = await Patient.find(findQuery).populate({ path: 'offer', model: Offer }).populate({ path: 'selectedOffer', model: Offer }).populate({ path: 'package', model: Package }).populate({ path: 'registeredBy', model: User }).populate({ path: 'verifiedBy', model: User }).limit(2000).exec();
            // console.log(promiseArray)
            let patientData = await Promise.all(promiseArray);
            let patient = [];
            for (let data of patientData) {
                patient = patient.concat(data);
            }
            return res.status(200).send({
                status: 201,
                success: true,
                data: patient
            });
        } catch (error) {
            res.status(200).send({
                status: 411,
                success: false,
                message: {
                    eng: 'Server error.',
                },
                error: error
            });
        }
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
