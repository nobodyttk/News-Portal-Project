"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import Link from "next/link"
import {
  Plus,
  FileText,
  Users,
  Tag,
  TrendingUp,
  Eye,
  Calendar,
  BarChart3,
  Activity,
  Clock,
  CheckCircle,
  Star,
  ArrowUpRight,
  Edit3,
  Trash2,
} from "lucide-react"
import styles from "./admin-dashboard.module.css"

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalNoticias: 0,
    noticiasPublicadas: 0,
    noticiasRascunho: 0,
    noticiasDestaque: 0,
    totalViews: 0,
    totalAutores: 0,
    totalCategorias: 0,
    totalTags: 0,
  })
  const [recentNoticias, setRecentNoticias] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const [noticiasRes, autoresRes, categoriasRes, tagsRes] = await Promise.all([
        axios.get("http://localhost:3001/api/noticias?limit=5&orderBy=created_at&order=DESC"),
        axios.get("http://localhost:3001/api/autores"),
        axios.get("http://localhost:3001/api/categorias"),
        axios.get("http://localhost:3001/api/tags"),
      ])

      const noticias = noticiasRes.data.noticias
      const autores = autoresRes.data
      const categorias = categoriasRes.data
      const tags = tagsRes.data

      // Calcular estatísticas
      const totalViews = noticias.reduce((sum, noticia) => sum + (noticia.views || 0), 0)
      const noticiasPublicadas = noticias.filter((n) => n.status === "publicado").length
      const noticiasRascunho = noticias.filter((n) => n.status === "rascunho").length
      const noticiasDestaque = noticias.filter((n) => n.destaque).length

      setStats({
        totalNoticias: noticias.length,
        noticiasPublicadas,
        noticiasRascunho,
        noticiasDestaque,
        totalViews,
        totalAutores: autores.length,
        totalCategorias: categorias.length,
        totalTags: tags.length,
      })

      setRecentNoticias(noticias.slice(0, 5))
    } catch (error) {
      console.error("Erro ao buscar dados do dashboard:", error)
    } finally {
      setLoading(false)
    }
  }

  const deleteNoticia = async (id, title) => {
    if (!confirm(`Deseja realmente excluir a notícia "${title}"?`)) return
    try {
      await axios.delete(`http://localhost:3001/api/noticias/${id}`)
      fetchDashboardData() // Recarregar dados
    } catch (error) {
      console.error("Erro ao deletar:", error)
      alert("Erro ao deletar a notícia. Tente novamente.")
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return "Não definida"
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Carregando dashboard...</p>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.welcomeSection}>
          <h1 className={styles.title}>Dashboard</h1>
          <p className={styles.subtitle}>Bem-vindo ao painel administrativo do GameVicio</p>
        </div>
        <div className={styles.headerActions}>
          <Link href="/admin/noticias/" className={styles.primaryButton}>
            <Plus size={20} />
            <span>Nova Notícia</span>
          </Link>
        </div>
      </div>

      {/* Estatísticas Principais */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <FileText size={24} />
          </div>
          <div className={styles.statContent}>
            <span className={styles.statNumber}>{stats.totalNoticias}</span>
            <span className={styles.statLabel}>Total de Notícias</span>
          </div>
          <div className={styles.statTrend}>
            <TrendingUp size={16} />
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.statIconSuccess}`}>
            <CheckCircle size={24} />
          </div>
          <div className={styles.statContent}>
            <span className={styles.statNumber}>{stats.noticiasPublicadas}</span>
            <span className={styles.statLabel}>Publicadas</span>
          </div>
          <div className={styles.statTrend}>
            <TrendingUp size={16} />
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.statIconWarning}`}>
            <Clock size={24} />
          </div>
          <div className={styles.statContent}>
            <span className={styles.statNumber}>{stats.noticiasRascunho}</span>
            <span className={styles.statLabel}>Rascunhos</span>
          </div>
          <div className={styles.statTrend}>
            <Activity size={16} />
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.statIconPrimary}`}>
            <Eye size={24} />
          </div>
          <div className={styles.statContent}>
            <span className={styles.statNumber}>{stats.totalViews.toLocaleString()}</span>
            <span className={styles.statLabel}>Visualizações</span>
          </div>
          <div className={styles.statTrend}>
            <TrendingUp size={16} />
          </div>
        </div>
      </div>

      {/* Ações Rápidas e Estatísticas Secundárias */}
      <div className={styles.contentGrid}>
        {/* Ações Rápidas */}
        <div className={styles.quickActions}>
          <h2 className={styles.sectionTitle}>Ações Rápidas</h2>
          <div className={styles.actionsList}>
            <Link href="/admin/noticias/adicionar" className={styles.actionCard}>
              <div className={styles.actionIcon}>
                <Plus size={20} />
              </div>
              <div className={styles.actionContent}>
                <span className={styles.actionTitle}>Nova Notícia</span>
                <span className={styles.actionDescription}>Criar uma nova notícia</span>
              </div>
              <ArrowUpRight size={16} className={styles.actionArrow} />
            </Link>

            <Link href="/admin/noticias" className={styles.actionCard}>
              <div className={styles.actionIcon}>
                <FileText size={20} />
              </div>
              <div className={styles.actionContent}>
                <span className={styles.actionTitle}>Gerenciar Notícias</span>
                <span className={styles.actionDescription}>Ver todas as notícias</span>
              </div>
              <ArrowUpRight size={16} className={styles.actionArrow} />
            </Link>

            <Link href="/admin/categorias" className={styles.actionCard}>
              <div className={styles.actionIcon}>
                <Tag size={20} />
              </div>
              <div className={styles.actionContent}>
                <span className={styles.actionTitle}>Categorias</span>
                <span className={styles.actionDescription}>Gerenciar categorias</span>
              </div>
              <ArrowUpRight size={16} className={styles.actionArrow} />
            </Link>

            <Link href="/admin/autores" className={styles.actionCard}>
              <div className={styles.actionIcon}>
                <Users size={20} />
              </div>
              <div className={styles.actionContent}>
                <span className={styles.actionTitle}>Autores</span>
                <span className={styles.actionDescription}>Gerenciar autores</span>
              </div>
              <ArrowUpRight size={16} className={styles.actionArrow} />
            </Link>
          </div>
        </div>

        {/* Estatísticas Secundárias */}
        <div className={styles.secondaryStats}>
          <h2 className={styles.sectionTitle}>Resumo do Sistema</h2>
          <div className={styles.secondaryStatsGrid}>
            <div className={styles.secondaryStatCard}>
              <Users size={20} />
              <div>
                <span className={styles.secondaryStatNumber}>{stats.totalAutores}</span>
                <span className={styles.secondaryStatLabel}>Autores</span>
              </div>
            </div>
            <div className={styles.secondaryStatCard}>
              <Tag size={20} />
              <div>
                <span className={styles.secondaryStatNumber}>{stats.totalCategorias}</span>
                <span className={styles.secondaryStatLabel}>Categorias</span>
              </div>
            </div>
            <div className={styles.secondaryStatCard}>
              <BarChart3 size={20} />
              <div>
                <span className={styles.secondaryStatNumber}>{stats.totalTags}</span>
                <span className={styles.secondaryStatLabel}>Tags</span>
              </div>
            </div>
            <div className={styles.secondaryStatCard}>
              <Star size={20} />
              <div>
                <span className={styles.secondaryStatNumber}>{stats.noticiasDestaque}</span>
                <span className={styles.secondaryStatLabel}>Em Destaque</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Notícias Recentes */}
      <div className={styles.recentSection}>
        <div className={styles.recentHeader}>
          <h2 className={styles.sectionTitle}>Notícias Recentes</h2>
          <Link href="/admin/noticias" className={styles.viewAllLink}>
            Ver todas
            <ArrowUpRight size={16} />
          </Link>
        </div>

        {recentNoticias.length === 0 ? (
          <div className={styles.emptyState}>
            <FileText size={48} className={styles.emptyIcon} />
            <h3 className={styles.emptyTitle}>Nenhuma notícia encontrada</h3>
            <p className={styles.emptyText}>Comece criando sua primeira notícia.</p>
            <Link href="/admin/noticias/adicionar" className={styles.emptyButton}>
              <Plus size={20} />
              <span>Criar Primeira Notícia</span>
            </Link>
          </div>
        ) : (
          <div className={styles.recentList}>
            {recentNoticias.map((noticia) => (
              <div key={noticia.id} className={styles.recentCard}>
                <div className={styles.recentCardContent}>
                  <div className={styles.recentCardHeader}>
                    <h3 className={styles.recentCardTitle}>{noticia.title}</h3>
                    <div className={styles.recentCardMeta}>
                      <span className={`${styles.statusBadge} ${styles[`status${noticia.status}`]}`}>
                        {noticia.status === "publicado" ? <CheckCircle size={12} /> : <Clock size={12} />}
                        {noticia.status === "publicado" ? "Publicado" : "Rascunho"}
                      </span>
                      {noticia.destaque && <span className={styles.destaqueBadge}>⭐</span>}
                    </div>
                  </div>
                  <p className={styles.recentCardExcerpt}>{noticia.excerpt}</p>
                  <div className={styles.recentCardInfo}>
                    <span className={styles.recentCardDate}>
                      <Calendar size={14} />
                      {formatDate(noticia.published_at || noticia.created_at)}
                    </span>
                    {noticia.views && (
                      <span className={styles.recentCardViews}>
                        <Eye size={14} />
                        {noticia.views} visualizações
                      </span>
                    )}
                  </div>
                </div>
                <div className={styles.recentCardActions}>
                  <Link href={`/admin/noticias/editar/${noticia.id}`} className={styles.recentActionButton}>
                    <Edit3 size={16} />
                  </Link>
                  <button
                    onClick={() => deleteNoticia(noticia.id, noticia.title)}
                    className={`${styles.recentActionButton} ${styles.deleteButton}`}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
