const mongoose = require("mongoose");

const MAX_ANSWER_KEYS = 100;
const MAX_ANSWER_VALUE_LENGTH = 5000;

// Keys that could enable prototype pollution
const FORBIDDEN_KEYS = ["__proto__", "constructor", "prototype"];

function sanitizeAnswers(answers) {
  if (!answers || typeof answers !== "object") return answers;

  const sanitized = {};
  for (const key of Object.keys(answers)) {
    if (FORBIDDEN_KEYS.includes(key)) continue;

    const trimmedKey = key.trim();
    if (trimmedKey.length === 0 || trimmedKey.length > 200) continue;

    let value = answers[key];
    if (typeof value === "string") {
      value = value.trim();
    }
    sanitized[trimmedKey] = value;
  }
  return sanitized;
}

const responseSchema = new mongoose.Schema(
  {
    formId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Form",
      required: [true, "Form ID is required"],
      index: true,
    },
    answers: {
      type: mongoose.Schema.Types.Mixed,
      required: [true, "Answers are required"],
      validate: [
        {
          validator: function (val) {
            return (
              val !== null &&
              val !== undefined &&
              typeof val === "object" &&
              !Array.isArray(val)
            );
          },
          message: "Answers must be a valid object",
        },
        {
          validator: function (val) {
            if (!val || typeof val !== "object") return false;
            const keys = Object.keys(val);
            return keys.length > 0;
          },
          message: "Answers object must not be empty",
        },
        {
          validator: function (val) {
            if (!val || typeof val !== "object") return false;
            return Object.keys(val).length <= MAX_ANSWER_KEYS;
          },
          message: `Answers cannot have more than ${MAX_ANSWER_KEYS} fields`,
        },
        {
          validator: function (val) {
            if (!val || typeof val !== "object") return false;
            // Block prototype pollution keys
            return !Object.keys(val).some((k) => FORBIDDEN_KEYS.includes(k));
          },
          message: "Answers contain forbidden keys",
        },
        {
          validator: function (val) {
            if (!val || typeof val !== "object") return false;
            // Prevent oversized string values
            return Object.values(val).every((v) => {
              if (typeof v === "string")
                return v.length <= MAX_ANSWER_VALUE_LENGTH;
              if (Array.isArray(v)) {
                return v.every(
                  (item) =>
                    typeof item !== "string" ||
                    item.length <= MAX_ANSWER_VALUE_LENGTH,
                );
              }
              return true;
            });
          },
          message: `Answer values cannot exceed ${MAX_ANSWER_VALUE_LENGTH} characters`,
        },
      ],
      set: sanitizeAnswers,
    },
  },
  {
    timestamps: { createdAt: "submittedAt", updatedAt: false },
    strict: true,
  },
);

module.exports = mongoose.model("Response", responseSchema);
