"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { AlertCircle } from "lucide-react"
import axios from "axios"
import styles from "./related-articles.module.css"

export function RelatedArticles({ currentArticle }) {
  const [relatedArticles, setRelatedArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Buscar artigos relacionados da API
  useEffect(() => {
    async function fetchRelatedArticles() {
      try {
        setLoading(true)
        setError(null)

        // Primeiro, tentar buscar artigos da mesma categoria
        let categoryArticles = []
        if (currentArticle.category) {
          try {
            const categoryResponse = await axios.get("http://localhost:3001/api/noticias", {
              params: {
                category: currentArticle.category,
                limit: 6, // Buscar mais para ter opções após filtrar
                orderBy: "published_at",
                order: "DESC",
              },
            })
            categoryArticles = categoryResponse.data.noticias || []
          } catch (categoryError) {
            console.warn("Erro ao buscar artigos da categoria:", categoryError)
          }
        }

        // Filtrar o artigo atual dos resultados da categoria
        const filteredCategoryArticles = categoryArticles.filter((article) => article.id !== currentArticle.id)

        // Se não temos artigos suficientes da mesma categoria, buscar artigos recentes
        let recentArticles = []
        if (filteredCategoryArticles.length < 4) {
          try {
            const recentResponse = await axios.get("http://localhost:3001/api/noticias", {
              params: {
                limit: 8, // Buscar mais para ter opções
                orderBy: "published_at",
                order: "DESC",
              },
            })
            recentArticles = recentResponse.data.noticias || []
          } catch (recentError) {
            console.warn("Erro ao buscar artigos recentes:", recentError)
          }
        }

        // Filtrar artigos recentes para remover o artigo atual e os já incluídos da categoria
        const filteredRecentArticles = recentArticles.filter(
          (article) =>
            article.id !== currentArticle.id &&
            !filteredCategoryArticles.some((catArticle) => catArticle.id === article.id),
        )

        // Combinar artigos da categoria com artigos recentes
        const combinedArticles = [...filteredCategoryArticles, ...filteredRecentArticles]

        // Limitar a 4 artigos
        const finalArticles = combinedArticles.slice(0, 4)

        setRelatedArticles(finalArticles)
      } catch (err) {
        console.error("Erro ao buscar artigos relacionados:", err)
        setError("Não foi possível carregar os artigos relacionados.")
      } finally {
        setLoading(false)
      }
    }

    if (currentArticle?.id) {
      fetchRelatedArticles()
    }
  }, [currentArticle])

  // Formatar data para exibição
  const formatDate = (dateString) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  // Não renderizar se não há artigos ou se está carregando/com erro
  if (loading) {
    return (
      <div className={styles.container}>
        <h2 className={styles.title}>Artigos Relacionados</h2>
        <div className={styles.loadingState}>
          <div className={styles.spinner}></div>
          <p>Carregando artigos relacionados...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={styles.container}>
        <h2 className={styles.title}>Artigos Relacionados</h2>
        <div className={styles.errorState}>
          <AlertCircle size={24} />
          <p>{error}</p>
        </div>
      </div>
    )
  }

  if (relatedArticles.length === 0) {
    return null
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Artigos Relacionados</h2>

      <div className={styles.articles}>
        {relatedArticles.map((article) => (
          <article key={article.id} className={styles.article}>
            <Link href={`/noticias/${article.slug}`}>
              <div className={styles.imageContainer}>
                <Image
                  src={article.image || "/placeholder.svg?height=200&width=300"}
                  alt={article.title}
                  fill
                  className={styles.image}
                />
              </div>
            </Link>

            <div className={styles.content}>
              <Link href={`/noticias/${article.slug}`}>
                <h3 className={styles.articleTitle}>{article.title}</h3>
              </Link>

              <div className={styles.meta}>
                <span>{article.author}</span>
                <span className={styles.separator}>•</span>
                <span>{formatDate(article.published_at || article.created_at)}</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
