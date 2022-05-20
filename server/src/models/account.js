const mongoose = require("mongoose");
const { schemaOptions } = require("./modelOptions");
const Schema = mongoose.Schema;

const accountShema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        fullname: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        phoneNumber: {
            type: String,
            required: true,
        },
        role: {
            type: Schema.Types.ObjectId,
            ref: "AccountRole",
            required: true,
        },
    },
    schemaOptions
);

module.exports = mongoose.model("Account", accountShema);
