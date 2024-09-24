import express from "express";
import {
  registerClient,
  getClient,
  updateClient,
  deleteClient,
} from "../controllers/clientController";
import zodValidator from "../middlewares/zodValidator";
import { registerClientSchema, updateClientSchema } from "../schemas/clients";

const router = express.Router();

router.post("/clients", zodValidator(registerClientSchema), registerClient);
router.get("/clients/:id", getClient);
router.put("/clients/:id",zodValidator(updateClientSchema), updateClient);
router.delete("/clients/:id", deleteClient);

export default router;
