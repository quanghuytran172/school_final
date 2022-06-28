const router = require("express").Router();

const { scheduleController } = require("../controllers");

const tokenHandler = require("../handlers/tokenHandler");

router.post(
    "/direct-booking",
    tokenHandler.verifyVaccinatedHelperToken,
    scheduleController.directBooking
);
router.get("/certificate/:userBookingId/:userId", tokenHandler.verifyVaccinatedHelperToken, scheduleController.getInfoVaccinated);


router.post(
    "/",
    tokenHandler.verifyVaccinatedHelperToken,
    scheduleController.create
);

router.get(
    "/",
    tokenHandler.verifyVaccinatedHelperToken,
    scheduleController.getAll
);

router.get(
    "/:id",
    tokenHandler.verifyVaccinatedHelperToken,
    scheduleController.getOne
);

router.put(
    "/:id",
    tokenHandler.verifyVaccinatedHelperToken,
    scheduleController.update
);

router.delete(
    "/:id",
    tokenHandler.verifyVaccinatedHelperToken,
    scheduleController.delete
);

module.exports = router;
