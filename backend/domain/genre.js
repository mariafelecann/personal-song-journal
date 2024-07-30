class Genre {
  constructor(ngenreName, ndescription, npop, norigin, ngenreId) {
    this.genreName = ngenreName;
    this.genreDescription = ndescription;
    this.popularity = npop;
    this.genreOrigin = norigin;
    this.genreId = ngenreId;
  }
}

module.exports = Genre;
