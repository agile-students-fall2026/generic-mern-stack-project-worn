const chai = require("chai")
const chaiHttp = require("chai-http")
const server = require("../app")
const users = require("../data/users")

chai.use(chaiHttp)
chai.should()

const SUCCESS_MESSAGE = "If an account exists for that email, a reset link has been sent."

describe("POST request to /api/auth/forgot-password route", () => {
  beforeEach(() => {
    users.resetUsers()
  })

  it("it should respond with a success message when the email has an account", done => {
    chai
      .request(server)
      .post("/api/auth/forgot-password")
      .send({ email: "demo@worn.app" })
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.have.property("message", SUCCESS_MESSAGE)
        done()
      })
  })

  it("it should give the same success message when the email has no account", done => {
    chai
      .request(server)
      .post("/api/auth/forgot-password")
      .send({ email: "nobody@example.com" })
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.have.property("message", SUCCESS_MESSAGE)
        done()
      })
  })

  it("it should ignore capital letters and spaces in the email", done => {
    chai
      .request(server)
      .post("/api/auth/forgot-password")
      .send({ email: "  Demo@Worn.App " })
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.have.property("message", SUCCESS_MESSAGE)
        done()
      })
  })

  it("it should respond with an error when the email is not valid", done => {
    chai
      .request(server)
      .post("/api/auth/forgot-password")
      .send({ email: "not-an-email" })
      .end((err, res) => {
        res.should.have.status(400)
        res.body.should.have.property("message", "Enter a valid email address.")
        done()
      })
  })

  it("it should respond with an error when the email is missing", done => {
    chai
      .request(server)
      .post("/api/auth/forgot-password")
      .end((err, res) => {
        res.should.have.status(400)
        res.body.should.have.property("message", "Enter a valid email address.")
        done()
      })
  })
})