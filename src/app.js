const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  const { title } = request.query;

  const results = title
    ? repositories.filter(repository => repository.title.includes(title))
    : repositories;

  return response.json(results);
});

app.post("/repositories", (request, response) => {
  const { title, techs } = request.body;

  const base_url = "http://github.com/";

  const new_url = base_url + Math.floor(Math.random() * 25600);

  const url = new_url;

  const repository = { id: uuid(), title, techs, url, likes: 0 };

  repositories.push(repository)

  console.log(`⚡️ Project ${repository.title} created ⚡️`);

  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, techs, url } = request.body;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: 'Project not found.' })
  }

  const repository = {
    id,
    title,
    techs,
    url,
    likes: repositories[repositoryIndex].likes
  }

  repositories[repositoryIndex] = repository;

  console.log(`⚡️ ${repository.title} repository updated ⚡️`);

  return response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: 'Project not found.' })
  }

  repositories.splice(repositoryIndex, 1);

  console.log(`⚡️ Project deleted  ⚡️`);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: 'Project not found.' })
  }

  repositories[repositoryIndex].likes++;

  return response.json(repositories[repositoryIndex]);
});

module.exports = app;
