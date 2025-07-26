const express = require('express');
const router = express.Router();

/**
 * GET /api/autores - Listar todos os autores com contagem de notícias publicadas
 */
router.get('/', async (req, res) => {
  try {
    const query = `
      SELECT 
        a.*, 
        COUNT(n.id) AS total_noticias
      FROM autores a
      LEFT JOIN noticias n 
        ON a.id = n.author_id 
        AND n.status = 'publicado'
      GROUP BY a.id
      ORDER BY a.nome
    `;

    const [autores] = await req.db.execute(query);
    res.json(autores);
  } catch (error) {
    console.error('Erro ao buscar autores:', error);
    res.status(500).json({ error: 'Erro ao buscar autores', details: error.message });
  }
});

/**
 * POST /api/autores - Criar novo autor
 */
router.post('/', async (req, res) => {
  try {
    const { nome, email, bio, avatar } = req.body;

    // Validação simples
    if (!nome) {
      return res.status(400).json({ error: 'O nome é obrigatório' });
    }

    const [result] = await req.db.execute(
      `INSERT INTO autores (nome, email, bio, avatar) VALUES (?, ?, ?, ?)`,
      [nome, email, bio, avatar]
    );

    res.status(201).json({
      message: 'Autor criado com sucesso',
      id: result.insertId,
    });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Email já está em uso' });
    }
    console.error('Erro ao criar autor:', error);
    res.status(500).json({ error: 'Erro ao criar autor', details: error.message });
  }
});

module.exports = router;
