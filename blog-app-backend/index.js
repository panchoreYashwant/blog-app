const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, "uploads");
console.log(uploadDir);
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
app.use("/uploads", express.static(uploadDir));

// Connect to MongoDB
mongoose
  .connect("mongodb://localhost:27017/blog", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Define storage for images
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString().replace(/:/g, "-") + file.originalname);
  },
});
const upload = multer({ storage: storage });

// Blog Post Schema
const blogSchema = new mongoose.Schema({
  title: String,
  subtitle: String,
  content: String,
  imageUrl: String,
});
const BlogPost = mongoose.model("BlogPost", blogSchema);

// Routes
app.post("/api/blog", upload.single("image"), (req, res) => {
  const { title, subtitle, content } = req.body;
  const imageUrl = req.file ? req.file.path : null;

  const newPost = new BlogPost({
    title,
    subtitle,
    content,
    imageUrl,
  });

  newPost
    .save()
    .then((post) => res.json(post))
    .catch((err) => res.status(500).json({ error: "Error saving the post" }));
});

app.get("/api/blogs", (req, res) => {
  BlogPost.find()
    .then((posts) => res.json(posts))
    .catch((err) => res.status(500).json({ error: "Error fetching posts" }));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
