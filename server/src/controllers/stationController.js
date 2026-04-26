import mongoose from "mongoose";
import Station from "../models/Station.js";

const DEFAULT_MAX_DISTANCE_METERS = 10000;
const DEFAULT_NEAREST_LIMIT = 5;

const isObjectIdValid = (id) => mongoose.Types.ObjectId.isValid(id);
const toRadians = (value) => (value * Math.PI) / 180;

const getDistanceInKm = (start, end) => {
  const earthRadiusKm = 6371;
  const latDistance = toRadians(end.lat - start.lat);
  const lngDistance = toRadians(end.lng - start.lng);
  const lat1 = toRadians(start.lat);
  const lat2 = toRadians(end.lat);

  const a =
    Math.sin(latDistance / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(lngDistance / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earthRadiusKm * c;
};

const getCoordinatesFromPayload = (coordinatesInput) => {
  if (!coordinatesInput || typeof coordinatesInput !== "object") {
    return { lat: Number.NaN, lng: Number.NaN };
  }

  if (
    Array.isArray(coordinatesInput.coordinates) &&
    coordinatesInput.coordinates.length === 2
  ) {
    return {
      lng: Number(coordinatesInput.coordinates[0]),
      lat: Number(coordinatesInput.coordinates[1])
    };
  }

  return {
    lat: Number(coordinatesInput.lat),
    lng: Number(coordinatesInput.lng)
  };
};

const getLatLngFromStation = (coordinatesInput) => {
  if (!coordinatesInput) {
    return null;
  }

  if (
    Array.isArray(coordinatesInput.coordinates) &&
    coordinatesInput.coordinates.length === 2
  ) {
    return {
      lng: Number(coordinatesInput.coordinates[0]),
      lat: Number(coordinatesInput.coordinates[1])
    };
  }

  if (
    typeof coordinatesInput.lat === "number" &&
    typeof coordinatesInput.lng === "number"
  ) {
    return {
      lat: coordinatesInput.lat,
      lng: coordinatesInput.lng
    };
  }

  return null;
};

const isValidLatLng = ({ lat, lng }) => {
  if (typeof lat !== "number" || typeof lng !== "number") {
    return false;
  }

  if (Number.isNaN(lat) || Number.isNaN(lng)) {
    return false;
  }

  return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
};

const mapStationForResponse = (station, searchPoint) => {
  const resolvedCoordinates = getLatLngFromStation(station.coordinates);
  const normalizedCoordinates = resolvedCoordinates || { lat: 0, lng: 0 };

  const mappedStation = {
    ...station,
    coordinates: normalizedCoordinates,
    locationName:
      station.locationName ||
      [station.address, station.city].filter(Boolean).join(", "),
    status: station.status || station.availability || "Available"
  };

  if (searchPoint && resolvedCoordinates) {
    mappedStation.distanceKm = Number(
      getDistanceInKm(searchPoint, normalizedCoordinates).toFixed(2)
    );
  }

  return mappedStation;
};

const isStationPayloadValid = (payload) => {
  const resolvedCoordinates = getLatLngFromStation(payload.coordinates);

  return (
    payload.stationName &&
    payload.address &&
    payload.city &&
    payload.state &&
    resolvedCoordinates &&
    isValidLatLng(resolvedCoordinates) &&
    Array.isArray(payload.chargerTypes) &&
    payload.chargerTypes.length > 0 &&
    payload.pricing !== undefined &&
    typeof payload.pricing === "number" &&
    !Number.isNaN(payload.pricing) &&
    payload.operatingHours
  );
};

const buildStationPayload = (requestBody) => {
  const stationStatus = requestBody.status || requestBody.availability || "Available";
  const coordinates = getCoordinatesFromPayload(requestBody.coordinates);

  return {
    stationName: requestBody.stationName?.trim(),
    locationName: requestBody.locationName?.trim() || "",
    address: requestBody.address?.trim(),
    city: requestBody.city?.trim(),
    state: requestBody.state?.trim(),
    coordinates: {
      type: "Point",
      coordinates: [coordinates.lng, coordinates.lat]
    },
    chargerTypes: requestBody.chargerTypes,
    status: stationStatus,
    availability: stationStatus,
    pricing: Number(requestBody.pricing),
    operatingHours: requestBody.operatingHours?.trim(),
    facilities: Array.isArray(requestBody.facilities) ? requestBody.facilities : []
  };
};

export const getStations = async (request, response, next) => {
  try {
    const { search = "", chargerType = "" } = request.query;
    const filters = {};

    if (search.trim()) {
      const searchRegex = new RegExp(search.trim(), "i");
      filters.$or = [
        { stationName: searchRegex },
        { city: searchRegex },
        { address: searchRegex },
        { state: searchRegex }
      ];
    }

    if (chargerType.trim()) {
      filters.chargerTypes = { $in: [chargerType.trim()] };
    }

    const stations = await Station.find(filters).sort({ createdAt: -1 }).lean();

    response.json({
      total: stations.length,
      stations: stations.map((station) => mapStationForResponse(station))
    });
  } catch (error) {
    next(error);
  }
};

export const createStation = async (request, response, next) => {
  try {
    const payload = buildStationPayload(request.body);

    if (!isStationPayloadValid(payload)) {
      return response.status(400).json({
        message: "Please fill all required station details correctly."
      });
    }

    const station = await Station.create(payload);
    const mappedStation = mapStationForResponse(station.toObject());

    response.status(201).json({
      message: "Charging station added successfully.",
      station: mappedStation
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return response.status(400).json({
        message: error.message
      });
    }

    next(error);
  }
};

export const searchNearestStations = async (request, response, next) => {
  try {
    const { lat, lng, maxDistance = DEFAULT_MAX_DISTANCE_METERS } = request.query;

    if (!lat || !lng) {
      return response.status(400).json({
        message: "lat and lng are required query parameters."
      });
    }

    const latitude = Number(lat);
    const longitude = Number(lng);

    if (!isValidLatLng({ lat: latitude, lng: longitude })) {
      return response.status(400).json({
        message: "lat and lng must be valid coordinates."
      });
    }

    const distanceValue = Number(maxDistance);
    const maxDistanceMeters =
      Number.isNaN(distanceValue) || distanceValue <= 0
        ? DEFAULT_MAX_DISTANCE_METERS
        : distanceValue;

    const searchPoint = { lat: latitude, lng: longitude };

    const stations = await Station.find({
      coordinates: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [longitude, latitude]
          },
          $maxDistance: maxDistanceMeters
        }
      }
    })
      .limit(DEFAULT_NEAREST_LIMIT)
      .lean();

    const nearestStations = stations.map((station) =>
      mapStationForResponse(station, searchPoint)
    );

    response.json({
      total: nearestStations.length,
      maxDistanceMeters,
      stations: nearestStations
    });
  } catch (error) {
    next(error);
  }
};

export const updateStation = async (request, response, next) => {
  try {
    const { id } = request.params;

    if (!isObjectIdValid(id)) {
      return response.status(400).json({
        message: "Invalid station id."
      });
    }

    const payload = buildStationPayload(request.body);

    if (!isStationPayloadValid(payload)) {
      return response.status(400).json({
        message: "Please fill all required station details correctly."
      });
    }

    const station = await Station.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true
    });

    if (!station) {
      return response.status(404).json({
        message: "Charging station not found."
      });
    }

    response.json({
      message: "Charging station updated successfully.",
      station: mapStationForResponse(station.toObject())
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return response.status(400).json({
        message: error.message
      });
    }

    next(error);
  }
};

export const deleteStation = async (request, response, next) => {
  try {
    const { id } = request.params;

    if (!isObjectIdValid(id)) {
      return response.status(400).json({
        message: "Invalid station id."
      });
    }

    const station = await Station.findByIdAndDelete(id).lean();

    if (!station) {
      return response.status(404).json({
        message: "Charging station not found."
      });
    }

    response.json({
      message: "Charging station deleted successfully.",
      station: mapStationForResponse(station)
    });
  } catch (error) {
    next(error);
  }
};
