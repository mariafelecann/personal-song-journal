const http = require("http");
const WebSocket = require("ws");
const { GenreRepository } = require("./repository/genre_repository");
const SongRepository = require("./repository/song_repository").SongRepository;

const port = 4000;

const server = http.createServer();
const wss = new WebSocket.Server({ server });

const songRepository = new SongRepository();

wss.on("connection", (ws) => {
  console.log("new websocket client connected");

  ws.on("close", () => {
    console.log("websocket client disconnected");
  });
});

setInterval(async () => {
  try {
    const new_songs = await songRepository.generateSongs();
    if (Array.isArray(new_songs)) {
      for (const song of new_songs) {
        await songRepository.add(song);
      }

      const songs = await songRepository.getAllSongs();

      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(songs));
        }
      });
    } else {
      console.error("Generated songs is not an array:", new_songs);
    }
  } catch (error) {
    console.error("Error processing new songs:", error);
  }
}, 20000);
