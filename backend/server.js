const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const http = require('http');
require('dotenv').config();

const app = express();
const port = 3000;
const server = http.createServer(app);

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware para injetar conexão do banco nas rotas 
app.use((req, res, next) => {
    console.log('Middleware de DB: Conexão com o banco desabilitada para este exemplo.');
    next();
});

// Rotas 
app.get('/api/noticias', (req, res) => {
    res.status(200).json({
        message: 'Esta é uma rota de exemplo para notícias.',
        data: []
    });
});

app.get('/api/categorias', (req, res) => {
    res.status(200).json({
        message: 'Esta é uma rota de exemplo para categorias.',
        data: []
    });
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        message: ' API funcionando!',
        timestamp: new Date().toISOString(),
    });
});

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
    console.error('Erro:', err);
    res.status(500).json({
        error: 'Erro interno do servidor',
        message: 'Erro interno do servidor.',
    });
});

// Middleware para rota não encontrada
app.use((req, res) => {
    res.status(404).json({
        error: 'Rota não encontrada',
        message: `A rota ${req.originalUrl} não existe (modo demonstração).`,
    });
});

// Iniciar servidor
server.listen(port, () => {
    console.log(`🚀 Servidor rodando na porta ${port} (modo demonstração)`);
    console.log(`📊 API disponível em http://localhost:${port}/api`);
    console.log(`⚠️  Funcionalidades de banco de dados e rotas específicas estão desabilitadas.`);
});
