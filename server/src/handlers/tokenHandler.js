const jsonwebtoken = require("jsonwebtoken");
const { Account, AccountRole } = require("../models");

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
        const admin = await Account.findById(tokenDecoded.id);
        if (!admin) return res.status(403).json("Không có quyền truy cập!");
        const role = await AccountRole.findById(admin.role);

        if (!role || role.roleName !== "Admin") {
            return res.status(403).json("Không có quyền truy cập");
        }

        req.admin = admin;
        next();
    } else {
        res.status(401).json("Unauthorized");
    }
};

exports.verifyVaccinatedHelperToken = async (req, res, next) => {
    const tokenDecoded = tokenDecode(req);
    if (tokenDecoded) {
        const account = await Account.findById(tokenDecoded.id);
        if (!account) return res.status(403).json("Không có quyền truy cập!");
        const role = await AccountRole.findById(account.role);
        console.log(role.roleName);
        if (
            !(
                role.roleName === "Admin" ||
                role.roleName === "Vaccinated Helper"
            )
        ) {
            return res.status(403).json("Không có quyền truy cập");
        }
        req.admin = account;
        next();
    } else {
        res.status(401).json("Unauthorized");
    }
};
