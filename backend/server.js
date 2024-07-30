const SongRepository =
  require("./repository/song_repository.js").SongRepository;
const express = require("express");

const app = express();

const port = 3000;
const cors = require("cors");
app.use(cors());

app.use(express.json());

(async () => {
  try {
    const songRepository = new SongRepository();
    await songRepository.initializeDatabase();

    app.get("/health-check", (req, res) => {
      const healthCheckResponse = {
        status: "success",
        message: "Server is up and running",
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
      };

      res.status(200).json(healthCheckResponse);
    });

    const crudOperationsRouter = await require("./routes/crud_operations")();
    app.use("/crud-operations", crudOperationsRouter);
    const loginRegisterRouter =
      await require("./routes/user-register-login.js");
    app.use("/welcome", loginRegisterRouter);
    app.get("/", (req, res) => {
      res.send("Welcome to your music journal!");
    });

    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.log(error);
  }
})();
