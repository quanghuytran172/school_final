const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const {
    Account,
    User,
    Vaccine,
    VaccineLot,
    UserVaccine,
    AccountRole,
} = require("../models");

exports.login = async (req, res) => {
    try {
        const account = await Account.findOne({
            username: req.body.username,
        });
        if (!account) return res.status(401).json("Sai tên đăng nhập!");
        const decryptedPass = CryptoJS.AES.decrypt(
            account.password,
            process.env.PASSWORD_SECRET_KEY
        ).toString(CryptoJS.enc.Utf8);
        if (decryptedPass !== req.body.password)
            return res.status(401).json("Sai mật khẩu!");

        const token = jwt.sign(
            {
                id: account._id,
            },
            process.env.TOKEN_SECRET_KEY
        );
        account.password = undefined;

        res.status(200).json({
            token,
            account,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
};

exports.create = async (req, res) => {
    try {
        const account = await Account.findOne({ username: req.body.username });
        console.log(req.body);
        if (account !== null) {
            return res.status(403).json("Tài khoản đã tồn tại");
        }
        const newAccount = new Account({
            username: req.body.username,
            password: CryptoJS.AES.encrypt(
                req.body.password,
                process.env.PASSWORD_SECRET_KEY
            ),
            fullname: req.body.fullname,
            phoneNumber: req.body.phoneNumber,
            email: req.body.email,
            role: req.body.roleId,
        });
        const saveAccount = await newAccount.save();
        saveAccount.password = undefined;
        res.status(200).json(saveAccount);
    } catch (err) {
        console.log(err);
        return false;
    }
};

exports.getAll = async (req, res) => {
    try {
        let accounts = await Account.find({}).sort("-createdAt");
        const roles = await AccountRole.find({});
        accounts = accounts.map((account) => {
            const findRole = roles.find((role) => {
                return role.id == account.role;
            });
            account.password = undefined;
            return {
                ...account._doc,
                roleName: findRole.roleName,
                id: account._id,
            };
        });
        res.status(200).json(accounts);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
};

exports.getAllRole = async (req, res) => {
    try {
        const roles = await AccountRole.find({});
        res.status(200).json(roles);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
};

exports.delete = async (req, res) => {
    try {
        await Account.findByIdAndDelete(req.params.id);
        res.status(200).json("Deleted");
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
};
exports.getOne = async (req, res) => {
    try {
        const account = await Account.findById(req.params.id);
        const decryptedPass = CryptoJS.AES.decrypt(
            account.password,
            process.env.PASSWORD_SECRET_KEY
        ).toString(CryptoJS.enc.Utf8);
        account.password = decryptedPass;
        res.status(200).json(account);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
};

exports.update = async (req, res) => {
    try {
        const passwordDecrypt = CryptoJS.AES.encrypt(
            req.body.password,
            process.env.PASSWORD_SECRET_KEY
        ).toString();
        const account = await Account.findOneAndUpdate(
            { _id: req.params.id },
            {
                $set: {
                    ...req.body,
                    password: passwordDecrypt,
                },
            }
        );
        res.status(200).json(account);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
};

// admin dashboard summary data
exports.summary = async (req, res) => {
    try {
        const totalUser = await User.find({}).count();

        // count user vaccinated
        const userVaccinated = await UserVaccine.aggregate([
            {
                $group: { _id: "$user" },
            },
        ]).count("user");

        // count total vaccine dose
        const totalVaccineDose = await VaccineLot.aggregate([
            {
                $group: {
                    _id: null,
                    quantity: { $sum: "$quantity" },
                },
            },
        ]);

        // count total used vaccine dose
        const totalVaccineDoseUsed = await VaccineLot.aggregate().group({
            _id: null,
            vaccinated: { $sum: "$vaccinated" },
        });

        // get lates vaccine lot
        const latestVaccineLot = await VaccineLot.find({})
            .sort("-createdAt")
            .limit(4)
            .populate("vaccine");

        // count user who has one vaccine dose
        const userWithOneDose = await UserVaccine.aggregate()
            .group({
                _id: "$user",
                quantity: { $sum: +1 },
            })
            .match({ quantity: 1 })
            .count("count");

        // count user who has >= two dose
        const userWithAboveTwoDose = await UserVaccine.aggregate()
            .group({
                _id: "$user",
                quantity: { $sum: +1 },
            })
            .match({ quantity: { $gte: 2 } })
            .count("count");

        res.status(200).json({
            totalUser,
            userVaccinated: userVaccinated[0] ? userVaccinated[0].user : 0,
            availableVaccineDose:
                (totalVaccineDose[0] ? totalVaccineDose[0].quantity : 0) -
                (totalVaccineDoseUsed[0]
                    ? totalVaccineDoseUsed[0].vaccinated
                    : 0),
            latestVaccineLot,
            userVaccinatedAnalyst: {
                totalUser,
                userWithAboveTwoDose: userWithAboveTwoDose[0]
                    ? userWithAboveTwoDose[0].count
                    : 0,
                userWithOneDose: userWithOneDose[0]
                    ? userWithOneDose[0].count
                    : 0,
                userWithZeroDose:
                    totalUser -
                    (userVaccinated[0] ? userVaccinated[0].user : 0),
            },
        });
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
};
