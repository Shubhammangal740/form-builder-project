const mongoose = require("mongoose");
const Form = require("../models/Form");
const Response = require("../models/Response");

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// POST /api/responses
const submitResponse = async (req, res, next) => {
  try {
    const { formId, answers } = req.body;

    if (!formId) {
      return res
        .status(400)
        .json({ success: false, message: "Form ID is required" });
    }

    if (!isValidObjectId(formId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid form ID" });
    }

    if (
      !answers ||
      typeof answers !== "object" ||
      Array.isArray(answers) ||
      Object.keys(answers).length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Answers object is required and must not be empty",
      });
    }

    const form = await Form.findById(formId).lean();
    if (!form) {
      return res
        .status(404)
        .json({ success: false, message: "Form not found" });
    }

    // Validate that answer keys correspond to actual form field labels
    const validLabels = new Set(form.fields.map((f) => f.label));
    const answerKeys = Object.keys(answers);

    const invalidKeys = answerKeys.filter((key) => !validLabels.has(key));
    if (invalidKeys.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Invalid answer fields: ${invalidKeys.join(", ")}`,
      });
    }

    // Check that all required fields have answers
    const requiredLabels = form.fields
      .filter((f) => f.required)
      .map((f) => f.label);
    const missingRequired = requiredLabels.filter((label) => {
      const val = answers[label];
      if (val === undefined || val === null) return true;
      if (typeof val === "string" && val.trim() === "") return true;
      if (Array.isArray(val) && val.length === 0) return true;
      return false;
    });

    if (missingRequired.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingRequired.join(", ")}`,
      });
    }

    // Validate answer values against field types
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const typeErrors = [];

    for (const field of form.fields) {
      const val = answers[field.label];
      if (val === undefined || val === null || val === "") continue;

      switch (field.type) {
        case "email":
          if (typeof val !== "string" || !emailRegex.test(val.trim())) {
            typeErrors.push(`"${field.label}" must be a valid email address`);
          }
          break;
        case "number":
          if (isNaN(val) || String(val).trim() === "") {
            typeErrors.push(`"${field.label}" must be a valid number`);
          }
          break;
        case "dropdown":
        case "radio":
          if (
            field.options &&
            field.options.length > 0 &&
            !field.options.includes(val)
          ) {
            typeErrors.push(`"${field.label}" has an invalid option selected`);
          }
          break;
        case "checkbox":
          if (!Array.isArray(val)) {
            typeErrors.push(
              `"${field.label}" must be an array of selected options`,
            );
          } else if (field.options && field.options.length > 0) {
            const invalid = val.filter((v) => !field.options.includes(v));
            if (invalid.length > 0) {
              typeErrors.push(
                `"${field.label}" contains invalid options: ${invalid.join(", ")}`,
              );
            }
          }
          break;
        case "text":
        case "textarea":
          if (typeof val !== "string") {
            typeErrors.push(`"${field.label}" must be a text value`);
          } else if (val.length > 5000) {
            typeErrors.push(
              `"${field.label}" exceeds maximum length of 5000 characters`,
            );
          }
          break;
        default:
          break;
      }
    }

    if (typeErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: typeErrors.join(". "),
      });
    }

    const response = await Response.create({ formId, answers });
    res.status(201).json({ success: true, data: response });
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res
        .status(400)
        .json({ success: false, message: messages.join(". ") });
    }
    next(error);
  }
};

// GET /api/responses/:formId
const getResponsesByForm = async (req, res, next) => {
  try {
    if (!isValidObjectId(req.params.formId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid form ID" });
    }

    const form = await Form.findById(req.params.formId).lean();
    if (!form) {
      return res
        .status(404)
        .json({ success: false, message: "Form not found" });
    }

    const responses = await Response.find({ formId: req.params.formId })
      .sort({ submittedAt: -1 })
      .lean();

    res.status(200).json({ success: true, data: responses });
  } catch (error) {
    next(error);
  }
};

module.exports = { submitResponse, getResponsesByForm };
