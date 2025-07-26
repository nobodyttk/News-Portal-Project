import Image from "next/image"
import { Calendar, User, Tag } from "lucide-react"
import { RelatedArticles } from "./related-articles"
import { Breadcrumb } from "./breadcrumb"
import { ShareButtons } from "./share-buttons"
import styles from "./article-page.module.css"
import { DisqusComments } from "./disqus"

// Função auxiliar para verificar se é um link de imagem normal
const isImageLink = (url) => {
  return /\.(jpeg|jpg|png|gif|svg|webp)(\?.*)?$/i.test(url.trim());
};

// Função para verificar se é um link de pôster
const isPosterLink = (url) => {
  return /\.(jpeg|jpg|png|gif|svg|webp)\?type=Poster$/i.test(url.trim());
};

// Função auxiliar para obter o ID do vídeo do YouTube
const getYouTubeVideoId = (url) => {
  const regExp = /(?:https?:\/\/)?(?:www\.)?(?:m\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=|embed\/|v\/|)([\w-]{11})(?:\S+)?/i;
  const match = url.match(regExp);
  return (match && match[1]) ? match[1] : null;
};

// **NOVA FUNÇÃO AUXILIAR** para processar o texto do parágrafo
const processTextWithBold = (text, keyPrefix) => {
  const parts = [];
  // Expressão regular para encontrar texto entre ** (não-gananciosa)
  const regex = /\*\*(.*?)\*\*/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    // Adiciona o texto antes do **
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }
    // Adiciona o texto em negrito
    parts.push(
      <span key={`${keyPrefix}-bold-${parts.length}`} className={styles.highlight}>
        {match[1]}
      </span>
    );
    lastIndex = regex.lastIndex;
  }

  // Adiciona o restante do texto após o último **
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return parts;
};

export function ArticlePage({ article }) {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <Breadcrumb category="Notícias" title={article.title} />

        <article className={styles.article}>
          <header className={styles.header}>
            <div className={styles.categoryBadge}>
              <Tag size={14} />
              <span>#{article.category}</span>
            </div>

            <h1 className={styles.title}>{article.title}</h1>
            <p className={styles.excerpt}>{article.excerpt}</p>
          </header>

          <div className={styles.imageContainer}>
            <Image
              src={article.image || "/placeholder.svg?height=600&width=1200"}
              alt={article.title}
              width={1200}
              height={600}
              className={styles.image}
              priority
            />
          </div>

          <div className={styles.articleContent}>
            <div className={styles.contentText}>
              {article.content.split("\n\n").map((block, index) => {
                const trimmedBlock = block.trim();

                // 1. Prioridade para subtítulos (blocos completos em **)
                const isSubtitle = trimmedBlock.startsWith('**') && trimmedBlock.endsWith('**');
                if (isSubtitle) {
                  // Remover os asteriscos do subtítulo principal e renderizar como h2
                  const subtitleText = trimmedBlock.slice(2, -2);
                  // O subtítulo não é processado para negrito interno aqui
                  return (
                    <h2 key={index} className={styles.subtitle}>
                      {subtitleText}
                    </h2>
                  );
                }

                // 2. Verificar se é um link de pôster
                const posterLink = isPosterLink(trimmedBlock);
                if (posterLink) {
                  const cleanPosterSrc = trimmedBlock.split('?')[0];
                  return (
                    <div key={index} className={styles.posterImageContainer}>
                      <Image
                        src={cleanPosterSrc}
                        alt="Pôster incorporado"
                        width={350}
                        height={500}
                        className={styles.posterImage}
                        layout="intrinsic"
                      />
                    </div>
                  );
                }

                // 3. Verificar se é um link do YouTube
                const youTubeVideoId = getYouTubeVideoId(trimmedBlock);
                if (youTubeVideoId) {
                  return (
                    <div key={index} className={styles.videoWrapper}>
                      <iframe
                        width="800"
                        height="450"
                        src={`https://www.youtube.com/embed/${youTubeVideoId}`}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        title="Embedded YouTube video"
                      ></iframe>
                    </div>
                  );
                }

                // 4. Verificar se é um link de imagem normal
                const imageLink = isImageLink(trimmedBlock);
                if (imageLink) {
                  return (
                    <div key={index} className={styles.embeddedImageContainer}>
                      <Image
                        src={trimmedBlock}
                        alt="Imagem incorporada"
                        width={800}
                        height={450}
                        className={styles.embeddedImage}
                        layout="responsive"
                      />
                    </div>
                  );
                }

                // 5. Se não for nenhum dos acima, renderizar como parágrafo normal,
                //    mas processar seu conteúdo para encontrar **texto**
                return (
                  <p key={index} className={styles.paragraph}>
                    {processTextWithBold(block, `paragraph-${index}`)}
                  </p>
                );
              })}
            </div>

            <div className={styles.meta}>
              <div className={styles.metaItem}>
                <User size={16} />
                <span>Por {article.author}</span>
              </div>
              <div className={styles.metaItem}>
                <Calendar size={16} />
                <span>{article.published_at}</span>
              </div>
            </div>

            <ShareButtons article={article} />
          </div>
        </article>
      </div>

      <aside className={styles.sidebar}>
        <RelatedArticles currentArticle={article} />
      </aside>

      <DisqusComments slug={article.slug} id={article.id} title={article.title} />
    </div>
  );
}