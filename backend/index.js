import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

import cors from "cors";
import dbConnect from "./config/db.js";
import authRoutes from "./routes/AuthRoutes.js";
import contactsRoutes from "./routes/ContactsRoutes.js";
import socketSetUp from "./socket.js";
import messagesRoutes from "./routes/MessagesRoute.js";
import channelRoutes from "./routes/ChannelRoutes.js";

dotenv.config();
dbConnect()

const app = express();
const port = process.env.PORT || 3001;

app.use(
  cors({
    origin: [process.env.ORIGIN || "http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true, //for cookies
  })
);
app.use("/uploads/profiles", express.static("uploads/profiles"));
app.use("/uploads/files", express.static("uploads/files"));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/contacts", contactsRoutes);
app.use("/api/messages", messagesRoutes);
app.use("/api/channels", channelRoutes);

const server = app.listen(port, () =>
  console.log(`Server running on port: ${port}`)
);

socketSetUp(server);
