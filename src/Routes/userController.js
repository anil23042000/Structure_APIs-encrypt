const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const alert = require('alert');
var router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model('User');
const auth = require("../Middleware/auth");
const userSchema = require("../Models/userSchema");
const controller = require("../Controller/controller");
const services = require("../Service/service");

const JWT_SECRET = "accionlabssecret";

// router.post("/login",controller.login);
// router.post("/",controller.registerOrUpdate);
// router.get("/delete/:id",controller.deleteId);
// router.get("/:id",controller.getbyid);

router.get('/', (req, res) => {
    res.render("User/addOrEdit", {
        viewTitle: "Insert Users"
    });
});



router.post('/login', async (req, res) => {
    services.loginUser(req, res);
});

// router.get("/verify", auth, async (req, res) => {
//     try {
//         // request.user is getting fetched from Middleware after token authentication
//         const user = await User.findById(req.user.id);
//         confirm(user);
//         res.json(user);
//     } catch (e) {
//         res.send({ message: "Error in Fetching user" });
//     }
// });


router.post('/', (req, res) => {
    if (req.body._id == '')
        services.insertRecord(req, res);
    else
        services.updateRecord(req, res);
});
router.get('/list', (req, res) => {
    services.allUsers(req, res);
});

router.get('/admin', (req, res) => {
    services.findAdmin(req, res);
});

router.get('/:id', (req, res) => {
    services.getbyId(req, res);
});

router.get('/delete/:id', (req, res) => {
    services.deleteId(req, res);
});

module.exports = router;