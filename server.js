const express = require('express');
const jwt = require('jsonwebtoken');
const { z } = require('zod');
const app = express();
app.use(express.json());

const SECRET = process.env.JWT_SECRET || 'dev-secret';
let tarefas = [], nextId = 1;

// TODO: Implemente:
// POST /auth/login { usuario, senha } → 200 { token }  (usuario:"admin", senha:"1234")
// Middleware requireAuth → 401 se sem token ou inválido
// GET    /tarefas    (requireAuth) → 200 + lista
// POST   /tarefas    (requireAuth) → 201 + tarefa (Zod: { titulo: string.min(1) })
// PUT    /tarefas/:id (requireAuth) → 200 ou 404
// DELETE /tarefas/:id (requireAuth) → 204 ou 404

app.listen(3000, () => console.log('Servidor rodando em http://localhost:3000'));
