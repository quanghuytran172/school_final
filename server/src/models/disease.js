const mongoose = require("mongoose");
const { schemaOptions } = require("./modelOptions");

const diseaseSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
    },
    schemaOptions
);

module.exports = mongoose.model("Disease", diseaseSchema);
