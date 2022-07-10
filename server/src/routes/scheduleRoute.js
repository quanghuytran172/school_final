const router = require("express").Router();

const { scheduleController } = require("../controllers");

const tokenHandler = require("../handlers/tokenHandler");

router.post(
    "/direct-booking",
    tokenHandler.verifyVaccinatedHelperToken,
    scheduleController.directBooking
);
router.get(
    "/certificate/:userBookingId/:userId",
    tokenHandler.verifyVaccinatedHelperToken,
    scheduleController.getInfoVaccinated
);
router.get(
    "/system",
    tokenHandler.verifyVaccinatedHelperToken,
    scheduleController.getAll
);

router.post(
    "/system",
    tokenHandler.verifyVaccinatedHelperToken,
    scheduleController.create
);

router.get(
    "/system/:id",
    tokenHandler.verifyVaccinatedHelperToken,
    scheduleController.getOne
);

router.put(
    "/system/:id",
    tokenHandler.verifyVaccinatedHelperToken,
    scheduleController.update
);

router.delete(
    "/system/:id",
    tokenHandler.verifyVaccinatedHelperToken,
    scheduleController.delete
);
router.get(
    "/",
    tokenHandler.verifyUserToken,
    scheduleController.getScheduleAvailable
);

module.exports = router;
