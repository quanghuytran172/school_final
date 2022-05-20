const router = require("express").Router();
const { accountController } = require("../controllers");
const tokenHandler = require("../handlers/tokenHandler");
router.post("/login", accountController.login);

router.get(
    "/summary",
    tokenHandler.verifyAdminToken,
    accountController.summary
);
router.get(
    "/role",
    tokenHandler.verifyAdminToken,
    accountController.getAllRole
);
router.get("/", tokenHandler.verifyAdminToken, accountController.getAll);
router.post("/", tokenHandler.verifyAdminToken, accountController.create);
router.get("/:id", tokenHandler.verifyAdminToken, accountController.getOne);
router.put("/:id", tokenHandler.verifyAdminToken, accountController.update);
router.delete("/:id", tokenHandler.verifyAdminToken, accountController.delete);

router.post(
    "/check-token",
    tokenHandler.verifyVaccinatedHelperToken,
    (req, res) => {
        res.status(200).json("Authorized");
    }
);

module.exports = router;
