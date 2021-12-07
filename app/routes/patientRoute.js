var express = require('express');
var voucher_codes = require('voucher-code-generator');

module.exports = function(Patient){
    var patientRouter = express.Router();
    patientRouter.post('/create', function(req, res) {
        var patient = new Patient();
        patient.firstName = req.body.firstName;
        patient.lastName = req.body.lastName;
        patient.nationalId = req.body.nationalId;
        patient.mobile = req.body.mobile;
        patient.registeredBy = req.decoded._doc._id;
        patient.package = req.body.package;
        patient.offer = req.body.offer;
        const code = voucher_codes.generate({
            length: 8,
            count: 1
        });
        patient.couponCode = code[0].toUpperCase();
        patient.save(function(err) {
            if(!err){
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
        Patient.find({}, function(err, user){
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
        console.log("test")
        Patient.update({_id: patientId}, {
            $set: {
                isCouponUsed: true
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
    return patientRouter;
};
