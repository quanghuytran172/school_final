const mongoose = require("mongoose");
const { schemaOptions } = require("./modelOptions");
const Schema = mongoose.Schema;

const userBookingSchema = new mongoose.Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        relativeUser: {
            type: Schema.Types.ObjectId,
            required: false,
        },
        schedule: {
            type: Schema.Types.ObjectId,
            ref: "Schedule",
            required: true,
        },
        bookingType: {
            type: String,
            required: true,
            enum: ["Cá nhân", "Đăng ký hộ"],
        },
        insuranceNumber: {
            type: String,
            required: true,
        },
        fullname: {
            type: String,
            required: true,
        },
        dateOfBirth: {
            type: Date,
            required: true,
        },
        phoneNumber: {
            type: String,
            required: true,
        },
        gender: {
            type: String,
            required: true,
        },
        address: {
            type: String,
            required: true,
        },
        job: {
            type: String,
            required: true,
        },
        identify: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        vaccine: {
            type: Schema.Types.ObjectId,
            ref: "Vaccine",
            required: true,
        },
        status: {
            // 1 chưa xác nhận tại điểm tiêm, 2 đã xác nhận,  0 đã hủy, 3 đã tiêm
            type: String,
            required: true,
            enum: ["0", "1", "2", "3"],
            default: "1",
        },
    },
    schemaOptions
);

module.exports = mongoose.model("UserBooking", userBookingSchema);
