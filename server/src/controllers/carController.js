import mongoose from "mongoose";
import EVCar from "../models/EVCar.js";

const isObjectIdValid = (id) => mongoose.Types.ObjectId.isValid(id);

export const getCars = async (_request, response, next) => {
  try {
    const cars = await EVCar.find().sort({ brand: 1, name: 1 });

    response.json({
      total: cars.length,
      cars
    });
  } catch (error) {
    next(error);
  }
};

export const getCarById = async (request, response, next) => {
  try {
    const { id } = request.params;

    if (!isObjectIdValid(id)) {
      return response.status(400).json({
        message: "Invalid car id."
      });
    }

    const car = await EVCar.findById(id);

    if (!car) {
      return response.status(404).json({
        message: "EV car not found."
      });
    }

    response.json({ car });
  } catch (error) {
    next(error);
  }
};
