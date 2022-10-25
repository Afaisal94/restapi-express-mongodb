const express = require("express");
const router = express.Router();

const Auth = require("../controllers/Auth");

router.post("/register", Auth.registerUser);
router.post("/login", Auth.loginUser);

module.exports = router;
