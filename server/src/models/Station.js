import mongoose from "mongoose";

const isValidGeoPoint = (value) => {
  if (!Array.isArray(value) || value.length !== 2) {
    return false;
  }

  const [lng, lat] = value;

  if (typeof lng !== "number" || typeof lat !== "number") {
    return false;
  }

  if (Number.isNaN(lng) || Number.isNaN(lat)) {
    return false;
  }

  return lng >= -180 && lng <= 180 && lat >= -90 && lat <= 90;
};

const stationSchema = new mongoose.Schema(
  {
    stationName: {
      type: String,
      required: true,
      trim: true
    },
    locationName: {
      type: String,
      default: "",
      trim: true
    },
    address: {
      type: String,
      required: true,
      trim: true
    },
    city: {
      type: String,
      required: true,
      trim: true
    },
    state: {
      type: String,
      required: true,
      trim: true
    },
    coordinates: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
        required: true
      },
      coordinates: {
        type: [Number],
        required: true,
        validate: {
          validator: isValidGeoPoint,
          message: "Coordinates must be in [lng, lat] format."
        }
      }
    },
    chargerTypes: {
      type: [String],
      required: true,
      default: []
    },
    status: {
      type: String,
      enum: ["Available", "Busy", "Offline"],
      default: "Available"
    },
    availability: {
      type: String,
      enum: ["Available", "Busy", "Offline"],
      default: "Available"
    },
    pricing: {
      type: Number,
      required: true,
      min: 0
    },
    operatingHours: {
      type: String,
      required: true
    },
    facilities: {
      type: [String],
      default: []
    }
  },
  {
    timestamps: true,
    autoIndex: false
  }
);

stationSchema.index({
  stationName: "text",
  address: "text",
  city: "text",
  state: "text"
});
stationSchema.index({ coordinates: "2dsphere" });

const Station = mongoose.model("Station", stationSchema);

export default Station;
