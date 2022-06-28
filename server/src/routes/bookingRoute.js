const router = require("express").Router();

const { bookingController } = require("../controllers");

const tokenHandler = require("../handlers/tokenHandler");


router.get("/", tokenHandler.verifyUserToken, bookingController.getAllBooking);
router.post("/", tokenHandler.verifyUserToken, bookingController.booking);
router.get("/:id", tokenHandler.verifyVaccinatedHelperToken, bookingController.getOneBooking);

router.delete(
    "/:bookingId",
    tokenHandler.verifyUserToken,
    bookingController.cancelBooking
);
router.put(
    "/:bookingId",
    tokenHandler.verifyVaccinatedHelperToken,
    bookingController.updateStatus
);

module.exports = router;
