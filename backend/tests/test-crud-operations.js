const chai = require("chai");
const chaiHttp = require("chai-http");

chai.use(chaiHttp);
chai.should();

describe("Songs", () => {
  describe("GET /crud-operations/songs", () => {
    it("should get all songs", (done) => {
      chai
        .request("http://localhost:3000")
        .get("/crud-operations/songs")
        .end((err, res) => {
          if (err) {
            console.error(err);
            return done(err);
          }
          console.log(res.body);
          res.should.have.status(200);
          res.body.should.be.a("array");
          done();
        });
    });
  });

  describe("GET /crud-operations/:id", () => {
    it("should get a song by id", (done) => {
      const id = 1;
      chai
        .request("http://localhost:3000")
        .get(`/crud-operations/${id}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          done();
        });
    });

    it("should not get a song by id", (done) => {
      const id = 9999;
      chai
        .request("http://localhost:3000")
        .get(`/crud-operations/${id}`)
        .end((err, res) => {
          res.should.have.status(404);
          done();
        });
    });
  });
});
