const express = require("express");
const router = express.Router();
const {
  submitResponse,
  getResponsesByForm,
} = require("../controllers/responseController");

router.post("/", submitResponse);
router.get("/:formId", getResponsesByForm);

module.exports = router;
