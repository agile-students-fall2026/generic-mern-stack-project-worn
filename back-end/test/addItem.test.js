const chai = require("chai")
const chaiHttp = require("chai-http")
const server = require("../app")

chai.use(chaiHttp)
chai.should()

describe("POST request to /api/items/new route", () => {
  it("it should respond with the new item when everything is filled in", done => {
    chai
      .request(server)
      .post("/api/items/new")
      .send({
        name: "Green hoodie",
        category: "Tops",
        price: "45",
        purchaseDate: "2026-10-01",
        imageUrl: "https://picsum.photos/seed/worn-hoodie/600/750",
        pastWears: 0
      })
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.be.a("object")
        res.body.should.have.property("id")
        res.body.should.have.property("name", "Green hoodie")
        res.body.should.have.property("category", "Tops")
        res.body.should.have.property("price", 45)
        done()
      })
  })

  it("it should give the item a default photo and no date when those are left empty", done => {
    chai
      .request(server)
      .post("/api/items/new")
      .send({ name: "Black boots", category: "Shoes", price: "90", purchaseDate: "", imageUrl: null })
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.have.property("purchaseDate", null)
        res.body.should.have.property("imageUrl")
        res.body.imageUrl.should.be.a("string")
        done()
      })
  })

  it("it should still add the item when past wears are given", done => {
    chai
      .request(server)
      .post("/api/items/new")
      .send({ name: "Old jeans", category: "Bottoms", price: "60", pastWears: "25" })
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.have.property("name", "Old jeans")
        done()
      })
  })

  it("it should be able to find the new item after it is added", done => {
    chai
      .request(server)
      .post("/api/items/new")
      .send({ name: "Red scarf", category: "Outerwear", price: "20" })
      .end((err, res) => {
        const newId = res.body.id

        chai
          .request(server)
          .get("/api/items/" + newId)
          .end((err, res) => {
            res.should.have.status(200)
            res.body.should.have.property("name", "Red scarf")
            done()
          })
      })
  })

  it("it should respond with an error when the name is missing", done => {
    chai
      .request(server)
      .post("/api/items/new")
      .send({ category: "Tops", price: "10" })
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.have.property("error", "name, price and category are required")
        done()
      })
  })

  it("it should respond with an error when the price is missing", done => {
    chai
      .request(server)
      .post("/api/items/new")
      .send({ name: "Blue cap", category: "Tops" })
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.have.property("error", "name, price and category are required")
        done()
      })
  })

  it("it should respond with an error when the category is missing", done => {
    chai
      .request(server)
      .post("/api/items/new")
      .send({ name: "Blue cap", price: "15" })
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.have.property("error", "name, price and category are required")
        done()
      })
  })
})
