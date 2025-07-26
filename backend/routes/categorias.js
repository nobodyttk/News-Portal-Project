const express = require('express');
const router = express.Router();

/**
 * GET /api/categorias - Listar todas as categorias com contagem de notícias publicadas
 */
router.get('/', async (req, res) => {
  try {
    const query = `
      SELECT 
        c.*, 
        COUNT(n.id) AS total_noticias
      FROM categorias c
      LEFT JOIN noticias n 
        ON c.id = n.category_id 
        AND n.status = 'publicado'
      GROUP BY c.id
      ORDER BY c.nome
    `;

    const [categorias] = await req.db.execute(query);
    res.json(categorias);
  } catch (error) {
    console.error('Erro ao buscar categorias:', error);
    res.status(500).json({ error: 'Erro ao buscar categorias', details: error.message });
  }
});

/**
 * POST /api/categorias - Criar nova categoria
 */
router.post('/', async (req, res) => {
  try {
    const { nome, cor = '#dc2626', icone = '📰' } = req.body;

    if (!nome) {
      return res.status(400).json({ error: 'O nome é obrigatório' });
    }

    const [result] = await req.db.execute(
      `INSERT INTO categorias (nome, cor, icone) VALUES (?, ?, ?)`,
      [nome.toUpperCase(), cor, icone]
    );

    res.status(201).json({
      message: 'Categoria criada com sucesso',
      id: result.insertId,
    });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Categoria já existe' });
    }
    console.error('Erro ao criar categoria:', error);
    res.status(500).json({ error: 'Erro ao criar categoria', details: error.message });
  }
});

module.exports = router;
