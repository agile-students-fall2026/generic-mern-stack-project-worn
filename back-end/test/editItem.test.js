const chai = require("chai")
const chaiHttp = require("chai-http")
const server = require("../app")

chai.use(chaiHttp)
chai.should()

describe("GET request to /api/categories route", () => {
  it("it should respond with an HTTP 200 status code and an array of categories", done => {
    chai
      .request(server)
      .get("/api/categories")
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.be.a("array")
        res.body.length.should.equal(4)
        done()
      })
  })
})

describe("GET request to /api/items/:itemId route", () => {
  it("it should respond with the item when the id is real", done => {
    chai
      .request(server)
      .get("/api/items/item-1")
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.be.a("object")
        res.body.should.have.property("id", "item-1")
        res.body.should.have.property("name", "White oxford shirt")
        done()
      })
  })

  it("it should respond with an error when the id is not real", done => {
    chai
      .request(server)
      .get("/api/items/not-a-real-item")
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.be.a("object")
        res.body.should.have.property("error", "item not found")
        done()
      })
  })
})

describe("POST request to /api/items/:itemId/edit route", () => {
  it("it should respond with the updated item when the id is real", done => {
    chai
      .request(server)
      .post("/api/items/item-1/edit")
      .send({
        name: "Blue oxford shirt",
        category: "Tops",
        price: "70",
        purchaseDate: "2025-03-14",
        imageUrl: "https://picsum.photos/seed/worn-item-1/600/750"
      })
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.be.a("object")
        res.body.should.have.property("name", "Blue oxford shirt")
        res.body.should.have.property("price", 70) // price should turn into a number
        done()
      })
  })

  it("it should respond with an error when the id is not real", done => {
    chai
      .request(server)
      .post("/api/items/not-a-real-item/edit")
      .send({ name: "Something", category: "Tops", price: "10" })
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.have.property("error", "item not found")
        done()
      })
  })
})

describe("POST request to /api/items/:itemId/delete route", () => {
  it("it should respond with a message when the item is deleted", done => {
    chai
      .request(server)
      .post("/api/items/item-13/delete")
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.be.a("object")
        res.body.should.have.property("id", "item-13")
        res.body.should.have.property("message", "item deleted")
        done()
      })
  })

  it("it should not find the item anymore after it is deleted", done => {
    chai
      .request(server)
      .get("/api/items/item-13")
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.have.property("error", "item not found")
        done()
      })
  })

  it("it should respond with an error when the id is not real", done => {
    chai
      .request(server)
      .post("/api/items/not-a-real-item/delete")
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.have.property("error", "item not found")
        done()
      })
  })
})