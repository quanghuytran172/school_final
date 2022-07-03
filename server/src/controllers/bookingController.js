const { Schedule, UserBooking, User, UserVaccine } = require("../models");

exports.getAllBooking = async (req, res) => {
    try {
        const allBookingByUser = await UserBooking.find({
            user: req.role.user.id,
        })
            .populate("schedule")
            .populate("vaccine")
            .sort("-createdAt");

        res.status(200).json(allBookingByUser);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
};

// Lấy thông tin in giấy khám sàng lọc
exports.getOneBooking = async (req, res) => {
    try {
        const booking = await UserBooking.findById(req.params.id);
        res.status(200).json(booking);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
};

// People register for vaccination

exports.booking = async (req, res) => {
    try {
        const { id } = req.role.user;

        const findSchedule = await Schedule.findById(req.body.scheduleId);

        if (!findSchedule) return res.status(403).json("Lịch không tồn tại");
        if (findSchedule.status == 0 || findSchedule.status == 2) {
            return res.status(400).json("Lịch đã đóng hoặc đã hoàn thành");
        }
        if (findSchedule) {
            const getAllUsersBooking = await UserBooking.find({
                schedule: findSchedule._id,
            });
            const numberUsersBooking = getAllUsersBooking.length;
            if (numberUsersBooking >= findSchedule.maxQuantity) {
                return res.status(400).json("Lịch đăng ký đã full");
            }
        }
        if (!findSchedule.listVaccine.includes(req.body.vaccineId))
            return res.status(400).json("Vắc xin không hợp lệ");

        // Cá nhân và người đăng ký hộ không được trùng lặp và đăng ký trên 1 lịch

        if (req.body.bookingType === "Cá nhân") {
            const findPersonalBookingDuplicate = await UserBooking.find({
                user: id,
                relativeUser: null,
                status: "1",
                bookingType: req.body.bookingType,
            });

            if (
                findPersonalBookingDuplicate &&
                findPersonalBookingDuplicate.length
            ) {
                return res
                    .status(400)
                    .json("Mỗi người chỉ được đăng ký một lịch");
            }
        }

        let findUser = await User.findOne({
            $or: [
                { phoneNumber: req.body.phoneNumber },
                { insuranceNumber: req.body.insuranceNumber },
                { identify: req.body.identify },
            ],
        });

        if (findUser && req.body.bookingType === "Đăng ký hộ") {
            if (findUser.id === id)
                return res.status(400).json("Không thể đăng ký chính mình");
            const findFriendBookingDuplicate = await UserBooking.find({
                user: id,
                relativeUser: findUser.id,
                status: "1",
                bookingType: req.body.bookingType,
            });

            if (
                findFriendBookingDuplicate &&
                findFriendBookingDuplicate.length
            ) {
                return res
                    .status(400)
                    .json("Mỗi người chỉ được đăng ký một lịch");
            }
        }
        if (!findUser) {
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
            findUser = await newUser.save();
        }
        const formSubmitBooking = new UserBooking({
            user: id,
            relativeUser:
                req.body.bookingType === "Đăng ký hộ" ? findUser.id : null, // Id người đăng ký hộ
            schedule: req.body.scheduleId,
            bookingType: req.body.bookingType,
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
        const saveBooking = await formSubmitBooking.save();

        res.status(200).json(saveBooking);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
};

exports.cancelBooking = async (req, res) => {
    try {
        const { id } = req.role.user;
        const findBooking = await UserBooking.findById(req.params.bookingId);

        if (!findBooking)
            return res.status(403).json("Không tìm thấy hồ sơ đăng ký");
        if (findBooking.status === "2")
            return res
                .status(400)
                .json("Không thể hủy đăng ký sau khi tiêm và xác nhận tiêm");
        const findSchedule = await Schedule.findById(findBooking.schedule);
        if (!findSchedule)
            return res.status(403).json("Không tìm thấy lịch đăng ký");
        if (findSchedule.status == 0 || findSchedule.status == 2) {
            return res
                .status(400)
                .json("Lịch đã đóng hoặc đã hoàn thành không thể hủy đăng ký");
        }
        if (findBooking.user != id)
            return res
                .status(400)
                .json("Không thể hủy đăng ký lịch của người khác");

        await UserBooking.findByIdAndDelete(req.params.bookingId);
        res.status(200).json("Đã hủy đăng ký");
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
};

exports.updateStatus = async (req, res) => {
    try {
        const booking = await UserBooking.findById(req.params.bookingId);
        if (!booking) return res.status(403).json("Không tìm thấy lịch");

        if (booking.status === "0" || booking.status === "3")
            return res.status(400).json("Trạng thái không hợp lệ");
        const updateBooking = await UserBooking.findByIdAndUpdate(
            req.params.bookingId,
            {
                $set: req.body,
            }
        );

        res.status(200).json(updateBooking);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
};
