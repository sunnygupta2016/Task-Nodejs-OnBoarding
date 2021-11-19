const router = require("express").Router();
const Routes = require("./Routes");

router.use("/user", Routes.UserRoutes);

module.exports = router;