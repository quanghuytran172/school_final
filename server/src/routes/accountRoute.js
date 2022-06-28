const router = require("express").Router();
const { accountController } = require("../controllers");
const tokenHandler = require("../handlers/tokenHandler");
router.post("/login", accountController.login);

router.get(
    "/summary",
    tokenHandler.verifyVaccinatedHelperToken,
    accountController.summary
);
router.get(
    "/role",
    tokenHandler.verifyAdminToken,
    accountController.getAllRole
);
router.get(
    "/profile",
    tokenHandler.verifyVaccinatedHelperToken,
    accountController.getInfoAccount
);
router.get("/", tokenHandler.verifyAdminToken, accountController.getAll);
router.post("/", tokenHandler.verifyAdminToken, accountController.create);
router.get("/:id", tokenHandler.verifyAdminToken, accountController.getOne);
router.put("/:id", tokenHandler.verifyAdminToken, accountController.update);
router.delete("/:id", tokenHandler.verifyAdminToken, accountController.delete);

router.post(
    "/update-profile",
    tokenHandler.verifyVaccinatedHelperToken,
    accountController.updateInfoByAccount
);
router.post(
    "/check-token",
    tokenHandler.verifyVaccinatedHelperToken,
    (req, res) => {
        res.status(200).json(req.role);
    }
);

module.exports = router;
