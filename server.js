const express = require("express");
const app = express();
const server = require("http").Server(app); //creates server based on express to be used with socket.io
const io = require("socket.io")(server); //passes the server to socket.io
const { v4: uuidV4 } = require("uuid");

app.set("view engine", "ejs");
// you js and css in public folder
app.use(express.static("public"));
//set up a route in the home service with express
app.get("/", (req, res) => {
//If you create a new room on the home page
  res.redirect(`/${uuidV4()}`);//gives a unique id for the room
});
//creates a dynamic room
app.get("/:room", (req, res) => {
  res.render("room", { roomId: req.params.room });//it comes from the /:room
});

io.on("connection", (socket) => {
  //to listen if someone connected into the room
  socket.on("join-room", (roomId, userId) => {
    socket.join(roomId);
    socket.to(roomId).broadcast.emit("user-connected", userId);

    socket.on("disconnect", () => {
      socket.to(roomId).broadcast.emit("user-disconnected", userId);
    });
  });
});

server.listen(3000);
//socket.io does not communicate through the server
