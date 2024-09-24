import mongoose from "mongoose";

/**
 * Checks if a given string is a valid MongoDB ObjectId.
 * @param id - The string to validate as an ObjectId.
 * @returns True if valid, otherwise false.
 */
export const isValidObjectId = (id: string): boolean => {
  return mongoose.Types.ObjectId.isValid(id);
};