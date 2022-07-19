const CryptoJS = require("crypto-js");
const { Account, AccountRole } = require("../models");

exports.createAdmin = async () => {
    const username = process.env.DEFAULT_ADMIN_USERNAME;
    const password = process.env.DEFAULT_ADMIN_PASSWORD;
    try {
        const admin = await Account.findOne({ username: username });
        let roleAdmin = await AccountRole.findOne({ roleName: "Admin" });
        const roleVaccinatedHelper = await AccountRole.findOne({
            roleName: "Vaccinated Helper",
        });
        if (admin !== null) {
            return true;
        }
        if (!roleAdmin) {
            console.log("Role Admin created !");
            roleAdmin = await AccountRole.create({ roleName: "Admin" });
        }
        if (!roleVaccinatedHelper) {
            console.log("Role Vaccinated Helper created !");
            await AccountRole.create({
                roleName: "Vaccinated Helper",
            });
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
            role: roleAdmin.id,
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
