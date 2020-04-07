const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require("uuidv4");

// const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function putLike(request, response, next) {
  const { likes } = request.body;
  
  if(likes) {
     return response.status(400).json({ likes: 0 });
  }  

  return next();
}

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;
  const repositorie = { id: uuid(), title, url, techs, likes: 0 };
  repositories.push(repositorie);
  return response.json(repositorie);
});

app.put("/repositories/:id", putLike, (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repositorieIndex = repositories.findIndex(repositorie => repositorie.id === id);
  
  if (repositorieIndex < 0) {
    return response.status(400).json({error: 'Repositorie not found.'})
  }

  const repositorie = {
    id,
    title,
    url,
    techs,
  };

  repositories[repositorieIndex] = repositorie;

  return response.json(repositorie);  
});

app.delete("/repositories/:id", (req, res) => {
  const { id } = req.params;

  const repositorieIndex = repositories.findIndex(repositorie => repositorie.id === id);
  
  if (repositorieIndex < 0) {
    return res.status(400).json({error: 'Repositorie not found.'})
  }
  
  repositories.splice(repositorieIndex, 1);

  return res.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;
  
  const repositorieIndex = repositories.findIndex(repositorie => repositorie.id === id);
  
  if (repositorieIndex < 0) {
    return response.status(400).json({error: 'Repositorie not found.'})
  }
  
  var like = repositories[repositorieIndex].likes;

  like = like + 1;

  repositories[repositorieIndex].likes = like;

  return response.json(repositories[repositorieIndex]);  
});

module.exports = app;
