const express = require("express");
const router = express.Router();
const SongRepository =
  require("../repository/song_repository.js").SongRepository;
const GenreRepository =
  require("../repository/genre_repository.js").GenreRepository;
const Song = require("../domain/song.js");
const Genre = require("../domain/genre.js");
module.exports = async function () {
  const songRepository = new SongRepository();
  await songRepository.initializeDatabase();
  const genreRepository = new GenreRepository();
  await genreRepository.initializeDatabase();

  router.get("/", (req, res) => {
    res.send("crud operations page");
  });

  router.get("/songs", async (req, res) => {
    try {
      const songs = await songRepository.getAllSongs();
      const songsWithStringsIds = songs.map((song) => ({
        ...song,
        _id: song._id.toString(),
      }));

      res.status(200).json(songsWithStringsIds);
    } catch (error) {
      console.error("Error fetching songs:", error);
      res.status(500).send("Internal Server Error");
    }
  });

  router.get("/genres", async (req, res) => {
    try {
      const genres = await genreRepository.getAllGenres();
      const genresWithStringIds = genres.map((genre) => ({
        ...genre,
        _id: genre._id.toString(),
      }));

      res.status(200).json(genresWithStringIds);
    } catch (error) {
      console.error("Error fetching genres:", error);
      res.status(500).send("Internal Server Error");
    }
  });
  router.get("/genres/name/:genreId", async (req, res) => {
    try {
      const genreId = req.params.genreId;

      const genreName = await genreRepository.getGenreNameById(genreId);
      if (genreName) {
        res.status(200).json({ genreName });
      } else {
        res.status(404).send("Genre not found");
      }
    } catch (error) {
      console.error("Error fetching genre name:", error);
      res.status(500).send("Internal Server Error");
    }
  });

  router.get("/:songId", async (req, res) => {
    try {
      const song = await songRepository.findById(req.params.songId);
      if (!song) return res.status(404).send("Song not found");
      res.send(song);
    } catch (error) {
      console.error("Error fetching song:", error);
      res.status(500).send("Internal Server Error");
    }
  });

  router.put("/:songId", async (req, res) => {
    const updatedSong = new Song(
      req.params.songId,
      req.body.songName,
      req.body.artistName,
      req.body.rating,
      req.body.review,
      req.body.genreId
    );
    try {
      await songRepository.update(req.params.songId, updatedSong);
      res.send(updatedSong);
    } catch (error) {
      console.error("Error updating song:", error);
      res.status(500).send("Internal Server Error");
    }
  });

  router.delete("/:songId", async (req, res) => {
    try {
      const song = await songRepository.findById(req.params.songId);
      if (!song) {
        return res.status(404).send("Song not found");
      }
      await songRepository.delete(req.params.songId);
      console.log("deleted song");
      const songs = await songRepository.getAllSongs();
      res.json(songs);
    } catch (error) {
      console.error("Error deleting song:", error);
      res.status(500).send("Internal Server Error");
    }
  });

  router.post("/", async (req, res) => {
    console.log("trying to add song");
    const song = new Song(
      Date.now().toString(),
      req.body.songName,
      req.body.artistName,
      req.body.rating,
      req.body.review,
      req.body.genreId
    );
    try {
      await songRepository.add(song);
      res.send(song);
    } catch (error) {
      console.error("Error adding song:", error);
      res.status(500).send("Internal Server Error");
    }
  });

  router.get("/genres/:genreId", async (req, res) => {
    try {
      const genre = await genreRepository.findById(req.params.genreId);
      if (!genre) return res.status(404).send("Genre not found");
      res.send(genre);
    } catch (error) {
      console.error("Error fetching genre:", error);
      res.status(500).send("Internal Server Error");
    }
  });

  router.put("/genres/:genreId", async (req, res) => {
    const updatedGenre = new Genre(
      req.body.genreName,
      req.body.genreDescription,
      req.body.popularity,
      req.body.genreOrigin,
      req.body.genreId
    );
    try {
      await genreRepository.update(req.params.genreId, updatedGenre);
      res.send(updatedGenre);
    } catch (error) {
      console.error("Error updating genre:", error);
      res.status(500).send("Internal Server Error");
    }
  });

  router.delete("/genres/:genreId", async (req, res) => {
    try {
      const genre = await genreRepository.findById(req.params.genreId);
      if (!genre) {
        return res.status(404).send("Genre not found");
      }
      await genreRepository.delete(req.params.genreId);
      console.log("deleted genre");
      const genres = await genreRepository.getAllGenres();
      res.json(genres);
    } catch (error) {
      console.error("Error deleting genre:", error);
      res.status(500).send("Internal Server Error");
    }
  });

  router.post("/genres/", async (req, res) => {
    console.log("trying to add genre");
    console.log(req.params.genreName);
    const genre = new Genre(
      req.body.genreName,
      req.body.genreDescription,
      req.body.popularity,
      req.body.genreOrigin,
      new Date().toJSON().toString()
    );
    try {
      await genreRepository.add(genre);
      res.send(genre);
    } catch (error) {
      console.error("Error adding genre:", error);
      res.status(500).send("Internal Server Error");
    }
  });

  return router;
};
