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
