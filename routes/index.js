const express = require("express");
const {
  getUsers,
  getUserById,
  register,
  login,
  whoami,
  updateProfile,
  logout,
  updateRole,
} = require("../controllers/UserController");

const {
  getAllToko,
  getTokoById,
  getTokoOwner,
  getOwnedToko,
  createToko,
  updateToko,
  deleteToko,
  getProfileByRequest,
} = require("../controllers/TokoController");

const { authorize } = require("../middleware/authorize");
const { verifyToken } = require("../middleware/verifyToken");
const { signToken, verifyRole } = require("../services/authServices");
const { newToken } = require("../services/authServices");
const multer = require("multer");
const path = require("path");
const router = express.Router();
const passport = require("passport");
// handle storage using multer
let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "upload/images");
  },
  filename: function (req, file, cb) {
    let filename = file.originalname;
    req.body.file = filename;
    cb(null, filename);
  },
});

let upload = multer({ storage: storage });

// Auth Router
router.get("/users", verifyToken, getUsers);
router.get("/user/:id", verifyToken, getUserById);
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

//GET LOGOUT ONLY FOR LOGOUT WITHOUT FORM
router.get("/logout", (req, res) => {
  req.logout();
  res.status(200).send("Logout Success");
});

router.get("/whoami", verifyToken, whoami);
router.put(
  "/profile/update",
  [verifyToken, upload.single("image")],
  updateProfile
);
router.get("/token", newToken);

//Auth Google
router.get(
  "/auth/google",
  passport.authenticate("google", {
    session: false,
    scope: ["profile", "email"],
  })
);
router.get(
  "/auth/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    signToken(req, res);
  }
);
router.get("/auth/google/googleAccessToken", (req, res) => {
  verifyRole(req, res);
});
router.put("/profile/role", verifyToken, updateRole);

router.get("/tokos", verifyToken, getAllToko);
router.get("/toko/:id", verifyToken, getTokoById);
router.get("/toko/:id/owner", verifyToken, getTokoOwner);
router.get("/user/:id/tokos", verifyToken, getOwnedToko);

router.post("/toko/create", [verifyToken, upload.single("image")], createToko);
router.put(
  "/toko/:id/update",
  [verifyToken, upload.single("image")],
  updateToko
);
router.delete("/toko/:id/delete", verifyToken, deleteToko);

module.exports = router;
