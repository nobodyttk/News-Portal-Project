import Link from "next/link";
import Image from "next/image";
import styles from "./sidebar-news.module.css";

// ✅ Função async para Server Component
export async function SidebarNews() {
  const res = await fetch("http://localhost:3001/api/noticias", {
    cache: "no-store", // Recomendado para dados atualizados
  });

  if (!res.ok) {
    throw new Error("Falha ao carregar os destaques");
  }

  const data = await res.json();

  // 🔥 Filtrar notícias com destaque === true
  const highlights = data.noticias.filter((item) => item.destaque === true);

  return (
    <aside className={styles.sidebar}>
      <div className={styles.header}>
        <h2 className={styles.title}>DESTAQUES</h2>
      </div>

      <div className={styles.newsContainer}>
        {highlights.map((article) => (
          <article key={article.id} className={styles.newsCard}>
            <Link href={`/noticias/${article.slug}`}>
              <div className={styles.imageContainer}>
                <Image
                  src={article.image || "/placeholder.svg?height=200&width=300"}
                  alt={article.title}
                  fill
                  className={styles.image}
                />
              </div>
            </Link>
            <div className={styles.content}>
              <Link href={`/noticias/${article.slug}`}>
                <h3 className={styles.articleTitle}>{article.title}</h3>
              </Link>
              <div className={styles.meta}>
                <span>Por {article.author}</span>
                <span className={styles.separator}>|</span>
                <span>
                  Em {new Date(article.published_at).toLocaleDateString("pt-BR")}
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </aside>
  );
}
