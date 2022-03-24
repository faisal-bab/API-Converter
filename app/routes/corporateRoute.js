var express = require('express');
var moment = require('moment');

module.exports = function (Campaign, Offer, Package, User, CampaignPatient, Patient) {
    var corporateRouter = express.Router();

    corporateRouter.get('/view', function (req, res) {
        if (!req.query.couponCode) {
            return res.status(200).send({
                status: 400,
                success: false,
                message: {
                    eng: 'couponCode is required.',
                }
            });
        }
        Campaign.find({ isDeleted: false, couponCode: req.query.couponCode }).sort('-updated_at').populate({ path: 'package', model: Package }).populate({ path: 'userId', model: User }).populate({ path: 'offer', model: Offer }).exec(function (err, campaigns) {
            if (err) {
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
                        eng: 'Campaign retreived successfully.'
                    },
                    data: campaigns
                });
            }
        });
    });

    corporateRouter.post('/createPatient', async function(req, res) {
        try {
            const campaign = await Campaign.find({ isDeleted: false, _id: req.body.campaignId }).exec();
            if (!campaign) {
                return res.status(200).send({
                    status: 400,
                    success: false,
                    message: {
                        eng: 'No Campaign Exist.',
                    }
                });
            }
            var patientDetails = req.body && req.body.file || [];
            const date = moment(campaign[0]._doc.date.split(' ')[0]).add({d: 1, h:23, m:59, s:59}).format("YYYY-MM-DD HH:mm:ss");
            if (patientDetails.length > 0) {
                let uniquePatientDetails = [];
                patientDetails.map(el => {
                    const index = uniquePatientDetails.findIndex(ele => {
                        return ele != null && ele.mobile ? ele.mobile == el.mobile : -1
                    });
                    if (index == -1) {
                        var patient = new Patient();
                        patient.name = el.patientName;
                        patient.mobile = el.mobile;
                        patient.nationalId = el.id;
                        patient.package = campaign[0]._doc.package;
                        patient.offer = campaign[0]._doc.offer;
                        patient.campaign = campaign[0]._doc.campaignId;
                        patient.registrationVisitNo = `CP${Date.now()}`;
                        patient.expiresOn = moment(date).format('DD MMM YYYY');
                        patient.waitingForLaunch = false;
                        patient.couponCode = campaign[0]._doc.couponCode;
                        patient.registeredBranch = campaign[0]._doc.registeredBranch;
                        uniquePatientDetails.push(patient);
                    }
                });
                Patient.create(uniquePatientDetails, function (err, result) {
                    if (err) {
                        res.status(200).send({
                            status: 411,
                            success: false,
                            message: {
                                eng: 'Server error.',
                            },
                            error: err
                        });
                    } else {
                        return res.status(200).send({
                            status: 201,
                            success: true,
                            message: {
                                eng: 'Employees Added successfully.',
                            },
                            data: uniquePatientDetails
                        });
                    }
                })
            } else {
                res.status(200).send({
                    status: 411,
                    success: false,
                    message: {
                        eng: 'Patient Details are Required',
                    },
                    error: err
                });
            }
        } catch (err) {
            res.status(200).send({
                status: 411,
                success: false,
                message: {
                    eng: 'ERROR In Excution Of API',
                },
                error: err
            });
        }
    });

    return corporateRouter;
};
