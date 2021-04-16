const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    job_id:{
      type:String,
      required: true
    },

    recruiter_id:{
      type: String,
      required: true
    },

    title: {
      type: String,
      trim: true,
      required: true,
    },

    type: {
      type: String,
      required: true,
    },

    company:{
        type: String,
        required: true,
    },

    location: {
        type: String,
        required:true
    },

    vacancies: {
        type: Number,
        required: true,
    },

    status: {
        type: String,
        default: "open",
        required:true
    },

    content: {
      type: String,
      required: true,
    },

  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Jobs", jobSchema);