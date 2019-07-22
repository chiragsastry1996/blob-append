const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const lightSchema = new Schema({
  light: {
    required: true,
    type: String,
  }
});

const Light = mongoose.model("Light", lightSchema);
module.exports = Light;