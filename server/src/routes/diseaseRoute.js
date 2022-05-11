const router = require("express").Router();

const { diseaseController } = require("../controllers");

const tokenHandler = require("../handlers/tokenHandler");

router.post("/", tokenHandler.verifyAdminToken, diseaseController.create);

router.get("/", tokenHandler.verifyAdminToken, diseaseController.getAll);
router.put("/:id", tokenHandler.verifyAdminToken, diseaseController.update);
router.delete("/:id", tokenHandler.verifyAdminToken, diseaseController.delete);

module.exports = router;
