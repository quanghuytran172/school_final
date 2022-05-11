const { Disease } = require("../models");

exports.create = async (req, res) => {
    try {
        const newDisease = new Disease({
            name: req.body.name,
        });
        const savedDisease = await newDisease.save();

        res.status(201).json(savedDisease);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
};

exports.getAll = async (req, res) => {
    try {
        const list = await Disease.find({}).sort("-createdAt");
        res.status(200).json(list);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
};

exports.update = async (req, res) => {
    try {
        const disease = await Disease.findByIdAndUpdate(req.params.id, {
            $set: req.body,
        });

        res.status(200).json(disease);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
};

exports.delete = async (req, res) => {
    try {
        await Disease.findByIdAndDelete(req.params.id);
        res.status(200).json("Deleted");
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
};
