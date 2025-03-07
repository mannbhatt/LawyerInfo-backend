const mongoose = require("mongoose");

const InstitutionSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, // Institution name
});

module.exports = mongoose.model("institution", InstitutionSchema);
