const CryptoJS = require("crypto-js");
const { Account } = require("../models");

exports.createAdmin = async () => {
    const username = process.env.DEFAULT_ADMIN_USERNAME;
    const password = process.env.DEFAULT_ADMIN_PASSWORD;
    try {
        const admin = await Account.findOne({ username: username });
        if (admin !== null) {
            return true;
        }
        const newAdmin = new Account({
            username: username,
            password: CryptoJS.AES.encrypt(
                password,
                process.env.PASSWORD_SECRET_KEY
            ),
            fullname: "Tran Quang Huy",
            phoneNumber: "0123456",
            email: "admin@gmail.com",
            role: "627d1973e40fbe045f6e2a39",
        });
        await newAdmin.save();
        console.log("--------------------------");
        console.log("Admin created with");
        console.log(`Username => ${username}`);
        console.log(`Password => ${password}`);
        console.log("--------------------------");
    } catch (err) {
        console.log(err);
        return false;
    }
};
