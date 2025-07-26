const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const http = require('http');
const mysql = require('mysql2/promise');
require('dotenv').config();

// Importar rotas
const noticiasRoutes = require('./routes/noticias');
const categoriasRoutes = require('./routes/categorias');
const autoresRoutes = require('./routes/autores');
const tagsRoutes = require('./routes/tags');

const app = express();
const port = process.env.PORT || 3001;
const server = http.createServer(app);

// Configuração do banco de dados
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'gamezone',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

// Pool de conexões
const pool = mysql.createPool(dbConfig);

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware para injetar conexão do banco nas rotas
app.use((req, res, next) => {
  req.db = pool;
  next();
});

// Rotas
app.use('/api/noticias', noticiasRoutes);
app.use('/api/categorias', categoriasRoutes);
app.use('/api/autores', autoresRoutes);
app.use('/api/tags', tagsRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'GameVicio API funcionando!',
    timestamp: new Date().toISOString(),
  });
});

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
  console.error('Erro:', err);
  res.status(500).json({
    error: 'Erro interno do servidor',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Algo deu errado',
  });
});

// Middleware para rota não encontrada
app.use((req, res) => {
  res.status(404).json({
    error: 'Rota não encontrada',
    message: `A rota ${req.originalUrl} não existe`,
  });
});


// Iniciar servidor
server.listen(port, () => {
  console.log(`🚀 Servidor rodando na porta ${port}`);
  console.log(`📊 API disponível em http://localhost:${port}/api`);
});
