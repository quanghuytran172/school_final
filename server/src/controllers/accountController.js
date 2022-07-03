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

exports.getInfoAccount = async (req, res) => {
    try {
        const { id } = req.role;
        const account = await Account.findById(id);
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

exports.updateInfoByAccount = async (req, res) => {
    try {
        const { id } = req.role;
        const passwordDecrypt = CryptoJS.AES.encrypt(
            req.body.password,
            process.env.PASSWORD_SECRET_KEY
        ).toString();
        const account = await Account.findOneAndUpdate(
            { _id: id },
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

const StatisticsVaccineUsedFunc = (userVaccineDetails) => {
    const countVaccinatedByNameObj = {};
    userVaccineDetails.map((record) => {
        if (!countVaccinatedByNameObj.hasOwnProperty(record.vaccine.name)) {
            countVaccinatedByNameObj[record.vaccine.name] = 1;
        } else {
            countVaccinatedByNameObj[record.vaccine.name]++;
        }
    });
    let data = Object.entries(countVaccinatedByNameObj).sort(
        ([, a], [, b]) => b - a
    );
    if (data.length > 6) {
        const totalOther = data.slice(5).reduce((total, element) => {
            return total + element[1];
        }, 0);
        data = [...data.slice(0, 5), ["Other", totalOther]];
    }
    return data;
};

// admin dashboard summary data
exports.summary = async (req, res) => {
    try {
        const getAllUser = await User.find({});
        const userVaccineDetails = await UserVaccine.find({}).populate(
            "vaccine"
        );
        const statisticsVaccineUsed =
            StatisticsVaccineUsedFunc(userVaccineDetails);
        const totalUser = getAllUser.length;

        // Người dân đăng ký mới trong tháng
        const newUserRegisterThisMonth = getAllUser.filter((record) => {
            const date = new Date(record.createdAt).toLocaleString("en-US", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
            });
            const [month, , year] = date.split("/");
            const currentMonth = new Date().getMonth() + 1;
            const currentYear = new Date().getFullYear();
            return currentMonth === +month && currentYear == year;
        }).length;
        // count user vaccinated
        const userVaccinated = await UserVaccine.aggregate([
            {
                $group: { _id: "$user" },
            },
        ]).count("user");

        // Tổng doanh thu
        const totalRevenue = userVaccineDetails.reduce((total, item) => {
            return total + item.vaccine.price;
        }, 0);

        // Tổng doanh thu hôm nay
        const totalRevenueToDay = userVaccineDetails.reduce((total, item) => {
            const date = new Date(item.createdAt).toLocaleString("en-US", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
            });
            let today = new Date();
            const dd = String(today.getDate()).padStart(2, "0");
            const mm = String(today.getMonth() + 1).padStart(2, "0");
            const yyyy = today.getFullYear();

            today = mm + "/" + dd + "/" + yyyy;
            if (today === date) return total + item.vaccine.price;
            return total;
        }, 0);

        // Lấy dnah sách vaccine lot gần nhất
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
            newUserRegisterThisMonth,
            totalRevenue,
            totalRevenueToDay,
            latestVaccineLot,
            userVaccinatedAnalyst: {
                totalUser,
                statisticsVaccineUsed,

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
