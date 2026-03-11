const express = require("express");
const router = express.Router();
const {
  createForm,
  getAllForms,
  getFormById,
  updateForm,
  deleteForm,
  duplicateForm,
} = require("../controllers/formController");

router.post("/", createForm);
router.get("/", getAllForms);
router.get("/:id", getFormById);
router.put("/:id", updateForm);
router.delete("/:id", deleteForm);
router.post("/:id/duplicate", duplicateForm);

module.exports = router;
