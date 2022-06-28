const mongoose = require("mongoose");
const { schemaOptions } = require("./modelOptions");
const Schema = mongoose.Schema;

const vaccineSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
        },
        price: {
            type: Number,
            required: true,
        },
        diseaseId: {
            type: Schema.Types.ObjectId,
            ref: "Disease",
            required: true,
        },
    },
    schemaOptions
);

module.exports = mongoose.model("Vaccine", vaccineSchema);
