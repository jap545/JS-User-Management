// naming convention: singular for model names, plural for router names
// this file contains a schema definition object that will be mapped to a mongodb document
// using mongoose

// Import mongoose
const mongoose = require("mongoose");
// Create a schema definition object using mapping notation
const schemaDefinitionObj = {
    // how does the data look like?
    name: {
        type: String,
        required: true
      },
      tel: {
        type: String,
        required: true
      },
      email: {
        type: String,
        required: true
      },
      details: {
        type: String,
        required: true
      },
      createdAt: {
        type: Date,
        default: Date.now()
      },
      updatedAt: {
        type: Date,
        default: Date.now()
      },
}
// Create a new mongoose schema
const mongooseSchema = new mongoose.Schema(schemaDefinitionObj);
// Create and export a new mongoose model
module.exports = mongoose.model("Customer", mongooseSchema);