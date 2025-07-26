// components/news-listing.jsx
"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Search, Filter, Calendar, User, Tag, AlertCircle } from "lucide-react"
import { Pagination } from "./pagination"
import axios from "axios"
import styles from "./news-listing.module.css"

const ITEMS_PER_PAGE = 6
const CATEGORIES = ["all", "GAMES", "ENTRETENIMENTO", "TECNOLOGIA", "OTAKU"]

export function NewsListing({
  initialPage = 1,
  initialCategory = "all",
  initialSearch = "",
  initialNews = [], // Novos props para os dados iniciais
  initialTotalItems = 0, // Novo prop para o total de itens inicial
  initialError = null, // Novo prop para o erro inicial
}) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [currentPage, setCurrentPage] = useState(initialPage)
  const [selectedCategory, setSelectedCategory] = useState(initialCategory)
  const [searchTerm, setSearchTerm] = useState(initialSearch)
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  // Estados para API - agora inicializados com os dados do SSR
  const [news, setNews] = useState(initialNews)
  const [loading, setLoading] = useState(false) // Começa como false, pois já temos os dados iniciais
  const [error, setError] = useState(initialError)
  const [totalItems, setTotalItems] = useState(initialTotalItems)

  // Buscar notícias da API - Este useEffect agora lida com as **interações do cliente**
  // Ele só será executado quando currentPage, selectedCategory ou searchTerm mudarem
  // *APÓS* a primeira renderização.
  useEffect(() => {
    // Evita a busca na primeira renderização se os dados já vieram do SSR
    // A menos que haja uma mudança de página, categoria ou busca *no lado do cliente*.
    // Podemos comparar com os valores iniciais para decidir se deve buscar.
    const hasChangedFromInitial =
      currentPage !== initialPage || selectedCategory !== initialCategory || searchTerm !== initialSearch

    if (hasChangedFromInitial || (!initialNews.length && !initialError)) { // Força a busca se não houver dados iniciais ou se houve alteração
      async function fetchNews() {
        try {
          setLoading(true)
          setError(null)

          const params = new URLSearchParams()
          params.set("page", currentPage.toString())
          params.set("limit", ITEMS_PER_PAGE.toString())

          if (selectedCategory !== "all") {
            params.set("category", selectedCategory)
          }

          if (searchTerm) {
            params.set("search", searchTerm)
          }

          const response = await axios.get(`http://localhost:3001/api/noticias?${params.toString()}`)

          setNews(response.data.noticias || [])
          setTotalItems(response.data.pagination?.total || 0)
        } catch (err) {
          console.error("Erro ao buscar notícias:", err)
          setError("Não foi possível carregar as notícias. Tente novamente mais tarde.")
        } finally {
          setLoading(false)
        }
      }

      fetchNews()
    }
  }, [currentPage, selectedCategory, searchTerm, initialPage, initialCategory, initialSearch, initialNews, initialError]) // Dependências atualizadas

  // Calcular paginação com base nos dados da API
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE)

  // Atualizar URL quando filtros mudarem
  useEffect(() => {
    const params = new URLSearchParams()
    if (currentPage > 1) params.set("page", currentPage.toString())
    if (selectedCategory !== "all") params.set("category", selectedCategory)
    if (searchTerm) params.set("search", searchTerm)

    const newUrl = `/noticias${params.toString() ? `?${params.toString()}` : ""}`
    // replace em vez de push para não encher o histórico do navegador com cada mudança
    router.replace(newUrl, { scroll: false })
  }, [currentPage, selectedCategory, searchTerm, router])

  // Reset página quando filtros mudarem
  useEffect(() => {
    // Este useEffect ainda é útil para redefinir a página para 1
    // quando a categoria ou termo de busca são alterados pelo usuário no cliente.
    setCurrentPage(1)
  }, [selectedCategory, searchTerm])

  const handleSearch = (e) => {
    e.preventDefault()
    // A busca já é feita em tempo real através do useEffect
  }

  const handleCategoryChange = (category) => {
    setSelectedCategory(category)
    setIsFilterOpen(false)
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
        <div className={styles.titleSection}>
          <h1 className={styles.title}>Últimas Notícias</h1>
          <p className={styles.subtitle}>Confira todas as novidades do mundo dos games e entretenimento</p>
        </div>

        <div className={styles.controls}>
          <form onSubmit={handleSearch} className={styles.searchForm}>
            <div className={styles.searchContainer}>
              <Search className={styles.searchIcon} size={20} />
              <input
                type="text"
                placeholder="Buscar notícias..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={styles.searchInput}
              />
            </div>
          </form>

          <div className={styles.filterContainer}>
            <button onClick={() => setIsFilterOpen(!isFilterOpen)} className={styles.filterButton}>
              <Filter size={20} />
              <span>Filtros</span>
            </button>

            {isFilterOpen && (
              <div className={styles.filterDropdown}>
                {CATEGORIES.map((category) => (
                  <button
                    key={category}
                    onClick={() => handleCategoryChange(category)}
                    className={`${styles.filterOption} ${selectedCategory === category ? styles.active : ""}`}
                  >
                    {category === "all" ? "Todas as Categorias" : `#${category}`}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className={styles.results}>
        <p className={styles.resultsText}>
          {totalItems} {totalItems === 1 ? "notícia encontrada" : "notícias encontradas"}
          {selectedCategory !== "all" && ` em #${selectedCategory}`}
          {searchTerm && ` para "${searchTerm}"`}
        </p>
      </div>

      {/* Estado de carregamento */}
      {loading && (
        <div className={styles.loadingState}>
          <div className={styles.spinner}></div>
          <p>Carregando notícias...</p>
        </div>
      )}

      {/* Estado de erro */}
      {error && (
        <div className={styles.errorState}>
          <AlertCircle size={32} />
          <h3>Erro ao carregar notícias</h3>
          <p>{error}</p>
          <button
            onClick={() => {
              setCurrentPage(1)
              setSelectedCategory("all")
              setSearchTerm("")
              // Force a nova busca limpando o erro e setando loading para true
              setError(null);
              setLoading(true);
              // O useEffect detectará a mudança de estado e fará a nova busca.
            }}
            className={styles.clearFilters}
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
                  <div className={styles.categoryBadge}>
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

                <Link href={`/noticias/${article.slug}`} className={styles.readMore}>
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
          <div className={styles.emptyIcon}>📰</div>
          <h3 className={styles.emptyTitle}>Nenhuma notícia encontrada</h3>
          <p className={styles.emptyText}>Tente ajustar os filtros ou termos de busca para encontrar o que procura.</p>
          <button
            onClick={() => {
              setSearchTerm("")
              setSelectedCategory("all")
            }}
            className={styles.clearFilters}
          >
            Limpar filtros
          </button>
        </div>
      )}

      {/* Paginação */}
      {!loading && !error && totalPages > 1 && (
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      )}
    </div>
  )
}