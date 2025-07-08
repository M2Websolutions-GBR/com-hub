const express = require("express");
const router = express.Router();

const {
  register,
  login,
  logout,
  getUser,
  getProfile,
  updatePassword,
  updateDetails,
  updateEmail,
  updateChannelName,
  forgotPassword,
  resetPassword,
  googleLogin,
} = require("../controllers/auth");

const { protect } = require("@comhub/middleware/auth");

router.post("/register", register);
router.post("/login", login);
router.post("/googlelogin", googleLogin);
router.post("/logout", logout);
router.post("/getuser", protect, getUser);
router.get("/getprofile", protect, getProfile);
router.put("/updatedetails", protect, updateDetails);
router.put("/updatepassword", protect, updatePassword);
router.put("/updateemail", protect, updateEmail);
router.put("/updatechannelname", protect, updateChannelName);
router.post("/forgotpassword", forgotPassword);
router.put("/resetpassword/:resettoken", resetPassword);

module.exports = router;
