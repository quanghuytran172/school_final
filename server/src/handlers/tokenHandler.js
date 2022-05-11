const jsonwebtoken = require("jsonwebtoken");
const { Admin } = require("../models");

const tokenDecode = (req) => {
    const bearerHeader = req.headers["authorization"];
    if (bearerHeader) {
        const bearer = bearerHeader.split(" ")[1];
        try {
            const tokenDecoded = jsonwebtoken.verify(
                bearer,
                process.env.TOKEN_SECRET_KEY
            );
            return tokenDecoded;
        } catch (err) {
            return false;
        }
    } else {
        return false;
    }
};

exports.verifyAdminToken = async (req, res, next) => {
    const tokenDecoded = tokenDecode(req);
    if (tokenDecoded) {
        console.log(tokenDecoded);
        const admin = await Admin.findById(tokenDecoded.id);
        if (!admin) return res.status(403).json("Not allowed!");
        req.admin = admin;
        next();
    } else {
        res.status(401).json("Unauthorized");
    }
};
