"use client"

import { useState, useEffect } from "react"
import { Save, Eye, EyeOff, Calendar, ImageIcon, Tag, User, Folder } from "lucide-react"
import styles from "./NoticiaForm.module.css"

export default function NoticiaForm({ initialData = {}, onSubmit, isEditing = false }) {
  const [title, setTitle] = useState(initialData.title || "")
  const [excerpt, setExcerpt] = useState(initialData.excerpt || "")
  const [content, setContent] = useState(initialData.content || "")
  const [image, setImage] = useState(initialData.image || "")
  const [authorId, setAuthorId] = useState(initialData.author_id || "")
  const [categoryId, setCategoryId] = useState(initialData.category_id || "")
  const [destaque, setDestaque] = useState(initialData.destaque || false)
  const [status, setStatus] = useState(initialData.status || "rascunho")
  const [selectedTags, setSelectedTags] = useState(initialData.tags || [])
  const [publishedAt, setPublishedAt] = useState(
    initialData.published_at ? new Date(initialData.published_at).toISOString().slice(0, 16) : "",
  )

  const [authors, setAuthors] = useState([])
  const [categories, setCategories] = useState([])
  const [allTags, setAllTags] = useState([])
  const [loadingOptions, setLoadingOptions] = useState(true)
  const [errorOptions, setErrorOptions] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    async function fetchOptions() {
      try {
        setLoadingOptions(true)
        const [authorsRes, categoriesRes, tagsRes] = await Promise.all([
          fetch("http://localhost:3001/api/autores"),
          fetch("http://localhost:3001/api/categorias"),
          fetch("http://localhost:3001/api/tags"),
        ])

        if (!authorsRes.ok || !categoriesRes.ok || !tagsRes.ok) {
          throw new Error("Falha ao carregar opções (autores, categorias, tags).")
        }

        const authorsData = await authorsRes.json()
        const categoriesData = await categoriesRes.json()
        const tagsData = await tagsRes.json()

        setAuthors(authorsData)
        setCategories(categoriesData)
        setAllTags(tagsData)
      } catch (err) {
        console.error("Erro ao carregar opções:", err)
        setErrorOptions("Erro ao carregar opções. Tente novamente.")
      } finally {
        setLoadingOptions(false)
      }
    }
    fetchOptions()
  }, [])

  const handleTagChange = (tagId) => {
    setSelectedTags((prev) => {
      if (prev.includes(tagId)) {
        return prev.filter((id) => id !== tagId)
      } else {
        return [...prev, tagId]
      }
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = {
      title,
      excerpt,
      content,
      image,
      author_id: authorId ? Number.parseInt(authorId, 10) : null,
      category_id: categoryId ? Number.parseInt(categoryId, 10) : null,
      destaque: Boolean(destaque),
      status,
      tags: selectedTags
        .map((id) => {
          const tag = allTags.find((t) => t.id === id)
          return tag ? tag.nome : null
        })
        .filter(Boolean),
      published_at: status === "publicado" ? publishedAt || new Date().toISOString() : null,
    }

    try {
      await onSubmit(formData)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loadingOptions) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Carregando opções...</p>
      </div>
    )
  }

  if (errorOptions) {
    return (
      <div className={styles.errorContainer}>
        <p>{errorOptions}</p>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>{isEditing ? "Editar Notícia" : "Nova Notícia"}</h1>
        <p className={styles.subtitle}>
          {isEditing ? "Atualize as informações da notícia" : "Preencha os dados para criar uma nova notícia"}
        </p>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGrid}>
          {/* Título */}
          <div className={styles.formGroup}>
            <label htmlFor="title" className={styles.label}>
              <span className={styles.labelText}>Título</span>
              <span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={styles.input}
              placeholder="Digite o título da notícia"
              required
            />
          </div>

          {/* Resumo */}
          <div className={styles.formGroup}>
            <label htmlFor="excerpt" className={styles.label}>
              <span className={styles.labelText}>Resumo</span>
              <span className={styles.required}>*</span>
            </label>
            <textarea
              id="excerpt"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows="3"
              className={styles.textarea}
              placeholder="Escreva um resumo da notícia"
              required
            />
          </div>

          {/* Conteúdo */}
          <div className={styles.formGroupFull}>
            <label htmlFor="content" className={styles.label}>
              <span className={styles.labelText}>Conteúdo</span>
              <span className={styles.required}>*</span>
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows="12"
              className={styles.textarea}
              placeholder="Escreva o conteúdo completo da notícia"
              required
            />
          </div>

          {/* Imagem */}
          <div className={styles.formGroup}>
            <label htmlFor="image" className={styles.label}>
              <ImageIcon size={16} />
              <span className={styles.labelText}>URL da Imagem</span>
            </label>
            <input
              type="url"
              id="image"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className={styles.input}
              placeholder="https://exemplo.com/imagem.jpg"
            />
          </div>

          {/* Autor */}
          <div className={styles.formGroup}>
            <label htmlFor="author_id" className={styles.label}>
              <User size={16} />
              <span className={styles.labelText}>Autor</span>
            </label>
            <select
              id="author_id"
              value={authorId}
              onChange={(e) => setAuthorId(e.target.value)}
              className={styles.select}
            >
              <option value="">Selecione um autor</option>
              {authors.map((author) => (
                <option key={author.id} value={author.id}>
                  {author.nome}
                </option>
              ))}
            </select>
          </div>

          {/* Categoria */}
          <div className={styles.formGroup}>
            <label htmlFor="category_id" className={styles.label}>
              <Folder size={16} />
              <span className={styles.labelText}>Categoria</span>
            </label>
            <select
              id="category_id"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className={styles.select}
            >
              <option value="">Selecione uma categoria</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.icone} {category.nome}
                </option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div className={styles.formGroup}>
            <label htmlFor="status" className={styles.label}>
              {status === "publicado" ? <Eye size={16} /> : <EyeOff size={16} />}
              <span className={styles.labelText}>Status</span>
            </label>
            <select id="status" value={status} onChange={(e) => setStatus(e.target.value)} className={styles.select}>
              <option value="rascunho">Rascunho</option>
              <option value="publicado">Publicado</option>
            </select>
          </div>

          {/* Data de Publicação */}
          {status === "publicado" && (
            <div className={styles.formGroup}>
              <label htmlFor="published_at" className={styles.label}>
                <Calendar size={16} />
                <span className={styles.labelText}>Data de Publicação</span>
              </label>
              <input
                type="datetime-local"
                id="published_at"
                value={publishedAt}
                onChange={(e) => setPublishedAt(e.target.value)}
                className={styles.input}
              />
            </div>
          )}

          {/* Destaque */}
          <div className={styles.formGroup}>
            <div className={styles.checkboxContainer}>
              <input
                type="checkbox"
                id="destaque"
                checked={destaque}
                onChange={(e) => setDestaque(e.target.checked)}
                className={styles.checkbox}
              />
              <label htmlFor="destaque" className={styles.checkboxLabel}>
                <span className={styles.checkboxText}>Notícia em Destaque</span>
                <span className={styles.checkboxDescription}>Marque para destacar esta notícia na página inicial</span>
              </label>
            </div>
          </div>

          {/* Tags */}
          <div className={styles.formGroupFull}>
            <label className={styles.label}>
              <Tag size={16} />
              <span className={styles.labelText}>Tags</span>
            </label>
            <div className={styles.tagsContainer}>
              {allTags.map((tag) => (
                <div key={tag.id} className={styles.tagItem}>
                  <input
                    type="checkbox"
                    id={`tag-${tag.id}`}
                    checked={selectedTags.includes(tag.id)}
                    onChange={() => handleTagChange(tag.id)}
                    className={styles.tagCheckbox}
                  />
                  <label htmlFor={`tag-${tag.id}`} className={styles.tagLabel}>
                    <span className={styles.tagColor} style={{ backgroundColor: tag.cor || "#6b7280" }} />
                    <span className={styles.tagName}>{tag.nome}</span>
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className={styles.submitContainer}>
          <button type="submit" disabled={isSubmitting} className={styles.submitButton}>
            <Save size={20} />
            <span>{isSubmitting ? "Salvando..." : isEditing ? "Atualizar Notícia" : "Criar Notícia"}</span>
          </button>
        </div>
      </form>
    </div>
  )
}
