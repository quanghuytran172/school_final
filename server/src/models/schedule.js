const mongoose = require("mongoose");
const { schemaOptions } = require("./modelOptions");
const Schema = mongoose.Schema;

const scheduleSchema = new mongoose.Schema(
    {
        account: {
            type: Schema.Types.ObjectId,
            ref: "Account",
            required: true,
        },
        title: {
            type: String,
        },
        time: {
            type: Date,
            required: true,
        },
        maxQuantity: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            required: true,
            enum: ["0", "1", "2"],
            default: "1",
            // 0 Đã đóng
            // 1 Đang mở
            // 2 Hoàn thành
        },
        listVaccine: {
            type: Array,
            required: true,
        },
    },
    schemaOptions
);

module.exports = mongoose.model("Schedule", scheduleSchema);
