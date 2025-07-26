import Link from "next/link";
import Image from "next/image";
import styles from "./latest-news.module.css";

export async function LatestNews() {
  const res = await fetch("http://localhost:3001/api/noticias", {
    cache: "no-store", // Faz SSR sempre atualizado
  });

  const data = await res.json();
  const news = data.noticias;

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <div className={styles.titleContainer}>
          <h2 className={styles.title}>Últimas Publicações</h2>
          <div className={styles.titleUnderline}></div>
        </div>
        <Link href="/noticias" className={styles.viewMore}>
          VEJA MAIS
        </Link>
      </div>

      <div className={styles.newsContainer}>
        {news.map((article) => (
          <article key={article.id} className={styles.newsCard}>
            <div className={styles.cardContent}>
              <div className={styles.imageContainer}>
                <Link href={`/noticias/${article.slug}`}>
                  <div className={styles.imageWrapper}>
                    <Image
                      src={article.image || "/placeholder.svg?height=400&width=600"}
                      alt={article.title}
                      fill
                      className={styles.image}
                    />
                    {article.category && (
                      <span
                        className={styles.badge}
                        style={{ backgroundColor: article.category_color }}
                      >
                        {article.category_icon} {article.category}
                      </span>
                    )}
                  </div>
                </Link>
              </div>
              <div className={styles.textContent}>
                <Link href={`/noticias/${article.slug}`}>
                  <h3 className={styles.articleTitle}>{article.title}</h3>
                </Link>
                <p className={styles.excerpt}>{article.excerpt}</p>
                <div className={styles.meta}>
                  <span>Por {article.author}</span>
                  <span className={styles.separator}>|</span>
                  <span>
                    Em {new Date(article.published_at).toLocaleDateString("pt-BR")}
                  </span>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
