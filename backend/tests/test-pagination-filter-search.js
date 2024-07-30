const chai = require("chai");
const chaiHttp = require("chai-http");

chai.use(chaiHttp);
chai.should();

describe("Songs", () => {
  describe("GET /filter", () => {
    it("should support pagination", (done) => {
      chai
        .request("http://localhost:3000")
        .get("/filter?pageNumber=2&pageSize=2")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("songs");
          res.body.songs.should.be.a("array");
          done();
        });
    });

    it("should support sorting", (done) => {
      chai
        .request("http://localhost:3000")
        .get("/filter?sortDirection=title:asc")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("songs");
          res.body.songs.should.be.a("array");
          done();
        });
    });

    it("should support searching", (done) => {
      chai
        .request("http://localhost:3000")
        .get("/filter?searchText=Our")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("songs");
          res.body.songs.should.be.a("array");
          res.body.songs.length.should.be.above(0);
          done();
        });
    });
  });
});
