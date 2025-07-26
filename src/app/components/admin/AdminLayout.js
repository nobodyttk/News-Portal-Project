"use client"

import Head from "next/head"
import Link from "next/link"
import { useState } from "react"
import { Home, Plus, FileText, Users, Tag, Settings, Menu, X, BarChart3, Folder } from "lucide-react"
import styles from "./AdminLayout.module.css"

export default function AdminLayout({ children, title = "Painel Administrativo" }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const menuItems = [
    { href: "/admin", icon: BarChart3, label: "Dashboard" },
    { href: "/admin/noticias/adicionar", icon: Plus, label: "Adicionar Notícia" },
    { href: "/admin/noticias", icon: FileText, label: "Listar Notícias" },
    { href: "/admin/categorias", icon: Folder, label: "Categorias" },
    { href: "/admin/autores", icon: Users, label: "Autores" },
    { href: "/admin/tags", icon: Tag, label: "Tags" },
    { href: "/admin/configuracoes", icon: Settings, label: "Configurações" },
  ]

  return (
    <div className={styles.container}>
      <Head>
        <title>{title} | GameVicio Admin</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Mobile Menu Button */}
      <button
        className={`${styles.mobileMenuButton} ${sidebarOpen ? styles.hidden : ""}`}
        onClick={() => setSidebarOpen(true)}
      >
        <Menu size={24} />
      </button>

      {/* Overlay for mobile */}
      {sidebarOpen && <div className={styles.overlay} onClick={() => setSidebarOpen(false)} />}

      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ""}`}>
        <div className={styles.sidebarHeader}>
          <Link href="/" className={styles.logo}>
            <div className={styles.logoContainer}>
              <span className={styles.logoGame}>GAME</span>
              <span className={styles.logoVicio}>VICIO</span>
            </div>
            <span className={styles.adminText}>Admin</span>
          </Link>

          <button className={styles.closeMobile} onClick={() => setSidebarOpen(false)}>
            <X size={24} />
          </button>
        </div>

        <nav className={styles.navigation}>
          <ul className={styles.menuList}>
            {menuItems.map((item) => (
              <li key={item.href} className={styles.menuItem}>
                <Link href={item.href} className={styles.menuLink} onClick={() => setSidebarOpen(false)}>
                  <item.icon size={20} />
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.sidebarFooter}>
          <Link href="/" className={styles.backToSite} onClick={() => setSidebarOpen(false)}>
            <Home size={18} />
            <span>Voltar para o Site</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className={styles.mainContent}>
        <div className={styles.contentWrapper}>{children}</div>
      </main>
    </div>
  )
}
