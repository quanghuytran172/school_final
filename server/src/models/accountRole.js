const mongoose = require("mongoose");
const { schemaOptions } = require("./modelOptions");

const accountRoleSchema = new mongoose.Schema(
    {
        roleName: {
            type: String,
            required: true,
        },
    },
    schemaOptions
);

module.exports = mongoose.model("AccountRole", accountRoleSchema);
