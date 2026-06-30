const express = require('express');
const jwt = require('jsonwebtoken');
const { z } = require('zod');
const app = express();
app.use(express.json());

const SECRET = process.env.JWT_SECRET || 'dev-secret';
let tarefas = [], nextId = 1;

const tarefaSchema = z.object({
  titulo: z.string().min(1, "O título é obrigatório e não pode estar vazio")
});

app.post('/auth/login', (req, res) => {
  const { usuario, senha } = req.body;

  if (usuario === 'admin' && senha === '1234') {
    const token = jwt.sign({ usuario }, SECRET, { expiresIn: '1h' });
    return res.status(200).json({ token });
  }

  return res.status(401).json({ error: 'Credenciais inválidas.' });
});

const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Acesso negado. Token não fornecido.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, SECRET);
    req.usuario = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido ou expirado.' });
  }
};

app.get('/tarefas', requireAuth, (req, res) => {
  return res.status(200).json(tarefas);
});

app.post('/tarefas', requireAuth, (req, res) => {

  const validacao = tarefaSchema.safeParse(req.body);

  if (!validacao.success) {
    return res.status(400).json({ errors: validacao.error.errors });
  }

  const novaTarefa = {
    id: nextId++,
    titulo: validacao.data.titulo,
    ...req.body 
  };

  tarefas.push(novaTarefa);
  return res.status(201).json(novaTarefa);
});

app.put('/tarefas/:id', requireAuth, (req, res) => {
  const { id } = req.params;
  const index = tarefas.findIndex(t => t.id === parseInt(id));

  if (index === -1) {
    return res.status(404).json({ error: 'Tarefa não encontrada.' });
  }

  const validacao = tarefaSchema.safeParse(req.body);
  if (!validacao.success) {
    return res.status(400).json({ errors: validacao.error.errors });
  }

  tarefas[index] = {
    ...tarefas[index],
    ...req.body,
    titulo: validacao.data.titulo
  };

  return res.status(200).json(tarefas[index]);
});

app.delete('/tarefas/:id', requireAuth, (req, res) => {
  const { id } = req.params;
  const index = tarefas.findIndex(t => t.id === parseInt(id));

  if (index === -1) {
    return res.status(404).json({ error: 'Tarefa não encontrada.' });
  }

  tarefas.splice(index, 1);
  return res.status(204).send();
});


app.listen(3000, () => console.log('Servidor rodando em http://localhost:3000'));