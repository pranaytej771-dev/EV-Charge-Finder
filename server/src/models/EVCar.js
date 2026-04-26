import mongoose from "mongoose";

const evCarSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    brand: {
      type: String,
      required: true,
      trim: true
    },
    batteryCapacity: {
      type: Number,
      required: true,
      min: 1
    },
    range: {
      type: Number,
      required: true,
      min: 1
    },
    connectorTypes: {
      type: [String],
      required: true,
      default: []
    },
    imageUrl: {
      type: String,
      default: ""
    }
  },
  {
    timestamps: true
  }
);

const EVCar = mongoose.model("EVCar", evCarSchema);

export default EVCar;
