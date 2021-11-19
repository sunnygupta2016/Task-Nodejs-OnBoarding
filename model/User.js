const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");

const UserSchema = new Schema(
    {
        fullName: { type: String, default: "" },
        email: { type: String, default: "", },
        phoneNo: { type: String, default: "", },
        password: { type: String, default: "" },
        gender: { type: String, default: "", enum: ["", "MALE", "FEMALE", "OTHER"] },
        dob: { type: String, default: "" },
        status: { type: Boolean, default: false },
        accessToken: { type: String,default: "" },
        oneTimeCode: { type: String, default: "" },

       
    },
    { timestamps: true }
);

UserSchema.methods.authenticate = function (password, callback) {
    const promise = new Promise((resolve, reject) => {
        if (!password) reject(new Error("MISSING_PASSWORD"));

        bcrypt.compare(password, this.password, (error, result) => {
            if (!result) reject(new Error("INVALID_PASSWORD"));
            resolve(this);
        });
    });

    if (typeof callback != "function") return promise;
    promise.then((result) => callback(null, result)).catch((err) => callback(err));
};

UserSchema.methods.setPassword = function (password, callback) {
    const promise = new Promise((resolve, reject) => {
        if (!password) reject(new Error("MISSING_PASSWORD"));

        bcrypt.hash(password, 10, (err, hash) => {
            if (err) reject(err);
            this.password = hash;
            resolve(this);
        });
    });

    if (typeof callback != "function") return promise;
    promise.then((result) => callback(null, result)).catch((err) => callback(err));
};

const User = mongoose.model("User", UserSchema);

module.exports = User;