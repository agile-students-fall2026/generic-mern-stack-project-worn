const express = require("express")
const path = require("node:path")
const authRoutes = require("./routes/auth")
const profileRoutes = require("./routes/profile")
const { apiNotFound, errorHandler } = require("./middleware/errors")
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use("/static", express.static(path.join(__dirname, "public")))
app.use("/api/auth", authRoutes)
app.use("/api/profile", profileRoutes)

let categories = ["Tops", "Bottoms", "Shoes", "Outerwear"]

let items = [
  { id: "item-1", name: "White oxford shirt", category: "Tops", price: 68, purchaseDate: "2025-03-14", imageUrl: "https://picsum.photos/seed/worn-item-1/600/750" },
  { id: "item-2", name: "Grey crewneck sweater", category: "Tops", price: 95, purchaseDate: "2024-11-02", imageUrl: "https://picsum.photos/seed/worn-item-2/600/750" },
  { id: "item-3", name: "Black graphic tee", category: "Tops", price: 28, purchaseDate: "2026-06-20", imageUrl: "https://picsum.photos/seed/worn-item-3/600/750" },
  { id: "item-4", name: "Linen button-down", category: "Tops", price: 54, purchaseDate: "2026-05-08", imageUrl: "https://picsum.photos/seed/worn-item-4/600/750" },
  { id: "item-5", name: "Raw denim jeans", category: "Bottoms", price: 140, purchaseDate: "2024-09-18", imageUrl: "https://picsum.photos/seed/worn-item-5/600/750" },
  { id: "item-6", name: "Khaki chinos", category: "Bottoms", price: 72, purchaseDate: "2025-08-30", imageUrl: "https://picsum.photos/seed/worn-item-6/600/750" },
  { id: "item-7", name: "Black wool trousers", category: "Bottoms", price: 160, purchaseDate: "2026-02-11", imageUrl: "https://picsum.photos/seed/worn-item-7/600/750" },
  { id: "item-8", name: "White leather sneakers", category: "Shoes", price: 120, purchaseDate: "2025-04-05", imageUrl: "https://picsum.photos/seed/worn-item-8/600/750" },
  { id: "item-9", name: "Chelsea boots", category: "Shoes", price: 210, purchaseDate: "2025-10-22", imageUrl: "https://picsum.photos/seed/worn-item-9/600/750" },
  { id: "item-10", name: "Running shoes", category: "Shoes", price: 135, purchaseDate: "2026-01-15", imageUrl: "https://picsum.photos/seed/worn-item-10/600/750" },
  { id: "item-11", name: "Navy wool coat", category: "Outerwear", price: 320, purchaseDate: "2024-12-01", imageUrl: "https://picsum.photos/seed/worn-item-11/600/750" },
  { id: "item-12", name: "Denim jacket", category: "Outerwear", price: 98, purchaseDate: "2025-06-12", imageUrl: "https://picsum.photos/seed/worn-item-12/600/750" },
  { id: "item-13", name: "Rain shell", category: "Outerwear", price: 150, purchaseDate: "2026-09-28", imageUrl: "https://picsum.photos/seed/worn-item-13/600/750" },
]

let nextItemNumber = 14

let wears = []
let nextWearNumber = 1

app.get("/api/categories", (req, res) => {
  res.json(categories)
})

app.get("/api/items/:itemId", (req, res) => {
  let foundItem = null

  for (let i = 0; i < items.length; i++) {
    if (items[i].id === req.params.itemId) {
      foundItem = items[i]
    }
  }

  if (foundItem) {
    res.json(foundItem)
  } else {
    res.status(404).json({ message: "item not found" })
  }
})

app.delete("/api/wears/:id", (req, res) => {
  const index = wears.findIndex(wear => wear.id === req.params.id)
  if (index === -1) {
    return res.status(404).json({ message: "wear not found" })
  }

  const [removed] = wears.splice(index, 1)
  res.json({ id: removed.id })
})

app.post("/api/items/new", (req, res) => {
    if (!req.body.name || !req.body.price || !req.body.category) {
      res.json({ error: "name, price and category are required" })
      return
    }
  
    let newId = "item-" + nextItemNumber
    nextItemNumber = nextItemNumber + 1
  
    let newItem = {
      id: newId,
      name: req.body.name,
      category: req.body.category,
      price: Number(req.body.price),
      purchaseDate: req.body.purchaseDate || null,
      imageUrl: req.body.imageUrl || "https://picsum.photos/seed/worn-" + newId + "/600/750",
    }
  
    items.push(newItem)
  
    if (req.body.pastWears && Number(req.body.pastWears) > 0) {
      let newWear = {
        id: "wear-" + nextWearNumber,
        itemId: newId,
        type: "estimate",
        period: "all-time",
        count: Number(req.body.pastWears),
      }
      nextWearNumber = nextWearNumber + 1
      wears.push(newWear)
    }
  
    res.json(newItem)
  })

app.get("/api/items/:itemId/wears", (req, res) => {
    let itemExists = false
  
    for (let i = 0; i < items.length; i++) {
      if (items[i].id === req.params.itemId) {
        itemExists = true
      }
    }
  
    if (!itemExists) {
      res.json({ error: "item not found" })
      return
    }
  
    let itemWears = []
  
    for (let i = 0; i < wears.length; i++) {
      if (wears[i].itemId === req.params.itemId) {
        itemWears.push(wears[i])
      }
    }
  
    res.json(itemWears)
  })

  app.post("/api/items/:itemId/bulk-log", (req, res) => {
    let itemExists = false
  
    for (let i = 0; i < items.length; i++) {
      if (items[i].id === req.params.itemId) {
        itemExists = true
      }
    }
  
    if (!itemExists) {
      res.json({ error: "item not found" })
      return
    }
  
    let count = 0
    if (req.body) {
      count = Number(req.body.count)
    }
  
    if (isNaN(count) || count <= 0 || count % 1 !== 0) {
      res.json({ error: "estimated wears must be a positive whole number" })
      return
    }
  
    let newWear = {
      id: "wear-" + nextWearNumber,
      itemId: req.params.itemId,
      type: "estimate",
      period: "all-time",
      count: count,
    }
    nextWearNumber = nextWearNumber + 1
    wears.push(newWear)
  
    res.json(newWear)
  })

app.post("/api/items/:itemId/edit", (req, res) => {
  let updatedItem = null

  for (let i = 0; i < items.length; i++) {
    if (items[i].id === req.params.itemId) {
      items[i].name = req.body.name
      items[i].category = req.body.category
      items[i].price = Number(req.body.price)
      items[i].purchaseDate = req.body.purchaseDate
      items[i].imageUrl = req.body.imageUrl
      updatedItem = items[i]
    }
  }

  if (updatedItem) {
    res.json(updatedItem)
  } else {
    res.json({ error: "item not found" })
  }
})

app.post("/api/items/:itemId/delete", (req, res) => {
  let newItems = []
  let found = false

  for (let i = 0; i < items.length; i++) {
    if (items[i].id === req.params.itemId) {
      found = true
    } else {
      newItems.push(items[i])
    }
  }

  items = newItems

  if (found) {
    res.json({ id: req.params.itemId, message: "item deleted" })
  } else {
    res.json({ error: "item not found" })
  }
})

app.use("/api", apiNotFound)
app.use(errorHandler)

module.exports = app
