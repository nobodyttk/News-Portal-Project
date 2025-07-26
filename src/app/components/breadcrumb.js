import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"
import styles from "./breadcrumb.module.css"

export function Breadcrumb({ category, title }) {
  return (
    <nav className={styles.breadcrumb} aria-label="Breadcrumb">
      <ol className={styles.list}>
        <li className={styles.item}>
          <Link href="/" className={styles.link}>
            <Home size={16} />
            <span>Início</span>
          </Link>
        </li>
        <li className={styles.separator}>
          <ChevronRight size={16} />
        </li>
        <li className={styles.item}>
          <Link href="/noticias" className={styles.link}>
            {category}
          </Link>
        </li>
        <li className={styles.separator}>
          <ChevronRight size={16} />
        </li>
        <li className={styles.current} aria-current="page">
          {title.length > 50 ? `${title.substring(0, 50)}...` : title}
        </li>
      </ol>
    </nav>
  )
}
