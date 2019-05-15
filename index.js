const express = require("express");
const server = express();
server.use(express.json());

const db = require("./data/db.js");

server.listen(9090, () => {
  console.log("we out here listening");
});

server.get("/", (req, res) => {
  res.send("<h1>🙈🙉🙊🐵my server🐵🙊🙉🙈</h1>");
});

server.post("/api/posts", (req, res) => {
  const { title, contents, created_at, updated_at } = req.body;
  if (!title || !contents) {
    res.status(400).json({
      errorMessage: "Please provide title and contents for the post."
    });
  }
  db.insert({
    title,
    contents,
    created_at,
    updated_at
  })
    .then(addedPost => {
      res.status(201).json(addedPost);
    })
    .catch(err =>
      res.status(500).json({
        error: "There was an error while saving the post to the database"
      })
    );
});

server.get("/api/posts", (req, res) => {
  db.find()
    .then(posts => {
      res.json(posts);
    })
    .catch(err => res.status(500).send(err));
});

server.get("/api/posts/:id", (req, res) => {
  const { id } = req.params;
  db.findById(id)
    .then(post => {
      if (!post) {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      }
      res.status(201).json(post);
    })
    .catch(err =>
      res
        .status(500)
        .send({ error: "The post informanction could not be retrieved." })
    );
});

server.delete("/api/posts/:id", async (req, res) => {
  try {
    const postToDelete = await db.findById(req.params.id);
    const count = await db.remove(req.params.id);
    if (count > 0) {
      res.status(200).json(postToDelete);
    } else {
      res
        .status(404)
        .json({ message: "The post with the specified ID does not exist." });
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "The post information could not be retrieved." });
  }
});

server.put("/api/posts/:id", async (req, res) => {
  const { title, contents } = req.body;
  if (!title || !contents) {
    res.status(400).json({
      errorMessage: "Please provide title and contents for the post."
    });
  }
  try {
    const count = await db.update(req.params.id, req.body);
    if (count === 1) {
      res.status(200).json(req.body);
    }
  } catch {
    res
      .status(404)
      .json({ error: "The post information could not be modified." });
  }
});
