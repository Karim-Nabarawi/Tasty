const express = require("express");
const Recipe = require("./models/recipe.js");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
require("./db.js");

const fileStorage = multer.diskStorage({
  destination: (_req, _file, callbackf) => {
    callbackf(null, "./public/uploads");
  },
  filename: (req, file, callback) => {
    callback(null, file.originalname);
  },
});

const upload = multer({ storage: fileStorage });
const app = express();
const port = process.env.PORT || 5000;
const whitelist = ["http://localhost:3000"];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};
app.use(express.json());
app.use(cors(corsOptions));
app.use(express.static("public"));

app.get("/getRecipes", async (req, res) => {
  try {
    const data = await Recipe.find({});
    if (!data) {
      return res.status(404).send();
    }
    res.send(data);
  } catch (e) {
    res.status(500).send(e);
  }
});

app.get("/recipe/:id", async (req, res) => {
  const _id = req.params.id;
  try {
    const recipe = await Recipe.findById(_id);
    if (!recipe) {
      return res.status(400).send();
    }
    res.send(recipe);
  } catch (e) {
    res.status(500).send(e);
  }
});

app.post("/recipe", upload.array("image", "data"), async (req, res) => {
  try {
    const fileName = req.files[0].filename;
    let imgPath = "http://localhost:5000/uploads/" + fileName;

    if (process.env.NODE_ENV !== "production") {
      imgPath = `http://localhost:5000/uploads/${fileName}`;
      console.log("development server");
    } else {
      imgPath = "https://cooking-recipe-mern.herokuapp.com/uploads/" + fileName;
      console.log("production server");
    }
    const data = JSON.parse(req.body.data);
    const recipe = new Recipe({ ...data, image: imgPath });
    await recipe.save();
    res.status(200).send(recipe);
  } catch (e) {
    res.status(500).send(e);
    console.log(e);
  }
});

app.delete("/recipe/:id", async (req, res) => {
  try {
    const recipe = await Recipe.findByIdAndDelete(req.params.id);
    if (!recipe) {
      return res.status(404).send();
    }
    res.send(recipe);
  } catch (e) {
    res.status(500).send(e);
  }
});

app.patch("/recipe/:id", upload.array("image", "data"), async (req, res) => {
  const data = JSON.parse(req.body.data);

  const fileName = req.files[0].filename;
  const fileSize = req.files[0].size;

  if (fileSize !== 0) {
    if (process.env.NODE_ENV !== "production") {
      data.image = `http://localhost:5000/uploads/${fileName}`;
    } else {
      data.image = __dirname + "\\uploads\\" + fileName;
    }
  }

  try {
    const recipe = await Recipe.findByIdAndUpdate(req.params.id, data, {
      new: true,
      runValidators: true,
    });
    if (!recipe) {
      return res.status(404).send();
    }
    res.send(recipe);
  } catch (e) {
    res.status(400).send(e);
  }
});

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "client/build")));

  app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "client/build", "index.html"));
  });
}

try {
  app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
  });
} catch (e) {
  console.log(e);
}
