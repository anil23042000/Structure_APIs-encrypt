const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");
const JWT_SECRET = "accionlabssecret";
var userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: 'This field is required.'
    },
    email: {
        type: String,
        required: true

    },
    passWord: {
        type: String,
        required: true
    },
    user_Type: {
        type: String,
        required: true
    },
    mobile: {
        type: String
    },
    city: {
        type: String
    },
    token: {
        type: String
    }
});

// Custom validation for email
userSchema.path('email').validate((val) => {
    emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(val);
}, 'Invalid e-mail.');


//generating tokens

userSchema.methods.generateAuthToken = async function () {
    try {
        let tokens = jwt.sign({ _id: this._id }, JWT_SECRET, {
            expiresIn: "1m"
        });
        console.log("2nd")
        this.token =tokens;
        //  this.token.cancat({token:tokens});
        await this.save(); 
        return tokens;
    } catch (error) {
        console.log(error);
    }
}

mongoose.model('User', userSchema);