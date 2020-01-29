const express = require('express');
const server = express();

server.use(express.json());

const projects = [];

/** Middleware global, chamado em todas as requisições  */
function logRequests(req, res, next) {
  console.count("Número de requisições");
  return next();
}
server.use(logRequests);

//Middleware Local para check de Projeto existente
function CheckProjectExists(req, res, next){
  const {id } = req.params;
  const project = projects.find(p=>p.id == id);

  if(!project){
    return res.status(400).json({error: 'Projeto não encontrado'});
  }
    return next();
  }

/* Lista todos os projetos*/
server.get('/projects', (req, res) => {
  res.send(projects)
});

/** Insere um novo projeto*/
server.post('/projects', (req, res) => {
  const { id, title } = req.body;

  const project = 
    {
      id,
      title,
      tasks: []
    };

  projects.push(project);
  return res.json(project);
});

/** Altera o título de um projeto atravém do ID enviado via Route Params */
server.put('/projects/:id', CheckProjectExists, (req, res) => {
   const { id } = req.params;
   const { title } = req.body;

   const project = projects.find(p=> p.id == id);

   project.title = title;
   return res.json(project);

});

/** Remove um projeto atravém do ID enviado via Route Params */
server.delete('/projects/:id', CheckProjectExists, (req, res) => {
  const { id } = req.params;
  const projectIndex = projects.findIndex(p => p.id == id);

  projects.splice(projectIndex, 1);
  return res.send();
});

/** Adiciona ua nova task a um projeto atravém do ID enviado via Route Params */
server.post('/projects/:id/tasks', CheckProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p=> p.id == id);

  project.tasks.push(title);
  return res.json(project);

})

server.listen(3000, () => {
  console.log('server started');
});
