const express = require("express");
const router = express.Router();

const candidateController = require("../controllers/condidateController");
const metricsController = require("../controllers/metricesController");
const {
  validateCandidate,
  validateStatus,
  validate,
} = require("../middleware/validation");
const  handleFileUpload = require("../middleware/fileUpload");

// Candidate Routes
router.get("/", candidateController.getCandidates);
router.get("/metrics", metricsController.getMetrics);
router.get("/:id", candidateController.getCandidateById);

router.post(
  "/",
  handleFileUpload(),
  validateCandidate,
  validate,
  candidateController.createCandidate
);

router.put("/:id", candidateController.updateCandidate);

router.put(
  "/:id/status",
  validateStatus,
  validate,
  candidateController.updateCandidateStatus
);

router.delete("/:id", candidateController.deleteCandidate);

module.exports = router;