const express = require("express")
const router = express.Router()

// Função para gerar slug
function generateSlug(title) {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim("-")
}

// ROTA DE DIAGNÓSTICO - adicione temporariamente
router.get("/diagnostico", async (req, res) => {
  try {
    console.log("=== INICIANDO DIAGNÓSTICO DO BANCO ===")

    // Teste 1: Verificar se a conexão funciona
    try {
      const [result1] = await req.db.execute("SELECT 1 as test")
      console.log("✅ Teste 1 - Conexão básica: OK", result1)
    } catch (error1) {
      console.error("❌ Teste 1 - Conexão básica falhou:", error1)
      return res.json({ error: "Falha na conexão básica", details: error1.message })
    }

    // Teste 2: Verificar se a tabela existe
    try {
      const [result2] = await req.db.execute("SHOW TABLES LIKE 'noticias'")
      console.log("✅ Teste 2 - Tabela noticias existe:", result2.length > 0)
      if (result2.length === 0) {
        return res.json({ error: "Tabela 'noticias' não existe" })
      }
    } catch (error2) {
      console.error("❌ Teste 2 - Verificar tabela falhou:", error2)
      return res.json({ error: "Erro ao verificar tabela", details: error2.message })
    }

    // Teste 3: Verificar estrutura da tabela
    try {
      const [result3] = await req.db.execute("DESCRIBE noticias")
      console.log("✅ Teste 3 - Estrutura da tabela noticias:")
      result3.forEach(column => {
        console.log(`   ${column.Field}: ${column.Type} (${column.Null === 'YES' ? 'NULL' : 'NOT NULL'})`)
      })
    } catch (error3) {
      console.error("❌ Teste 3 - Estrutura da tabela falhou:", error3)
      return res.json({ error: "Erro ao verificar estrutura", details: error3.message })
    }

    // Teste 4: Contar registros na tabela
    try {
      const [result4] = await req.db.execute("SELECT COUNT(*) as total FROM noticias")
      console.log("✅ Teste 4 - Total de registros:", result4[0].total)
    } catch (error4) {
      console.error("❌ Teste 4 - Contar registros falhou:", error4)
      return res.json({ error: "Erro ao contar registros", details: error4.message })
    }

    // Teste 5: SELECT simples com WHERE
    try {
      const [result5] = await req.db.execute("SELECT id, title, status FROM noticias LIMIT 5")
      console.log("✅ Teste 5 - SELECT básico:", result5.length, "registros")
    } catch (error5) {
      console.error("❌ Teste 5 - SELECT básico falhou:", error5)
      return res.json({ error: "Erro no SELECT básico", details: error5.message })
    }

    // Teste 6: SELECT com parâmetro
    try {
      const [result6] = await req.db.execute("SELECT COUNT(*) as total FROM noticias WHERE status = ?", ["publicado"])
      console.log("✅ Teste 6 - SELECT com parâmetro:", result6[0].total, "registros publicados")
    } catch (error6) {
      console.error("❌ Teste 6 - SELECT com parâmetro falhou:", error6)
      return res.json({ error: "Erro no SELECT com parâmetro", details: error6.message })
    }

    // Teste 7: Verificar outras tabelas relacionadas
    const tabelas = ['autores', 'categorias', 'tags', 'noticia_tags']
    for (const tabela of tabelas) {
      try {
        const [tabelaResult] = await req.db.execute(`SHOW TABLES LIKE '${tabela}'`)
        if (tabelaResult.length > 0) {
          const [countResult] = await req.db.execute(`SELECT COUNT(*) as total FROM ${tabela}`)
          console.log(`✅ Tabela ${tabela}: ${countResult[0].total} registros`)
        } else {
          console.log(`⚠️  Tabela ${tabela}: não existe`)
        }
      } catch (errorTabela) {
        console.log(`❌ Erro ao verificar tabela ${tabela}:`, errorTabela.message)
      }
    }

    // Teste 8: Verificar versão do MySQL
    try {
      const [result8] = await req.db.execute("SELECT VERSION() as version")
      console.log("✅ Teste 8 - Versão do MySQL:", result8[0].version)
    } catch (error8) {
      console.error("❌ Teste 8 - Versão do MySQL falhou:", error8)
    }

    // Teste 9: Testar LIMIT com parâmetros (o que estava falhando)
    try {
      const limitValue = 5;
      const offsetValue = 0;
      // CORREÇÃO AQUI: Inclua LIMIT e OFFSET diretamente na string SQL
      const [result9] = await req.db.execute(`SELECT id FROM noticias LIMIT ${limitValue} OFFSET ${offsetValue}`);
      console.log("✅ Teste 9 - LIMIT com parâmetros (string literal): OK", result9.length, "registros")
    } catch (error9) {
      console.error("❌ Teste 9 - LIMIT com parâmetros (string literal) falhou:", error9)
      console.error("Detalhes do erro:", {
        code: error9.code,
        errno: error9.errno,
        sqlState: error9.sqlState,
        sqlMessage: error9.sqlMessage
      })
      // Se ainda falhar, pode indicar um problema mais profundo ou uma versão muito antiga.
      // A mensagem de erro agora deve ser diferente ou não ocorrer.
      return res.json({
        error: "LIMIT com valores diretos na string falhou",
        solution: "Verificar versão do MySQL ou driver do banco de dados",
        details: error9
      })
    }


    console.log("=== DIAGNÓSTICO CONCLUÍDO ===")
    res.json({ message: "Diagnóstico concluído com sucesso! Verifique o console." })

  } catch (error) {
    console.error("Erro geral no diagnóstico:", error)
    res.status(500).json({ error: "Erro no diagnóstico", details: error.message })
  }
})

// GET /api/noticias - Versão com solução alternativa (já estava correta)
router.get("/", async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      author,
      tag,
      destaque,
      status = "publicado",
      search,
      orderBy = "published_at",
      order = "DESC",
    } = req.query

    const pageNum = Math.max(1, parseInt(page) || 1)
    const limitNum = Math.max(1, Math.min(100, parseInt(limit) || 10))
    const offset = (pageNum - 1) * limitNum

    // Construir WHERE clause
    const whereConditions = ["status = 'publicado'"]

    if (category && category.trim()) {
      // Usando template literal para category_id na subquery
      whereConditions.push(`category_id = (SELECT id FROM categorias WHERE nome = '${category.trim().replace(/'/g, "''")}')`)
    }

    if (destaque !== undefined && destaque !== null) {
      whereConditions.push(`destaque = ${destaque === "true" || destaque === true ? 1 : 0}`)
    }

    if (search && search.trim()) {
      const searchTerm = search.trim().replace(/'/g, "''") // Escape aspas simples
      whereConditions.push(`(title LIKE '%${searchTerm}%' OR excerpt LIKE '%${searchTerm}%' OR content LIKE '%${searchTerm}%')`)
    }

    const whereClause = whereConditions.join(" AND ")

    // Validar orderBy
    const validOrderBy = ["published_at", "created_at", "title", "views", "id"]
    const validOrder = ["ASC", "DESC"]
    const safeOrderBy = validOrderBy.includes(orderBy) ? orderBy : "published_at"
    const safeOrder = validOrder.includes(order.toUpperCase()) ? order.toUpperCase() : "DESC"

    // Query sem parâmetros (usando string literal) para contornar o bug do LIMIT - JÁ ESTAVA CORRETO
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
        n.created_at,
        IFNULL(a.nome, '') as author,
        IFNULL(c.nome, '') as category,
        IFNULL(c.cor, '') as category_color,
        IFNULL(c.icone, '') as category_icon
      FROM noticias n
      LEFT JOIN autores a ON n.author_id = a.id
      LEFT JOIN categorias c ON n.category_id = c.id
      WHERE ${whereClause}
      ORDER BY n.${safeOrderBy} ${safeOrder}
      LIMIT ${limitNum} OFFSET ${offset}
    `

    console.log("Query sem parâmetros:", query)

    const [noticias] = await req.db.execute(query)

    // Buscar tags para cada notícia
    if (noticias.length > 0) {
      for (let noticia of noticias) {
        try {
          const tagsQuery = `
            SELECT GROUP_CONCAT(DISTINCT t.nome ORDER BY t.nome ASC) as tags
            FROM noticia_tags nt
            JOIN tags t ON nt.tag_id = t.id
            WHERE nt.noticia_id = ${noticia.id}
          `
          const [tagsResult] = await req.db.execute(tagsQuery)
          noticia.tags = tagsResult[0]?.tags ? tagsResult[0].tags.split(',') : []
        } catch (tagsError) {
          console.error("Erro ao buscar tags:", tagsError)
          noticia.tags = []
        }

        noticia.destaque = Boolean(noticia.destaque)
      }
    }

    // Contar total
    const countQuery = `SELECT COUNT(*) as total FROM noticias n WHERE ${whereClause}`
    const [countResult] = await req.db.execute(countQuery)
    const total = countResult[0].total

    res.json({
      noticias: noticias,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: parseInt(total),
        totalPages: Math.ceil(total / limitNum),
      },
    })

  } catch (error) {
    console.error("Erro ao buscar notícias:", error)
    res.status(500).json({ error: "Erro ao buscar notícias", details: error.message })
  }
})

// GET /api/noticias/:slug - Buscar notícia por slug (já estava correta)
router.get("/:slug", async (req, res) => {
  try {
    const { slug } = req.params

    const query = `
      SELECT
        n.*,
        IFNULL(a.nome, '') as author,
        IFNULL(a.email, '') as author_email,
        IFNULL(a.avatar, '') as author_avatar,
        IFNULL(c.nome, '') as category,
        IFNULL(c.cor, '') as category_color,
        IFNULL(c.icone, '') as category_icon
      FROM noticias n
      LEFT JOIN autores a ON n.author_id = a.id
      LEFT JOIN categorias c ON n.category_id = c.id
      WHERE n.slug = '${slug.replace(/'/g, "''")}' AND n.status = 'publicado'
    `

    const [result] = await req.db.execute(query)

    if (result.length === 0) {
      return res.status(404).json({ error: "Notícia não encontrada" })
    }

    let noticia = result[0]

    // Buscar tags
    try {
      const tagsQuery = `
        SELECT GROUP_CONCAT(DISTINCT t.nome ORDER BY t.nome ASC) as tags
        FROM noticia_tags nt
        JOIN tags t ON nt.tag_id = t.id
        WHERE nt.noticia_id = ${noticia.id}
      `
      const [tagsResult] = await req.db.execute(tagsQuery)
      noticia.tags = tagsResult[0]?.tags ? tagsResult[0].tags.split(',') : []
    } catch (tagsError) {
      console.error("Erro ao buscar tags:", tagsError)
      noticia.tags = []
    }

    noticia.destaque = Boolean(noticia.destaque)

    // Incrementar views
    try {
      await req.db.execute(`UPDATE noticias SET views = views + 1 WHERE id = ${noticia.id}`)
      noticia.views = (noticia.views || 0) + 1
    } catch (viewsError) {
      console.error("Erro ao incrementar views:", viewsError)
    }

    res.json(noticia)
  } catch (error) {
    console.error("Erro ao buscar notícia:", error)
    res.status(500).json({ error: "Erro ao buscar notícia" })
  }
})

// POST /api/noticias - Criar nova notícia
router.post("/", async (req, res) => {
  const connection = await req.db.getConnection()

  try {
    await connection.beginTransaction()

    const {
      title,
      excerpt,
      content,
      image,
      author_id,
      category_id,
      destaque = false,
      status = "rascunho",
      tags = [],
      published_at,
    } = req.body

    if (!title || !excerpt || !content) {
      return res.status(400).json({
        error: "Campos obrigatórios: title, excerpt, content",
      })
    }

    const slug = generateSlug(title)

    const [existingSlug] = await connection.execute("SELECT id FROM noticias WHERE slug = ?", [slug])

    if (existingSlug.length > 0) {
      return res.status(400).json({
        error: "Já existe uma notícia com este título (slug duplicado)",
      })
    }

    const insertQuery = `
      INSERT INTO noticias
      (title, slug, excerpt, content, image, author_id, category_id, destaque, status, published_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `

    const [result] = await connection.execute(insertQuery, [
      title,
      slug,
      excerpt,
      content,
      image || null,
      author_id || null,
      category_id || null,
      destaque ? 1 : 0,
      status,
      status === "publicado" ? published_at || new Date() : null,
    ])

    const noticiaId = result.insertId

    if (tags && tags.length > 0) {
      for (const tagNome of tags) {
        const tagSlug = generateSlug(tagNome)
        await connection.execute("INSERT IGNORE INTO tags (nome, slug) VALUES (?, ?)", [tagNome, tagSlug])

        const [tagResult] = await connection.execute("SELECT id FROM tags WHERE slug = ?", [tagSlug])

        if (tagResult.length > 0) {
          await connection.execute("INSERT IGNORE INTO noticia_tags (noticia_id, tag_id) VALUES (?, ?)", [
            noticiaId,
            tagResult[0].id,
          ])
        }
      }
    }

    await connection.commit()

    res.status(201).json({
      message: "Notícia criada com sucesso",
      id: noticiaId,
      slug,
    })
  } catch (error) {
    await connection.rollback()
    console.error("Erro ao criar notícia:", error)
    res.status(500).json({ error: "Erro ao criar notícia" })
  } finally {
    connection.release()
  }
})

// DELETE /api/noticias/:id
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params
    const [result] = await req.db.execute("DELETE FROM noticias WHERE id = ?", [id])

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Notícia não encontrada" })
    }

    res.json({ message: "Notícia deletada com sucesso" })
  } catch (error) {
    console.error("Erro ao deletar notícia:", error)
    res.status(500).json({ error: "Erro ao deletar notícia" })
  }
})

module.exports = router