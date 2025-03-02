const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT ;
const MONGO_URI =
  process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

const ItemSchema = new mongoose.Schema({ name: String });
const Item = mongoose.model("Item", ItemSchema);


app.get("/", (req, res) => {
  res.send("Node.js MongoDB Docker App is running!");
});

app.post("/add", async (req, res) => {
  try {
    const newItem = new Item({ name: req.body.name });
    await newItem.save();
    res.status(201).json({ message: "Item added", item: newItem });
  } catch (error) {
    res.status(500).json({ error: "Error adding item" });
  }
});

app.get("/items", async (req, res) => {
  try {
    const items = await Item.find(); // Fetch all items
    res.status(200).json({ message: "All items", items });
  } catch (error) {
    res.status(500).json({ error: "Error retrieving items" });
  }
});

app.get("/items/:id", async (req, res) => {
    try {
      const item = await Item.findById(req.params.id);
      
      if (!item) {
        return res.status(404).json({ message: "Item not found" });
      }
  
      console.log("Retrieved item:", item); // Debugging
      res.status(200).json({ message: `Item ${req.params.id}`, item });
    } catch (error) {
      console.error("Error fetching item:", error); // Debugging
      res.status(500).json({ error: "Invalid ID format or item not found" });
    }
  });


app.put("/items/:id", async (req, res) => {
  try {
    const updatedItem = await Item.findByIdAndUpdate(
      req.params.id,
      { name: req.body.name },
      { new: true, runValidators: true }
    );

    if (!updatedItem) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.status(200).json({ message: "Item updated", item: updatedItem });
  } catch (error) {
    res.status(500).json({ error: "Invalid ID format or update failed" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
