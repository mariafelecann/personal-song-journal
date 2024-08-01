const { MongoClient, ObjectId } = require("mongodb");
const Song = require("../domain/song.js");
const { fakerEN, faker } = require("@faker-js/faker");
const { GenreRepository } = require("./genre_repository.js");

class SongRepository {
  constructor() {
    this.uri = process.env.MONGO_URI;
    this.client = new MongoClient(this.uri, {});
    this.collection = null;
    this.existingIds = null;
    this.initializeDatabase();
  }

  async initializeDatabase() {
    try {
      const genreRepo = new GenreRepository();
      await genreRepo.initializeDatabase();
      await this.client.connect();
      console.log("Connected to Song Database");
      const database = this.client.db("SongJournalDataBase");
      this.collection = database.collection("songs");
      this.existingIds = await genreRepo.getAllGenreIds();
      console.log("Fetched genre IDs:", this.existingIds);
    } catch (error) {
      console.error("Error connecting to MongoDB:", error);
    }
  }

  async closeConnection() {
    try {
      await this.client.close();
      console.log("Disconnected from MongoDB");
    } catch (error) {
      console.error("Error closing connection to MongoDB:", error);
    }
  }

  async generateSongs() {
    const songs = [];
    for (let i = 0; i < 10; i++) {
      let genreId =
        this.existingIds[Math.floor(Math.random() * this.existingIds.length)];
      const song = new Song(
        faker.string.uuid(),
        fakerEN.music.songName(),
        fakerEN.person.fullName(),
        faker.number.int({ min: 1, max: 10 }),
        fakerEN.lorem.sentence(),
        genreId
        // fakerEN.music.genre()
      );

      songs.push(song);
    }
    return songs;
  }

  async add(newSong) {
    try {
      const result = await this.collection.insertOne(newSong);
      return result.insertedId;
    } catch (error) {
      newSong._id = new ObjectId();
      return await this.add(newSong);
      console.error("Error adding song:", error);
    }
  }

  async getAllSongs() {
    try {
      console.log(" getting songs");
      return await this.collection.find().toArray();
    } catch (error) {
      console.log(" getting songs");
      console.error("Error getting all songs:", error);
      return [];
    }
  }

  // async findById(songId) {
  //   try {
  //     return await this.collection.findOne({ _id: ObjectId(songId) });
  //   } catch (error) {
  //     console.error("Error finding song by ID:", error);
  //     return null;
  //   }
  // }

  async findById(searchedId) {
    try {
      return await this.collection.findOne({ songId: searchedId });
    } catch (error) {
      console.error("Error finding song by songId:", error);
      return null;
    }
  }

  async delete(searchedId) {
    try {
      const result = await this.collection.deleteOne({ songId: searchedId });
      console.log(result.deletedCount);
      return result.deletedCount > 0;
    } catch (error) {
      console.error("Error deleting song:", error);
      return false;
    }
  }

  // async update(searchedId, updatedSong) {
  //   try {
  //     const result = await this.collection.updateOne(
  //       { songId: searchedId },
  //       //{ _id: new ObjectId() },
  //       { $set: updatedSong }
  //     );
  //     return result.modifiedCount > 0;
  //   } catch (error) {
  //     console.error("Error updating song:", error);
  //     return false;
  //   }
  // }
  async update(searchedId, updatedSong) {
    try {
      const filter = { songId: updatedSong.songId };
      console.log("updating");
      console.log(filter);
      const newSong = {
        songId: updatedSong.songId,
        songName: updatedSong.songName,
        artistName: updatedSong.artistName,
        rating: updatedSong.rating,
        review: updatedSong.review,
        genreId: updatedSong.genreId,
      };

      const result = await this.collection.replaceOne(filter, newSong);
      //console.log("newSongUpdated result:", result);

      if (result.matchedCount === 1) {
        return "song updated successfully";
      }
    } catch (error) {
      console.error("Error updating song:", error);
      return false;
    }
  }

  async getSongsForGenre(genreName) {
    try {
      const songs = await this.collection
        .find({ genreName: genreName })
        .toArray();
      return songs.map((song) => ({
        ...song,
        _id: song._id.toString(),
      }));
    } catch (error) {
      console.error("Error fetching songs for genre:", error);
    }
  }
}

module.exports.SongRepository = SongRepository;
