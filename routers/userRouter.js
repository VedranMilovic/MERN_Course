import { Router } from "express";
import {
  getApplicationStats,
  getCurrentUser,
  updateUser,
} from "../controllers/userController.js";
import { validateUpdateUserInput } from "../middleware/validationMiddleware.js";
import {
  authorizePermissions,
  checkForTestUser,
} from "../middleware/authMiddleware.js";
import upload from "../middleware/multerMiddleware.js";

const router = Router();

router.get("/current-user", getCurrentUser); // path je API/v1/users
router.get(
  "/admin/app-stats",
  authorizePermissions("admin"), // tu odma invokamo funkciju, pa treba "admin". Ne treba checkForTestUser jer je user.role admin
  getApplicationStats
); // samo admin može pristupiti stats
router.patch(
  "/update-user",
  checkForTestUser,
  upload.single("avatar"),
  validateUpdateUserInput,
  updateUser
);

export default router;
