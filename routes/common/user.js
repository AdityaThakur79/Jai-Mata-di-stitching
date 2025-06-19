import express from "express";
import {
  getUserProfileController,
  loginController,
  logoutController,
  registerController,
  updateProfileController,
  verifyOTPController,
} from "../../controllers/common/user.js";
import isAuthenticated from "../../middlewares/common/isAuthenticated.js";
import upload from "../../utils/common/Uploads.js";

const router = express.Router();

//register
router.post("/register", registerController);
//verify-otp
router.post("/verify-otp", verifyOTPController);
//login
router.post("/login", loginController);
//forgotpassword
//logout
router.get("/logout", logoutController);
//profile
router.get("/profile", isAuthenticated, getUserProfileController);
//update profile
router.put("/update-profile", isAuthenticated, upload, updateProfileController);

//create admins
//get admins
//updateadmins
//deleteadmins

export default router;
