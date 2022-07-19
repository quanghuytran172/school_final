const {
    Schedule,
    UserBooking,
    User,
    UserVaccine,
    Vaccine,
} = require("../models");

// Lấy thông tin in giấy chứng nhận
exports.getInfoVaccinated = async (req, res) => {
    try {
        const userVaccineDetails = await UserVaccine.findOne({
            user: req.params.userId,
            userBooking: req.params.userBookingId,
        })
            .populate("vaccine")
            .populate("vaccineLot")
            .populate("userBooking");
        res.status(200).json(userVaccineDetails);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
};

exports.create = async (req, res) => {
    try {
        const newSchedule = new Schedule({
            account: req.role.id,
            title: req.body.title,
            time: req.body.time,
            maxQuantity: req.body.maxQuantity,
            status: req.body.status,
            listVaccine: req.body.listVaccine,
        });
        const saveSchedule = await newSchedule.save();

        res.status(201).json(saveSchedule);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
};

exports.getAll = async (req, res) => {
    try {
        const scheduleList = await Schedule.find({})
            .populate("account")
            .sort({ status: -1 })
            .sort("-createdAt");
        for (const schedule of scheduleList) {
            schedule.account.password = undefined;
            const usersBooking = await UserBooking.find({
                schedule: schedule._id,
            });
            // get total user booking
            schedule._doc.totalUsersBooking = usersBooking.length;
        }
        res.status(200).json(scheduleList);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
};
exports.getScheduleAvailable = async (req, res) => {
    try {
        const scheduleList = await Schedule.find({ status: { $ne: 0, $ne: 2 } })
            .populate("account")
            .sort("-createdAt");
        for (const schedule of scheduleList) {
            schedule.account.password = undefined;
            const usersBooking = await UserBooking.find({
                schedule: schedule._id,
            });
            const listVaccine = await Vaccine.find({
                _id: { $in: schedule.listVaccine },
            }).populate("diseaseId");

            // get total user booking
            schedule.listVaccine = listVaccine;
            schedule._doc.totalUsersBooking = usersBooking.length;
        }
        res.status(200).json(scheduleList);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
};
// Get details schedule including user booking
exports.getOne = async (req, res) => {
    try {
        const schedule = await Schedule.findById(req.params.id).populate(
            "account"
        );
        const usersBooking = await UserBooking.find({
            schedule: schedule._id,
        }).populate("vaccine");
        schedule._doc.userList = usersBooking;
        schedule._doc.totalUsersBooking = usersBooking.length;
        schedule.account.password = undefined;
        res.status(200).json(schedule);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
};

exports.update = async (req, res) => {
    try {
        if (!req.body.status || !["0", "1", "2"].includes(req.body.status))
            return res.status(500).json("Trạng thái không hợp lệ");
        const schedule = await Schedule.findByIdAndUpdate(req.params.id, {
            $set: req.body,
        });
        if (req.body.status === "0") {
            await UserBooking.updateMany(
                {
                    schedule: req.params.id,
                    status: "1",
                },
                { status: "0" }
            );
        }
        res.status(200).json(schedule);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
};

exports.delete = async (req, res) => {
    try {
        const findUserBookingExists = await UserBooking.find({
            schedule: req.params.id,
        });
        if (findUserBookingExists.length)
            return res.status(500).json("Không thể xóa lịch");
        await Schedule.findByIdAndDelete(req.params.id);

        res.status(200).json("Deleted");
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
};

// Xử lý thêm người đăng ký trực tiếp cho người phụ trách tiêm chủng
exports.directBooking = async (req, res) => {
    // Kiểm tra xem người dùng có trong hệ thống chưa, nếu chưa tự động tạo mới người dân
    const findSchedule = await Schedule.findById(req.body.scheduleId);
    if (!findSchedule) return res.status(403).json("Lịch không tồn tại");
    if (findSchedule.status == 0 || findSchedule.status == 2) {
        return res.status(403).json("Lịch đã đóng hoặc đã hoàn thành");
    }
    const getAllUsersBooking = await UserBooking.find({
        schedule: findSchedule._id,
    });
    const numberUsersBooking = getAllUsersBooking.length;
    if (numberUsersBooking >= findSchedule.maxQuantity) {
        return res.status(400).json("Lịch đăng ký đã full");
    }
    const findUser = await User.findOne({
        $or: [
            { phoneNumber: req.body.phoneNumber },
            { insuranceNumber: req.body.insuranceNumber },
            { identify: req.body.identify },
        ],
    });
    let saveUser;
    if (findUser) {
        const findBookingDuplicate = await UserBooking.find({
            status: "1",
            $or: [
                {
                    user: findUser.id,
                },
                {
                    relativeUser: findUser.id,
                },
            ],
        });

        if (findBookingDuplicate && findBookingDuplicate.length) {
            return res.status(400).json("Mỗi người chỉ được đăng ký một lịch");
        }
        if (!findSchedule.listVaccine.includes(req.body.vaccineId))
            return res.status(403).json("Vắc xin không hợp lệ");
    } else {
        const newUser = new User({
            insuranceNumber: req.body.insuranceNumber,
            fullname: req.body.fullname,
            dateOfBirth: req.body.dateOfBirth,
            phoneNumber: req.body.phoneNumber,
            gender: req.body.gender,
            address: req.body.address,
            job: req.body.job,
            identify: req.body.identify,
            email: req.body.email,
        });
        saveUser = await newUser.save();
    }
    const idUser = findUser ? findUser.id : saveUser.id;

    // const idUser = saveUser && saveUser.id ? saveUser.id : findUser.id;
    // Thêm người đăng ký trực tiếp
    const formBooking = new UserBooking({
        user: idUser,
        schedule: req.body.scheduleId,
        bookingType: "Cá nhân",
        insuranceNumber: req.body.insuranceNumber,
        fullname: req.body.fullname,
        dateOfBirth: req.body.dateOfBirth,
        phoneNumber: req.body.phoneNumber,
        gender: req.body.gender,
        address: req.body.address,
        job: req.body.job,
        identify: req.body.identify,
        email: req.body.email,
        vaccine: req.body.vaccineId,
    });
    const saveBooking = await formBooking.save();
    res.status(200).json(saveBooking);
};
