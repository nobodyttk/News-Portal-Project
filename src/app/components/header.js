"use client"

import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { ModeToggle } from "./mode-toggle"
import { Search, Menu, X } from "lucide-react"
import styles from "./header.module.css"

export default function Header() {
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  // Função para lidar com a submissão do formulário de busca
  const handleSearch = (e) => {
    e.preventDefault()

    // Verificar se o termo de busca não está vazio
    if (searchTerm.trim()) {
      // Redirecionar para a página de notícias com o parâmetro de busca
      router.push(`/noticias?search=${encodeURIComponent(searchTerm.trim())}`)

      // Fechar a caixa de busca após a submissão
      setIsSearchOpen(false)

      // Limpar o termo de busca
      setSearchTerm("")
    }
  }

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.leftSection}>
          <button className={`${styles.menuButton} ${styles.mobileOnly}`} onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <Link href="/" className={styles.logo}>
            <div className={styles.logoContainer}>
              <span className={styles.logoGame}>GAME</span>
              <span className={styles.logoVicio}>FERAL</span>
            </div>
          </Link>
        </div>

        <nav className={`${styles.nav} ${styles.desktopOnly}`}>
          <Link href="/noticias" className={styles.navLink}>
            NOTÍCIAS
          </Link>
          <Link href="/games" className={styles.navLink}>
            GAMES
          </Link>
          <Link href="/otaku" className={styles.navLink}>
            OTAKU
          </Link>
          <Link href="/entretenimento" className={styles.navLink}>
            ENTRETENIMENTO
          </Link>
         
        </nav>

        <div className={styles.rightSection}>
          {isSearchOpen ? (
            <div className={styles.searchContainer}>
              <form onSubmit={handleSearch}>
                <input
                  type="search"
                  placeholder="Pesquisar..."
                  className={styles.searchInput}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  autoFocus
                />
                <button type="submit" className={styles.searchButton}>
                  <Search size={16} />
                </button>
                <button
                  type="button"
                  className={styles.iconButton}
                  onClick={() => {
                    setIsSearchOpen(false)
                    setSearchTerm("")
                  }}
                >
                  <X size={16} />
                </button>
              </form>
            </div>
          ) : (
            <button className={styles.iconButton} onClick={() => setIsSearchOpen(true)}>
              <Search size={20} />
            </button>
          )}
          <ModeToggle />
        </div>
      </div>

      {isMenuOpen && (
        <div className={styles.mobileMenu}>
          <nav className={styles.mobileNav}>
            <Link href="/noticias" className={styles.mobileNavLink} onClick={() => setIsMenuOpen(false)}>
              NOTÍCIAS
            </Link>
            <Link href="/games" className={styles.mobileNavLink} onClick={() => setIsMenuOpen(false)}>
              GAMES
            </Link>
            <Link href="/otaku" className={styles.mobileNavLink} onClick={() => setIsMenuOpen(false)}>
              OTAKU
            </Link>
            <Link href="/entretenimento" className={styles.mobileNavLink} onClick={() => setIsMenuOpen(false)}>
              ENTRETENIMENTO
            </Link>
            

            {/* Adicionar campo de busca no menu mobile */}
            <form onSubmit={handleSearch} className={styles.mobileSearchForm}>
              <div className={styles.mobileSearchContainer}>
                <Search size={16} className={styles.mobileSearchIcon} />
                <input
                  type="search"
                  placeholder="Pesquisar no site..."
                  className={styles.mobileSearchInput}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button type="submit" className={styles.mobileSearchButton}>
                  Buscar
                </button>
              </div>
            </form>
          </nav>
        </div>
      )}
    </header>
  )
}
