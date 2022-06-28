const jwt = require("jsonwebtoken");
const {
    User,
    UserVaccine,
    VaccineLot,
    Vaccine,
    UserBooking,
} = require("../models");

//login OTP using Phone Number
exports.login = async (req, res) => {
    const token = req.body.token;
    const number = `+${req.body.phoneNumber}`;
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const client = require("twilio")(accountSid, authToken);

    client.verify
        .services("VA73e1102bb007e8f4bfee65a3d644f6ca")
        .verificationChecks.create({ to: number, code: token })
        .then(async (verification_check) => {
            //approved is correct, pending is fail
            if (!verification_check.valid) {
                return res.status(500).json("Mã xác thực không đúng");
            }

            const user = await User.findOne({
                phoneNumber: req.body.phoneNumber,
            });
            if (!user)
                return res.status(200).json({
                    valid: verification_check.valid,
                    isNewUser: true,
                });
            const token = jwt.sign(
                {
                    id: user._id,
                },
                process.env.TOKEN_SECRET_KEY
            );

            res.status(200).json({
                valid: verification_check.valid,
                isNewUser: false,
                token,
            });
        })
        .catch((err) => res.status(500).json(err));
};

exports.sendOtp = async (req, res) => {
    const number = `+${req.body.phoneNumber}`;
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const client = require("twilio")(accountSid, authToken);
    client.verify
        .services("VA73e1102bb007e8f4bfee65a3d644f6ca")
        .verifications.create({
            from: "+12402209172",
            to: number,
            channel: "sms",
        })
        .then((verification) => {
            console.log(verification);
            return res.status(200).json(verification);
        })
        .catch((err) => res.status(500).json(err));
};

exports.create = async (req, res) => {
    const { phoneNumber, insuranceNumber } = req.body;
    try {
        let user = await User.findOne({ phoneNumber: phoneNumber });
        if (user)
            return res
                .status(403)
                .json("Số điện thoại đã tồn tại trong hệ thống");

        user = await User.findOne({ insuranceNumber: insuranceNumber });
        if (user)
            return res
                .status(403)
                .json("Số bảo hiểm đã tồn tại trong hệ thống");

        const newUser = new User(req.body);
        const savedUser = await newUser.save();
        const token = jwt.sign(
            {
                id: savedUser._id,
            },
            process.env.TOKEN_SECRET_KEY
        );

        res.status(201).json({
            user: savedUser,
            token,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
};

exports.getVaccinationRecords = async (req, res) => {
    try {
        const { id } = req.role.user;
        let userVaccine = await UserVaccine.find({
            user: id,
        })
            .populate("vaccine")
            .populate("vaccineLot")
            .sort("-createdAt");

        userVaccine = userVaccine.map((record) => {
            return {
                id: record.id,
                vaccineLotName: record.vaccineLot.name,
                name: record.vaccine.name,
                price: record.vaccine.price,
                createAtDay: record.createdAt,
                createAtTime: record.createdAt,
            };
        });
        res.status(200).json(userVaccine);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
};

exports.getInfoByUser = async (req, res) => {
    try {
        const { id } = req.role.user;
        const user = await User.findById(id);
        res.status(200).json(user);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
};

exports.updateInfoByUser = async (req, res) => {
    const { phoneNumber, insuranceNumber } = req.body;
    const { id } = req.role.user;
    try {
        let user = await User.findOne({ phoneNumber: phoneNumber });
        if (user && user._id.toString() !== id)
            return res
                .status(403)
                .json("Số điện thoại đã tồn tại trong hệ thống");

        user = await User.findOne({ insuranceNumber: insuranceNumber });
        if (user && user._id.toString() !== id)
            return res
                .status(403)
                .json("Số bảo hiểm đã tồn tại trong hệ thống");

        const updateUser = await User.findByIdAndUpdate(id, {
            $set: req.body,
        });
        res.status(200).json(updateUser);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
};

//admin
exports.getAll = async (req, res) => {
    try {
        const list = await User.find({}).sort("-createdAt");
        // for (const user of list) {
        //     const vaccine = await UserVaccine.find({
        //         user: user._id,
        //     }).sort("-createdAt");
        //     user._doc.vaccine = vaccine;
        // }
        res.status(200).json(list);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
};

exports.getOne = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        const userVaccine = await UserVaccine.find({
            user: req.params.id,
        })
            .populate("vaccine")
            .populate("vaccineLot")
            .populate("userBooking")
            .sort("-createdAt");

        user._doc.vaccinated = userVaccine;

        res.status(200).json(user);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
};

exports.update = async (req, res) => {
    const { phoneNumber, insuranceNumber } = req.body;
    try {
        let user = await User.findOne({ phoneNumber: phoneNumber });
        if (user && user._id.toString() !== req.params.id)
            return res
                .status(403)
                .json("Số điện thoại đã tồn tại trong hệ thống");

        user = await User.findOne({ insuranceNumber: insuranceNumber });
        if (user && user._id.toString() !== req.params.id)
            return res
                .status(403)
                .json("Số bảo hiểm đã tồn tại trong hệ thống");

        const updateUser = await User.findByIdAndUpdate(req.params.id, {
            $set: req.body,
        });
        res.status(200).json(updateUser);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
};

exports.delete = async (req, res) => {
    try {
        const { id } = req.params;
        await UserVaccine.deleteMany({ user: id });
        await User.findByIdAndDelete(id);
        res.status(200).json("Deleted");
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
};

// add vaccinated to user

exports.vaccinated = async (req, res) => {
    try {
        const { userId, vaccineId, vaccineLotId, userBookingId } = req.body;
        const newVaccine = new UserVaccine({
            user: userId,
            vaccine: vaccineId,
            vaccineLot: vaccineLotId,
            userBooking: userBookingId,
        });
        const savedUserVaccine = await newVaccine.save();
        await VaccineLot.findOneAndUpdate(
            {
                _id: vaccineLotId,
            },
            {
                $inc: { vaccinated: +1 },
            }
        );

        savedUserVaccine._doc.vaccine = await Vaccine.findById(vaccineId);
        savedUserVaccine._doc.vaccineLot = await VaccineLot.findById(
            vaccineLotId
        );
        res.status(201).json(savedUserVaccine);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
};
