const express = require("express");
const { SongRepository } = require("../repository/song_repository.js");

const router = express.Router();
module.exports = async function () {
  router.get("/", async (req, res) => {
    try {
      const songRepository = new SongRepository();
      await songRepository.initializeDatabase();
      const songs = await songRepository.getAllSongs();

      const searchText = req.query.searchText;
      const sortDirection = req.query.sortDirection;
      const pageNumber = parseInt(req.query.pageNumber) || 1;
      const pageSize = parseInt(req.query.pageSize) || 10;
      const skip = (pageNumber - 1) * pageSize;

      let filteredSongs = songs;
      if (searchText) {
        filteredSongs = songs.filter(
          (song) =>
            song.title.toLowerCase().includes(searchText.toLowerCase()) ||
            song.artist.toLowerCase().includes(searchText.toLowerCase())
        );
      }

      if (sortDirection) {
        const sortField = sortDirection.split(":")[0];
        const sortOrder = sortDirection.split(":")[1] === "desc" ? -1 : 1;
        filteredSongs.sort((a, b) => {
          if (a[sortField] < b[sortField]) return -1 * sortOrder;
          if (a[sortField] > b[sortField]) return 1 * sortOrder;
          return 0;
        });
      }

      const paginatedSongs = filteredSongs.slice(skip, skip + pageSize);

      res.send({
        pageNumber,
        pageSize,
        totalSongs: filteredSongs.length,
        songs: paginatedSongs,
      });
    } catch (error) {
      console.error("Error fetching songs:", error);
      res.status(500).send("Internal Server Error");
    }
  });
  return router;
};
