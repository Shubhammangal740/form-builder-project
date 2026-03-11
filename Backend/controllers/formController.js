const mongoose = require("mongoose");
const Form = require("../models/Form");

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// POST /api/forms
const createForm = async (req, res, next) => {
  try {
    const { title, description, fields, design } = req.body;

    if (!title || !fields || !Array.isArray(fields) || fields.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Title and at least one field are required",
      });
    }

    const form = await Form.create({ title, description, fields, design });
    res.status(201).json({ success: true, data: form });
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

// GET /api/forms
const getAllForms = async (req, res, next) => {
  try {
    const forms = await Form.find().sort({ createdAt: -1 }).lean();
    res.status(200).json({ success: true, data: forms });
  } catch (error) {
    next(error);
  }
};

// GET /api/forms/:id
const getFormById = async (req, res, next) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid form ID" });
    }

    const form = await Form.findById(req.params.id).lean();
    if (!form) {
      return res
        .status(404)
        .json({ success: false, message: "Form not found" });
    }

    res.status(200).json({ success: true, data: form });
  } catch (error) {
    next(error);
  }
};

// PUT /api/forms/:id
const updateForm = async (req, res, next) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid form ID" });
    }

    const { title, description, fields, design } = req.body;

    if (!title || !fields || !Array.isArray(fields) || fields.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Title and at least one field are required",
      });
    }

    const form = await Form.findById(req.params.id);
    if (!form) {
      return res
        .status(404)
        .json({ success: false, message: "Form not found" });
    }

    form.title = title;
    form.description = description;
    form.fields = fields;
    if (design !== undefined) form.design = design;
    await form.save(); // triggers validation

    res.status(200).json({ success: true, data: form });
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

// DELETE /api/forms/:id
const deleteForm = async (req, res, next) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid form ID" });
    }

    const form = await Form.findByIdAndDelete(req.params.id);
    if (!form) {
      return res
        .status(404)
        .json({ success: false, message: "Form not found" });
    }

    res
      .status(200)
      .json({ success: true, data: { message: "Form deleted successfully" } });
  } catch (error) {
    next(error);
  }
};

// POST /api/forms/:id/duplicate
const duplicateForm = async (req, res, next) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid form ID" });
    }

    const original = await Form.findById(req.params.id).lean();
    if (!original) {
      return res
        .status(404)
        .json({ success: false, message: "Form not found" });
    }

    // Strip _id and timestamps to create a clean duplicate
    const { _id, createdAt, updatedAt, __v, ...formData } = original;
    formData.title = `${formData.title} (Copy)`;

    const duplicate = await Form.create(formData);
    res.status(201).json({ success: true, data: duplicate });
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

module.exports = {
  createForm,
  getAllForms,
  getFormById,
  updateForm,
  deleteForm,
  duplicateForm,
};
