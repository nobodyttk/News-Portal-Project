const express = require("express");
const router = express.Router();

// GET /api/tags - Listar todas as tags com total de notícias publicadas
router.get("/", async (req, res) => {
  try {
    const query = `
      SELECT 
        t.*,
        COUNT(nt.noticia_id) AS total_noticias
      FROM tags t
      LEFT JOIN noticia_tags nt ON t.id = nt.tag_id
      LEFT JOIN noticias n ON nt.noticia_id = n.id AND n.status = 'publicado'
      GROUP BY t.id
      ORDER BY total_noticias DESC, t.nome
    `;

    const [tags] = await req.db.execute(query);
    res.json(tags);
  } catch (error) {
    console.error("Erro ao buscar tags:", error);
    res.status(500).json({ error: "Erro ao buscar tags" });
  }
});

// GET /api/tags/:slug/noticias - Buscar notícias associadas a uma tag com paginação
router.get("/:slug/noticias", async (req, res) => {
  try {
    const { slug } = req.params;
    const page = Number.parseInt(req.query.page) || 1;
    const limit = Number.parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const query = `
      SELECT 
        n.id,
        n.title,
        n.slug,
        n.excerpt,
        n.image,
        n.destaque,
        n.views,
        n.published_at,
        a.nome AS author,
        c.nome AS category,
        c.cor AS category_color,
        c.icone AS category_icon
      FROM noticias n
      INNER JOIN noticia_tags nt ON n.id = nt.noticia_id
      INNER JOIN tags t ON nt.tag_id = t.id
      LEFT JOIN autores a ON n.author_id = a.id
      LEFT JOIN categorias c ON n.category_id = c.id
      WHERE t.slug = ? AND n.status = 'publicado'
      ORDER BY n.published_at DESC
      LIMIT ? OFFSET ?
    `;

    const [noticias] = await req.db.execute(query, [slug, limit, offset]);

    const processedNoticias = noticias.map((noticia) => ({
      ...noticia,
      destaque: Boolean(noticia.destaque),
    }));

    // Opcional: Retornar paginação (se quiser contar total de notícias para essa tag)
    const countQuery = `
      SELECT COUNT(DISTINCT n.id) AS total
      FROM noticias n
      INNER JOIN noticia_tags nt ON n.id = nt.noticia_id
      INNER JOIN tags t ON nt.tag_id = t.id
      WHERE t.slug = ? AND n.status = 'publicado'
    `;
    const [countResult] = await req.db.execute(countQuery, [slug]);
    const total = countResult[0]?.total || 0;

    res.json({
      noticias: processedNoticias,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Erro ao buscar notícias por tag:", error);
    res.status(500).json({ error: "Erro ao buscar notícias por tag" });
  }
});

module.exports = router;
