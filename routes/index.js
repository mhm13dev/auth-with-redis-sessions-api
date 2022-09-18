const express = require("express");
const AuthControllers = require("../controllers/auth.controllers");

const router = express.Router();

router.post("/auth/signup", AuthControllers.signup);
router.post("/auth/login", AuthControllers.login);
router.get("/auth/me", AuthControllers.getMe);
router.post("/auth/logout", AuthControllers.logout);

module.exports = router;
