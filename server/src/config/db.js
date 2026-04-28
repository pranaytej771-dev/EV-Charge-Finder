import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { seedCars } from "../data/seedCars.js";
import { seedStations } from "../data/seedStations.js";
import EVCar from "../models/EVCar.js";
import Station from "../models/Station.js";
import User from "../models/User.js";

export const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    throw new Error("MONGO_URI is missing in the server environment variables.");
  }

  await mongoose.connect(mongoUri);
  console.log("MongoDB connected");
  await migrateLegacyStationCoordinates();
  await Station.syncIndexes();
  await seedDefaultAdminIfMissing();
  await seedCarsIfEmpty();
  await seedStationsIfEmpty();
};

const seedDefaultAdminIfMissing = async () => {
  const adminExists = await User.exists({ role: "admin" });

  if (adminExists) {
    return;
  }

  const adminEmail = "admin@example.com";
  const adminPassword = "admin123";
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  const existingUser = await User.findOne({ email: adminEmail });

  if (existingUser) {
    existingUser.role = "admin";
    existingUser.password = hashedPassword;
    await existingUser.save();
    console.log("Existing user promoted to default admin account");
    return;
  }

  await User.create({
    name: "System Admin",
    email: adminEmail,
    password: hashedPassword,
    role: "admin"
  });

  console.log("Default admin account seeded (admin@example.com)");
};

const seedStationsIfEmpty = async () => {
  const stationCount = await Station.countDocuments();

  if (stationCount === 0) {
    await Station.insertMany(seedStations);
    console.log("Sample stations inserted");
  }
};

const seedCarsIfEmpty = async () => {
  const carCount = await EVCar.countDocuments();

  if (carCount === 0) {
    await EVCar.insertMany(seedCars);
    console.log("Sample EV cars inserted");
  }
};

const migrateLegacyStationCoordinates = async () => {
  const legacyStations = await Station.collection.find({
    "coordinates.lat": { $exists: true },
    "coordinates.lng": { $exists: true }
  })
    .project({ _id: 1, coordinates: 1 })
    .toArray();

  if (legacyStations.length === 0) {
    return;
  }

  const updates = legacyStations
    .map((station) => {
      const lat = Number(station.coordinates?.lat);
      const lng = Number(station.coordinates?.lng);

      if (
        Number.isNaN(lat) ||
        Number.isNaN(lng) ||
        lat < -90 ||
        lat > 90 ||
        lng < -180 ||
        lng > 180
      ) {
        return null;
      }

      return {
        updateOne: {
          filter: { _id: station._id },
          update: {
            $set: {
              coordinates: {
                type: "Point",
                coordinates: [lng, lat]
              }
            }
          }
        }
      };
    })
    .filter(Boolean);

  if (updates.length === 0) {
    return;
  }

  await Station.collection.bulkWrite(updates);
  console.log(`Migrated ${updates.length} legacy station coordinates to GeoJSON`);
};
