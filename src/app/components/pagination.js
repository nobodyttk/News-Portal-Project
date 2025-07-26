"use client"

import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"
import styles from "./pagination.module.css"

export function Pagination({ currentPage, totalPages, onPageChange, accentColor = "#dc2626" }) {
  const getVisiblePages = () => {
    const delta = 2
    const range = []
    const rangeWithDots = []

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i)
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, "...")
    } else {
      rangeWithDots.push(1)
    }

    rangeWithDots.push(...range)

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages)
    } else {
      rangeWithDots.push(totalPages)
    }

    return rangeWithDots
  }

  const visiblePages = getVisiblePages()

  if (totalPages <= 1) return null

  return (
    <nav className={styles.pagination} aria-label="Navegação de páginas">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`${styles.pageButton} ${styles.navButton}`}
        aria-label="Página anterior"
        style={{ "--accent-color": accentColor }}
      >
        <ChevronLeft size={20} />
        <span className={styles.navText}>Anterior</span>
      </button>

      <div className={styles.pageNumbers}>
        {visiblePages.map((page, index) => (
          <div key={index}>
            {page === "..." ? (
              <span className={styles.dots}>
                <MoreHorizontal size={20} />
              </span>
            ) : (
              <button
                onClick={() => onPageChange(page)}
                className={`${styles.pageButton} ${currentPage === page ? styles.active : ""}`}
                aria-label={`Página ${page}`}
                aria-current={currentPage === page ? "page" : undefined}
                style={{ "--accent-color": accentColor }}
              >
                {page}
              </button>
            )}
          </div>
        ))}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`${styles.pageButton} ${styles.navButton}`}
        aria-label="Próxima página"
        style={{ "--accent-color": accentColor }}
      >
        <span className={styles.navText}>Próxima</span>
        <ChevronRight size={20} />
      </button>
    </nav>
  )
}
