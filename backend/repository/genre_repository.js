const { MongoClient, ObjectId } = require("mongodb");
const Song = require("../domain/song.js");
const { fakerEN, faker } = require("@faker-js/faker");
const Genre = require("../domain/genre.js");
class GenreRepository {
  constructor() {
    this.uri =
    process.env.MONGO_URI;
    this.client = new MongoClient(this.uri, {});
    this.collection = null;
    this.initializeDatabase();
  }

  async initializeDatabase() {
    try {
      await this.client.connect();
      console.log("Connected to Genres Database");
      const database = this.client.db("SongJournalDataBase");
      this.collection = database.collection("genres");
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

  async generateGenres() {
    const genres = [];
    for (let i = 0; i < 10; i++) {
      const genre = new Genre(
        fakerEN.music.genre(),
        fakerEN.lorem.sentence(),
        faker.number.int({ min: 1, max: 10 }),
        fakerEN.location.country(),
        faker.string.uuid()
      );
      genres.push(genre);
    }
    return genres;
  }

  async add(newGenre) {
    try {
      const result = await this.collection.insertOne(newGenre);
      return result.insertedId;
    } catch (error) {
      newGenre._id = new ObjectId();
      return await this.add(newGenre);
      console.error("Error adding genre:", error);
    }
  }

  async getAllGenres() {
    try {
      return await this.collection.find().toArray();
    } catch (error) {
      console.error("Error getting all genres:", error);
      return [];
    }
  }

  async getAllGenreIds() {
    try {
      const genres = await this.collection.find().toArray();

      const genreIds = genres.map((genre) => genre.genreId);
      return genreIds;
    } catch (error) {
      console.error("Error getting all genre IDs:", error);
      return [];
    }
  }

  async findById(searchedId) {
    try {
      return await this.collection.findOne({ genreId: searchedId });
    } catch (error) {
      console.error("Error finding song by genreId:", error);
      return null;
    }
  }

  async delete(searchedId) {
    try {
      const result = await this.collection.deleteOne({ genreId: searchedId });
      console.log(result.deletedCount);
      return result.deletedCount > 0;
    } catch (error) {
      console.error("Error deleting genre:", error);
      return false;
    }
  }

  async update(searchedId, updatedGenre) {
    try {
      const filter = { genreId: updatedGenre.genreId };

      const newGenre = {
        genreName: updatedGenre.genreName,
        genreDescription: updatedGenre.genreDescription,
        popularity: updatedGenre.popularity,
        genreOrigin: updatedGenre.genreOrigin,
        genreId: updatedGenre.genreId,
      };

      const result = await this.collection.replaceOne(filter, newGenre);

      if (result.matchedCount === 1) {
        return "genre updated successfully";
      }
    } catch (error) {
      console.error("Error updating genre:", error);
      return false;
    }
  }

  async getGenreNameById(searchedId) {
    try {
      const genre = await this.collection.findOne({ genreId: searchedId });
      if (genre) {
        return genre.genreName;
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error getting genre name by ID:", error);
      return null;
    }
  }
}

module.exports.GenreRepository = GenreRepository;
