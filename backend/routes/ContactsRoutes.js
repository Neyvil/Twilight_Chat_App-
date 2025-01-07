import { Router } from "express";
import {
  getAllContacts,
  getContactsForDMList,
  searchContacts,
} from "../controllers/ContactsController.js";
import verifyToken from "../middilewares/AuthMiddileware.js";

const contactsRoutes = Router();
contactsRoutes.post("/search", verifyToken, searchContacts);
contactsRoutes.get("/get-contact-for-DM", verifyToken, getContactsForDMList);
contactsRoutes.get("/get-all-contacts",verifyToken,getAllContacts)

export default contactsRoutes;
