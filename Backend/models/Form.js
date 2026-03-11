const mongoose = require("mongoose");

const FIELD_TYPES = [
  "text",
  "textarea",
  "dropdown",
  "radio",
  "checkbox",
  "number",
  "email",
];
const OPTION_TYPES = ["dropdown", "radio", "checkbox"];
const MAX_FIELDS = 100;
const MAX_OPTIONS = 50;

const fieldSchema = new mongoose.Schema(
  {
    label: {
      type: String,
      required: [true, "Field label is required"],
      trim: true,
      minlength: [1, "Field label cannot be empty"],
      maxlength: [200, "Field label cannot exceed 200 characters"],
    },
    type: {
      type: String,
      required: [true, "Field type is required"],
      enum: {
        values: FIELD_TYPES,
        message: "{VALUE} is not a supported field type",
      },
    },
    required: {
      type: Boolean,
      default: false,
    },
    options: {
      type: [
        {
          type: String,
          trim: true,
          maxlength: [200, "Option value cannot exceed 200 characters"],
        },
      ],
      default: undefined,
      validate: [
        {
          validator: function (val) {
            // Options must only be present for types that support them
            if (!OPTION_TYPES.includes(this.type)) {
              return val === undefined || val === null || val.length === 0;
            }
            return true;
          },
          message:
            "Options are only allowed for dropdown, radio, and checkbox field types",
        },
        {
          validator: function (val) {
            // Options must not be empty for types that require them
            if (OPTION_TYPES.includes(this.type)) {
              return Array.isArray(val) && val.length > 0;
            }
            return true;
          },
          message:
            "Options array must not be empty for dropdown, radio, and checkbox fields",
        },
        {
          validator: function (val) {
            if (!Array.isArray(val)) return true;
            return val.length <= MAX_OPTIONS;
          },
          message: `Options array cannot exceed ${MAX_OPTIONS} items`,
        },
        {
          validator: function (val) {
            // Prevent duplicate options
            if (!Array.isArray(val)) return true;
            const trimmed = val.map((v) => v.trim().toLowerCase());
            return new Set(trimmed).size === trimmed.length;
          },
          message: "Options must not contain duplicates",
        },
      ],
    },
  },
  {
    _id: false,
    strict: true, // Reject unknown properties
  },
);

const designSchema = new mongoose.Schema(
  {
    primaryColor: {
      type: String,
      default: "#4f46e5",
      match: [/^#([0-9a-fA-F]{3}){1,2}$/i, "Invalid hex color"],
    },
    backgroundColor: {
      type: String,
      default: "#ffffff",
      match: [/^#([0-9a-fA-F]{3}){1,2}$/i, "Invalid hex color"],
    },
    fontFamily: {
      type: String,
      default: "Inter",
      trim: true,
    },
    fieldAlignment: {
      type: String,
      enum: ["left", "center", "right"],
      default: "left",
    },
    formWidth: {
      type: String,
      default: "600px",
      trim: true,
      maxlength: 20,
    },
    buttonColor: {
      type: String,
      default: "#4f46e5",
      match: [/^#([0-9a-fA-F]{3}){1,2}$/i, "Invalid hex color"],
    },
  },
  {
    _id: false,
  },
);

const formSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Form title is required"],
      trim: true,
      minlength: [1, "Form title cannot be empty"],
      maxlength: [300, "Form title cannot exceed 300 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [2000, "Form description cannot exceed 2000 characters"],
      default: "",
    },
    design: {
      type: designSchema,
      default: () => ({}),
    },
    fields: {
      type: [fieldSchema],
      validate: [
        {
          validator: function (val) {
            return Array.isArray(val) && val.length > 0;
          },
          message: "A form must have at least one field",
        },
        {
          validator: function (val) {
            return Array.isArray(val) && val.length <= MAX_FIELDS;
          },
          message: `A form cannot have more than ${MAX_FIELDS} fields`,
        },
        {
          validator: function (val) {
            // Ensure labels are unique (case-insensitive) to prevent answer collisions
            if (!Array.isArray(val)) return true;
            const labels = val.map((f) => f.label.trim().toLowerCase());
            return new Set(labels).size === labels.length;
          },
          message: "Field labels must be unique within a form",
        },
      ],
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: true },
    strict: true,
  },
);

module.exports = mongoose.model("Form", formSchema);
