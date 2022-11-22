//importing
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import userScema from "./modal.js";
import { Server } from "socket.io";
import roomSchema from "./roomModal.js";
//cpu os
import os from "node-os-utils";
const cpu = os.cpu;
const netstat = os.netstat;

// cpu info
const getCpuCurrentUsage = async () => {
  let count = cpu.count();
  let usage = await cpu.usage();
  let freeMemory = await cpu.free();
  // console.log(usage, count, freeMemory);
  let data = {
    cpuCount: count,
    useagePercentage: usage,
    freeMemory: freeMemory,
  };
  return data;
};

getCpuCurrentUsage();

//app config
const app = express();
const port = process.env.PORT || 9000;

//middelwhere

app.use(express.json());
app.use(cors());

//db config
const url =
  "mongodb+srv://red:red123@cluster0.kx1wi.mongodb.net/?retryWrites=true&w=majority";

mongoose.connect(url);

const db = mongoose.connection;
db.once("open", () => {
  console.log("db is connected");
});

//api routes
app.get("/test", (req, res) => res.status(200).send("hello world"));
app.post("/newUser", async (req, res) => {
  try {
    let user = req.body;
    console.log(user);
    let data = await userScema.create(user);
    if (data) {
      res.status(200).send(data);
    } else {
      res.status(500).send({ message: "server error" });
    }
  } catch (error) {
    console.log(error);
  }
});

//listen
let server = app.listen(port, () => console.log("server running on " + port));

//sockets
const io = new Server(server, {
  cors: {
    origin: process.env.NODE_ENV === "production" ? "" : port,
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("Connection to socket");
  socket.join(socket.id);
  socket.on("add-to-room", async ({ userId, message }) => {
    let messge = {
      user: userId,
      message: message,
    };
    let room = await roomSchema.find();
    if (room.length > 0) {
      // update existing room

      let update = await roomSchema.updateOne(
        { id: "1" },
        { $push: { messages: messge } }
      );

      console.log(update, "TEXT ADDED with new user");
    } else {
      // new room
      let first = [messge];
      let newRoom = await roomSchema.create({
        messages: first,
        user: [userId],
        id: "1",
      });

      console.log(newRoom, "NEW room created");
    }
    let roomupdated = await roomSchema.findOne({ id: "1" });

    socket.emit("chat", roomupdated);
  });

  socket.on("sendChat", async () => {
    let roomupdated = await roomSchema.findOne({ id: "1" });
    socket.emit("getChat", roomupdated);
  });

  // cpu sockets

  socket.on("getCpuUsage", async () => {
    let usage = await getCpuCurrentUsage();
    socket.emit("usage", usage);
  });
});
