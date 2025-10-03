const express = require("express");
const { createClient } = require("@supabase/supabase-js");
const http = require("http");
const { Server } = require("socket.io");
require("dotenv").config();

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

app.use(express.static("public"));

io.on("connection", (socket) => {
  console.log("⚡ Νέος χρήστης συνδέθηκε:", socket.id);

  socket.on("chat message", async (msg) => {
    console.log("📨 Μήνυμα:", msg);
    // Αποθήκευση στο Supabase
    await supabase.from("messages").insert([{ user: msg.user, text: msg.text, time: new Date() }]);
    io.emit("chat message", msg);
  });

  socket.on("disconnect", () => {
    console.log("❌ Αποσυνδέθηκε:", socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log("🚀 Server running on port " + PORT);
});
