const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const alert = require('alert');
var router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model('User');
const auth = require("../Middleware/auth");
const userSchema = require("../Models/userSchema");



exports.registerOrUpdate = (req, res, next) => {
    if (req.body._id == '')
        insertRecord(req, res);
    else
        updateRecord(req, res);
}

async function insertRecord(req, res) {
    var user = new User();
    user.fullName = req.body.fullName;
    user.email = req.body.email;

    //Encrypt user password
    user.passWord = await bcrypt.hash(req.body.passWord, 10);
    user.user_Type = req.body.user_Type;
    user.mobile = req.body.mobile;
    user.city = req.body.city;

    user.save((err, doc) => {
        if (!err) {
            //res.redirect("User/list");
            res.render("User/list",{list:doc});
        }
        else {
            if (err.name == 'ValidationError') {
                handleValidationError(err, req.body);
                res.render("User/addOrEdit", {
                    viewTitle: "Insert Employee",
                    user: req.body
                });
            }
            else
                console.log('Error during record insertion : ' + err);
        }
    });


};


function updateRecord(req, res) {
    User.findOneAndUpdate({ _id: req.body._id }, req.body, { new: true }, (err, doc) => {
        if (!err) { res.redirect('user/list'); }
        else {
            if (err.name == 'ValidationError') {
                handleValidationError(err, req.body);
                res.render("User/addOrEdit", {
                    viewTitle: 'Update User',
                    user: req.body
                });
            }
            else
                console.log('Error during record update : ' + err);
        }
    });
}


exports.login = (req, res, next) => {
    const { email, passWord } = req.body;
    User.findOne({ 'email': email }, async (err, docs) => {
        let token;
        if (err) {
            return res.send(err);
        } else {
            if (docs.user_Type == 'admin') {
                const validpass = await bcrypt.compare(passWord, docs.passWord);
                if (validpass) {
                    const payload = {
                        user: {
                            id: docs.id
                        }
                    };

                    jwt.sign(
                        payload,
                        "accionlabs_secret_key",
                        {
                            expiresIn: 3600
                        },
                        (err, token) => {
                            if (err) throw err;
                            //  res.redirect("/user/verify");
                            res.redirect('/User/list');
                        }
                    );
                } else {
                    res.send('oops!! Please enter Correct Password')
                }
            }
            else if (docs.user_Type == 'employee') {
                res.send('Oops!! Admin can only access this ');
            }
        }
    })
}


exports.findall = (req, res, next) => {
    User.find((err, docs) => {
        if (!err) {
            res.render("User/list", {
                list: docs
            });
        }
        else {
            console.log('Error in retrieving User list :' + err);
        }
    }).lean();
}

exports.checkadmin = (req, res, next) => {
    User.find((err, docs) => {
        if (!err) {
            res.render("User/admin", {
                admin: docs
            });
        }
        else {
            console.log('Error in retrieving employee list :' + err);
        }
    }).lean();
}



function handleValidationError(err, body) {
    for (field in err.errors) {
        switch (err.errors[field].path) {
            case 'fullName':
                body['fullNameError'] = err.errors[field].message;
                break;
            case 'email':
                body['emailError'] = err.errors[field].message;
                break;
            default:
                break;
        }
    }
}



exports.deleteId = (req, res, next) => {
    User.findByIdAndRemove(req.params.id, (err, doc) => {
        if (!err) {
            res.redirect('/User/list');
        }
        else { console.log('Error in user delete :' + err); }
    }).lean();
}

exports.getbyid = (req, res, next) => {
    User.findById(req.params.id, (err, doc) => {
        if (!err) {
            res.render("User/addOrEdit", {
                viewTitle: "Update User",
                user: doc
            });
        }
    }).lean();
}