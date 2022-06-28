const router = require("express").Router();

router.use("/account", require("./accountRoute"));
router.use("/user", require("./userRoute"));
router.use("/vaccine", require("./vaccineRoute"));
router.use("/disease", require("./diseaseRoute"));
router.use("/schedule", require("./scheduleRoute"));
router.use("/booking", require("./bookingRoute"));

module.exports = router;
