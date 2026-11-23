const chai = require("chai")
const chaiHttp = require("chai-http")
const server = require("../app")

chai.use(chaiHttp)
chai.should()


describe("GET request to /api/items/:itemId/wears route", () => {
  it("it should respond with an array of wears when the id is real", done => {
    chai
      .request(server)
      .get("/api/items/item-1/wears")
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.be.a("array")
        done()
      })
  })

  it("it should respond with an error when the id is not real", done => {
    chai
      .request(server)
      .get("/api/items/not-a-real-item/wears")
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.have.property("error", "item not found")
        done()
      })
  })
})

describe("POST request to /api/items/:itemId/bulk-log route", () => {
  it("it should respond with the new estimate when the count is valid", done => {
    chai
      .request(server)
      .post("/api/items/item-3/bulk-log")
      .send({ count: "12" })
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.be.a("object")
        res.body.should.have.property("id")
        res.body.should.have.property("itemId", "item-3")
        res.body.should.have.property("type", "estimate")
        res.body.should.have.property("count", 12)
        done()
      })
  })

  it("it should show the estimate in the item's wears after it is saved", done => {
    chai
      .request(server)
      .post("/api/items/item-4/bulk-log")
      .send({ count: 7 })
      .end((err, res) => {
        chai
          .request(server)
          .get("/api/items/item-4/wears")
          .end((err, res) => {
            res.should.have.status(200)
            res.body.length.should.equal(1)
            res.body[0].should.have.property("count", 7)
            done()
          })
      })
  })

  it("it should respond with an error when the id is not real", done => {
    chai
      .request(server)
      .post("/api/items/not-a-real-item/bulk-log")
      .send({ count: 5 })
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.have.property("error", "item not found")
        done()
      })
  })

  it("it should respond with an error when the count is 0", done => {
    chai
      .request(server)
      .post("/api/items/item-3/bulk-log")
      .send({ count: 0 })
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.have.property("error", "estimated wears must be a positive whole number")
        done()
      })
  })

  it("it should respond with an error when the count is negative", done => {
    chai
      .request(server)
      .post("/api/items/item-3/bulk-log")
      .send({ count: -4 })
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.have.property("error", "estimated wears must be a positive whole number")
        done()
      })
  })

  it("it should respond with an error when the count is not a whole number", done => {
    chai
      .request(server)
      .post("/api/items/item-3/bulk-log")
      .send({ count: 2.5 })
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.have.property("error", "estimated wears must be a positive whole number")
        done()
      })
  })

  it("it should respond with an error when the count is not a number", done => {
    chai
      .request(server)
      .post("/api/items/item-3/bulk-log")
      .send({ count: "abc" })
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.have.property("error", "estimated wears must be a positive whole number")
        done()
      })
  })

  it("it should respond with an error when the count is missing", done => {
    chai
      .request(server)
      .post("/api/items/item-3/bulk-log")
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.have.property("error", "estimated wears must be a positive whole number")
        done()
      })
  })
})
