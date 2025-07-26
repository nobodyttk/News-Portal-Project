"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Search, Calendar, User, Tag, ArrowLeft, AlertCircle } from "lucide-react"
import { Pagination } from "./pagination"
import axios from "axios"
import styles from "./category-listing.module.css"

const ITEMS_PER_PAGE = 6

export function CategoryListing({ category, initialPage = 1, initialSearch = "", title, subtitle, icon }) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [currentPage, setCurrentPage] = useState(initialPage)
  const [searchTerm, setSearchTerm] = useState(initialSearch)

  // Estados para API
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [totalItems, setTotalItems] = useState(0)

  // Buscar notícias da API por categoria
  useEffect(() => {
    async function fetchCategoryNews() {
      try {
        setLoading(true)
        setError(null)

        // Construir parâmetros da API
        const params = new URLSearchParams()
        params.set("page", currentPage.toString())
        params.set("limit", ITEMS_PER_PAGE.toString())
        params.set("category", category)

        // Adicionar busca se existir
        if (searchTerm) {
          params.set("search", searchTerm)
        }

        // Fazer a requisição
        const response = await axios.get(`http://localhost:3001/api/noticias?${params.toString()}`)

        // Atualizar estados com os dados da API
        setNews(response.data.noticias || [])
        setTotalItems(response.data.pagination?.total || 0)
      } catch (err) {
        console.error("Erro ao buscar notícias da categoria:", err)
        setError("Não foi possível carregar as notícias desta categoria. Tente novamente mais tarde.")
      } finally {
        setLoading(false)
      }
    }

    fetchCategoryNews()
  }, [currentPage, searchTerm, category])

  // Calcular paginação com base nos dados da API
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE)

  // Atualizar URL quando filtros mudarem
  useEffect(() => {
    const params = new URLSearchParams()
    if (currentPage > 1) params.set("page", currentPage.toString())
    if (searchTerm) params.set("search", searchTerm)

    const categoryPath = category.toLowerCase()
    const newUrl = `/${categoryPath}${params.toString() ? `?${params.toString()}` : ""}`
    router.push(newUrl, { scroll: false })
  }, [currentPage, searchTerm, router, category])

  // Reset página quando busca mudar
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm])

  const handleSearch = (e) => {
    e.preventDefault()
    // A busca já é feita em tempo real através do useEffect
  }

  const getCategoryColor = () => {
    switch (category) {
      case "GAMES":
        return "#dc2626" // Vermelho
      case "OTAKU":
        return "#7c3aed" // Roxo
      case "ENTRETENIMENTO":
        return "#059669" // Verde
      case "TECNOLOGIA":
        return "#2563eb" // Azul
      default:
        return "#dc2626"
    }
  }

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
    <div className={styles.container}>
      <div className={styles.header}>
        <Link href="/" className={styles.backButton}>
          <ArrowLeft size={20} />
          <span>Voltar ao início</span>
        </Link>

        <div className={styles.titleSection}>
          <div className={styles.categoryIcon} style={{ backgroundColor: getCategoryColor() }}>
            {icon}
          </div>
          <h1 className={styles.title} style={{ color: getCategoryColor() }}>
            {title}
          </h1>
          <p className={styles.subtitle}>{subtitle}</p>
        </div>

        <div className={styles.controls}>
          <form onSubmit={handleSearch} className={styles.searchForm}>
            <div className={styles.searchContainer}>
              <Search className={styles.searchIcon} size={20} />
              <input
                type="text"
                placeholder={`Buscar em ${title}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={styles.searchInput}
              />
            </div>
          </form>
        </div>
      </div>

      <div className={styles.results}>
        <p className={styles.resultsText}>
          {totalItems} {totalItems === 1 ? "artigo encontrado" : "artigos encontrados"}
          {searchTerm && ` para "${searchTerm}"`}
        </p>
      </div>

      {/* Estado de carregamento */}
      {loading && (
        <div className={styles.loadingState}>
          <div className={styles.spinner} style={{ borderTopColor: getCategoryColor() }}></div>
          <p>Carregando artigos de {title}...</p>
        </div>
      )}

      {/* Estado de erro */}
      {error && (
        <div className={styles.errorState}>
          <AlertCircle size={32} style={{ color: getCategoryColor() }} />
          <h3>Erro ao carregar artigos</h3>
          <p>{error}</p>
          <button
            onClick={() => {
              setCurrentPage(1)
              setSearchTerm("")
            }}
            className={styles.clearFilters}
            style={{ backgroundColor: getCategoryColor() }}
          >
            Tentar novamente
          </button>
        </div>
      )}

      {/* Lista de notícias */}
      {!loading && !error && (
        <div className={styles.newsGrid}>
          {news.map((article) => (
            <article key={article.id} className={styles.newsCard}>
              <Link href={`/noticias/${article.slug}`}>
                <div className={styles.imageContainer}>
                  <Image
                    src={article.image || "/placeholder.svg?height=300&width=500"}
                    alt={article.title}
                    fill
                    className={styles.image}
                  />
                  <div className={styles.categoryBadge} style={{ backgroundColor: getCategoryColor() }}>
                    <Tag size={12} />
                    <span>#{article.category}</span>
                  </div>
                </div>
              </Link>

              <div className={styles.cardContent}>
                <Link href={`/noticias/${article.slug}`}>
                  <h2 className={styles.cardTitle}>{article.title}</h2>
                </Link>

                <p className={styles.cardExcerpt}>{article.excerpt}</p>

                <div className={styles.cardMeta}>
                  <div className={styles.metaItem}>
                    <User size={14} />
                    <span>Por {article.author}</span>
                  </div>
                  <div className={styles.metaItem}>
                    <Calendar size={14} />
                    <span>{formatDate(article.published_at || article.created_at)}</span>
                  </div>
                </div>

                <Link
                  href={`/noticias/${article.slug}`}
                  className={styles.readMore}
                  style={{ color: getCategoryColor() }}
                >
                  Ler mais
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Estado vazio */}
      {!loading && !error && news.length === 0 && (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>{icon}</div>
          <h3 className={styles.emptyTitle}>Nenhum artigo encontrado</h3>
          <p className={styles.emptyText}>
            {searchTerm
              ? `Não encontramos artigos de ${title} com o termo "${searchTerm}". Tente uma busca diferente.`
              : `Ainda não temos artigos na categoria ${title}. Volte em breve para conferir as novidades!`}
          </p>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className={styles.clearFilters}
              style={{ backgroundColor: getCategoryColor() }}
            >
              Limpar busca
            </button>
          )}
        </div>
      )}

      {/* Paginação */}
      {!loading && !error && totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          accentColor={getCategoryColor()}
        />
      )}
    </div>
  )
}
