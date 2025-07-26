"use client"

import Link from "next/link"
import { ArrowLeft, Home } from "lucide-react"
import styles from "./not-found.module.css"

export default function NotFound() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.errorCode}>404</div>
        <h1 className={styles.title}>Página não encontrada</h1>
        <p className={styles.description}>Desculpe, a página que você está procurando não existe ou foi movida.</p>

        <div className={styles.actions}>
          <Link href="/" className={styles.homeButton}>
            <Home size={20} />
            <span>Voltar ao Início</span>
          </Link>

          <button onClick={() => window.history.back()} className={styles.backButton}>
            <ArrowLeft size={20} />
            <span>Página Anterior</span>
          </button>
        </div>
      </div>
    </div>
  )
}
