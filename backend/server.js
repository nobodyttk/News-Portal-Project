// server-example.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const http = require('http');

// Inicialização do aplicativo Express
const app = express();
const port = 3000; // Porta padrão para demonstração
const server = http.createServer(app);

// Middleware
app.use(cors()); // Habilita CORS para requisições cross-origin
app.use(bodyParser.json({ limit: '10mb' })); // Suporte para JSON
app.use(bodyParser.urlencoded({ extended: true })); // Suporte para formulários

// Middleware de exemplo para simular injeção de dependências
app.use((req, res, next) => {
    // Simula uma conexão com banco de dados (omitida para demonstração)
    console.log('Middleware: Simulação de conexão com banco de dados.');
    req.db = { example: 'Conexão fictícia para demonstração' };
    next();
});

// Rotas de exemplo
app.get('/api/exemplo', (req, res) => {
    res.status(200).json({
        message: 'Rota de exemplo para demonstrar a API.',
        data: [{ id: 1, nome: 'Exemplo de Item' }],
        dbStatus: req.db.example // Demonstra uso do middleware
    });
});

// Health check
app.get('/api/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        message: 'API funcionando corretamente (modo demonstração).',
        timestamp: new Date().toISOString()
    });
});

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
    console.error('Erro:', err);
    res.status(500).json({
        error: 'Erro interno do servidor',
        message: 'Ocorreu um erro no servidor (modo demonstração).'
    });
});

// Middleware para rotas não encontradas
app.use((req, res) => {
    res.status(404).json({
        error: 'Rota não encontrada',
        message: `A rota ${req.originalUrl} não existe (modo demonstração).`
    });
});

// Iniciar servidor
server.listen(port, () => {
    console.log(`🚀 Servidor rodando na porta ${port} (modo demonstração)`);
    console.log(`📊 API disponível em http://localhost:${port}/api`);
    
});
