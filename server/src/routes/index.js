const router = require("express").Router();

router.use("/account", require("./accountRoute"));
router.use("/user", require("./userRoute"));
router.use("/vaccine", require("./vaccineRoute"));
router.use("/disease", require("./diseaseRoute"));

module.exports = router;
