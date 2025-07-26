"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Calendar, User, Tag, AlertCircle } from "lucide-react"
import axios from "axios"
import styles from "./entertainment-section.module.css"

export function EntertainmentSection() {
  const [entertainmentData, setEntertainmentData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Buscar notícias de entretenimento da API
  useEffect(() => {
    async function fetchEntertainmentNews() {
      try {
        setLoading(true)
        setError(null)

        // Fazer a requisição para a API com filtro de categoria
        const response = await axios.get("http://localhost:3001/api/noticias", {
          params: {
            category: "ENTRETENIMENTO",
            limit: 4, // Limitar a 4 artigos como estava antes
            orderBy: "published_at",
            order: "DESC",
          },
        })

        // Atualizar estado com os dados da API
        setEntertainmentData(response.data.noticias || [])
      } catch (err) {
        console.error("Erro ao buscar notícias de entretenimento:", err)
        setError("Não foi possível carregar as notícias de entretenimento.")
      } finally {
        setLoading(false)
      }
    }

    fetchEntertainmentNews()
  }, [])

  // Formatar data para exibição
  const formatDate = (dateString) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <div className={styles.titleContainer}>
          <h2 className={styles.title}>Entretenimento</h2>
          <div className={styles.titleUnderline}></div>
        </div>
        <Link href="/entretenimento" className={styles.viewMore}>
          VEJA MAIS
        </Link>
      </div>

      {/* Estado de carregamento */}
      {loading && (
        <div className={styles.loadingState}>
          <div className={styles.spinner}></div>
          <p>Carregando notícias de entretenimento...</p>
        </div>
      )}

      {/* Estado de erro */}
      {error && (
        <div className={styles.errorState}>
          <AlertCircle size={32} />
          <h3>Erro ao carregar</h3>
          <p>{error}</p>
          <button onClick={() => window.location.reload()} className={styles.retryButton}>
            Tentar novamente
          </button>
        </div>
      )}

      {/* Grid de notícias */}
      {!loading && !error && (
        <>
          {entertainmentData.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>🎬</div>
              <h3 className={styles.emptyTitle}>Nenhuma notícia de entretenimento</h3>
              <p className={styles.emptyText}>
                Ainda não temos notícias de entretenimento. Volte em breve para conferir as novidades!
              </p>
            </div>
          ) : (
            <div className={styles.grid}>
              {entertainmentData.map((article) => (
                <article key={article.id} className={styles.card}>
                  <div className={styles.imageContainer}>
                    <Link href={`/noticias/${article.slug}`}>
                      <div className={styles.imageWrapper}>
                        <Image
                          src={article.image || "/placeholder.svg?height=300&width=500"}
                          alt={article.title}
                          fill
                          className={styles.image}
                        />
                        {article.category && (
                          <span className={styles.badge}>
                            <Tag size={12} />#{article.category}
                          </span>
                        )}
                      </div>
                    </Link>
                  </div>
                  <div className={styles.content}>
                    <Link href={`/noticias/${article.slug}`}>
                      <h3 className={styles.articleTitle}>{article.title}</h3>
                    </Link>
                    <p className={styles.articleExcerpt}>{article.excerpt}</p>
                    <div className={styles.meta}>
                      <div className={styles.metaItem}>
                        <User size={14} />
                        <span>Por {article.author}</span>
                      </div>
                      <div className={styles.metaItem}>
                        <Calendar size={14} />
                        <span>{formatDate(article.published_at || article.created_at)}</span>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </>
      )}
    </section>
  )
}
