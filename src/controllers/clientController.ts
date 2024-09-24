import { Request, Response } from "express";
import OAuthClient from "../models/OAuth/Client"; // Adjust the import as needed
import crypto from "crypto";
import { isValidObjectId } from "../utils/validationUtils";

/**
 * Registers a new client in the system by creating a new client entry in the database.
 *
 * @param {Request} req - The HTTP request object containing the validated client data in the request body.
 * @param {Response} res - The HTTP response object used to send back the response.
 * @returns {Promise<Response>} - A promise that resolves to the HTTP response object indicating the result of the registration.
 */
const registerClient = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    // Use the validated data from the middleware
    const updateData = req.validatedBody;

    // Generate a unique client ID and client secret using crypto
    const clientId = crypto.randomBytes(16).toString("hex");
    const clientSecret = crypto.randomBytes(32).toString("hex");

    // Create a new client document in the database
    const newClient = await OAuthClient.create({
      clientId,
      clientSecret,
      ...updateData,
    });

    // Respond with a success message and the created client data
    return res
      .status(201)
      .json({ message: "Client created successfully", client: newClient });
  } catch (error: any) {
    // Log the error for debugging purposes
    console.error("Error creating client:", error);

    // Respond with a 500 Internal Server Error and a descriptive message
    return res.status(500).json({
      error: "Failed to create client",
      details:
        error instanceof Error ? error.message : "An unexpected error occurred",
    });
  }
};

/**
 * Retrieves a client from the database based on the provided client ID.
 *
 * @param {Request} req - The HTTP request object containing the client ID in the parameters.
 * @param {Response} res - The HTTP response object used to send back the desired HTTP response.
 * @returns {Promise<Response>} - A promise that resolves to the HTTP response object containing the client data or an error message.
 */
const getClient = async (req: Request, res: Response): Promise<Response> => {
  try {
    // Extract the client ID from request parameters
    const { id } = req.params;

    // Validate the ObjectId format
    if (!isValidObjectId(id)) {
      return res.status(400).json({ error: "Invalid client ID" });
    }

    // Attempt to find the client in the database by client ID
    const client = await OAuthClient.findById(id);

    // If no client was found, return a 404 Not Found error
    if (!client) {
      return res.status(404).json({ error: "Client not found" });
    }

    // Respond with the client data
    return res.json(client);
  } catch (error: any) {
    // Log the error for debugging purposes
    console.error("Error retrieving client:", error);

    // Respond with a 500 Internal Server Error and a descriptive message
    return res.status(500).json({
      error: "Failed to retrieve client",
      details:
        error instanceof Error ? error.message : "An unexpected error occurred",
    });
  }
};

/**
 * Updates an existing client in the database based on the provided client ID.
 *
 * @param {Request} req - The HTTP request object containing the client ID in the parameters
 *                        and validated update data in the body.
 * @param {Response} res - The HTTP response object used to send back the desired HTTP response.
 * @returns {Promise<Response>} - A promise that resolves to the HTTP response object.
 */
const updateClient = async (req: Request, res: Response): Promise<Response> => {
  try {
    // Extract the client ID from request parameters
    const { id } = req.params;

    // Validate the ObjectId format
    if (!isValidObjectId(id)) {
      return res.status(400).json({ error: "Invalid client ID" });
    }

    // Use the validated data from the middleware
    const updateData = req.validatedBody;

    // Attempt to find and update the client in the database
    const updatedClient = await OAuthClient.findByIdAndUpdate(id, updateData, {
      new: true, // Return the updated document
      runValidators: true, // Ensure that validation rules are applied during update
    });

    // If no client was found, return a 404 Not Found error
    if (!updatedClient) {
      return res.status(404).json({ error: "Client not found" });
    }

    // Respond with the updated client data
    return res.json(updatedClient);
  } catch (error: any) {
    // Log the error for debugging purposes
    console.error("Error updating client:", error);

    // Respond with a 500 Internal Server Error and a descriptive message
    return res.status(500).json({
      error: "Failed to update client",
      details:
        error instanceof Error ? error.message : "An unexpected error occurred",
    });
  }
};

/**
 * Deletes a client from the database based on the provided client ID.
 *
 * @param {Request} req - The HTTP request object containing the client ID in the parameters.
 * @param {Response} res - The HTTP response object used to send back the desired HTTP response.
 * @returns {Promise<Response>} - A promise that resolves to the HTTP response object.
 */
const deleteClient = async (req: Request, res: Response): Promise<Response> => {
  try {
    // Extract the client ID from request parameters
    const { id } = req.params;

    // Validate the ObjectId format
    if (!isValidObjectId(id)) {
      return res.status(400).json({ error: "Invalid client ID" });
    }

    // Attempt to delete the client from the database
    const result = await OAuthClient.findByIdAndDelete(id);

    // If no client was found, return a 404 Not Found error
    if (!result) {
      return res.status(404).json({ error: "Client not found" });
    }

    // Respond with a success message indicating successful deletion
    return res.json({ message: "Client deleted successfully" });
  } catch (error: any) {
    // Log the error for debugging purposes
    console.error("Error deleting client:", error);

    // Respond with a 500 Internal Server Error and a descriptive message
    return res.status(500).json({
      error: "Failed to delete client",
      details:
        error instanceof Error ? error.message : "An unexpected error occurred",
    });
  }
};

export { registerClient, getClient, updateClient, deleteClient };
