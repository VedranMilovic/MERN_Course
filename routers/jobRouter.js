import { Router } from "express";

const router = Router();

import {
  getAllJobs,
  getSingleJob,
  createJob,
  updateJob,
  deleteJob,
  showStats,
} from "../controllers/jobController.js";
import {
  validateJobInput,
  validateIdParam,
} from "../middleware/validationMiddleware.js";
import { checkForTestUser } from "../middleware/authMiddleware.js";

// router.get("/", getAllJobs);
// router.post("/", createJob);

router
  .route("/")
  .get(getAllJobs)
  .post(checkForTestUser, validateJobInput, createJob); // isto kao i ovo gore, drugi način. Tu može ići authenticateUser (ispred svake rute)

router.route("/stats").get(showStats); // ova route mora biti prije /:id, jer inače express misli da je route /:id/stats

router
  .route("/:id")
  .get(validateIdParam, getSingleJob)
  .patch(checkForTestUser, validateJobInput, validateIdParam, updateJob)
  .delete(checkForTestUser, validateIdParam, deleteJob); // isto kao i ovo gore, drugi način

export default router;
