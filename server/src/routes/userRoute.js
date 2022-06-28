const express = require("express");
const router = express.Router();
const tokenHandler = require("../handlers/tokenHandler");
const { userController } = require("../controllers");

router.post("/login", userController.login);
router.post("/sendOtp", userController.sendOtp);
router.get(
    "/vaccination-records",
    tokenHandler.verifyUserToken,
    userController.getVaccinationRecords
);
router.get(
    "/profile",
    tokenHandler.verifyUserToken,
    userController.getInfoByUser
);
router.put(
    "/update-profile",
    tokenHandler.verifyUserToken,
    userController.updateInfoByUser
);

// add vaccinated to user

router.post(
    "/vaccinated",
    tokenHandler.verifyVaccinatedHelperToken,
    userController.vaccinated
);

router.post("/", userController.create);

router.get(
    "/",
    tokenHandler.verifyVaccinatedHelperToken,
    userController.getAll
);

router.get(
    "/:id",
    tokenHandler.verifyVaccinatedHelperToken,
    userController.getOne
);

router.put(
    "/:id",
    tokenHandler.verifyVaccinatedHelperToken,
    userController.update
);

router.delete(
    "/:id",
    tokenHandler.verifyVaccinatedHelperToken,
    userController.delete
);

router.post("/check-token", tokenHandler.verifyUserToken, (req, res) => {
    res.status(200).json(req.role);
});
module.exports = router;
