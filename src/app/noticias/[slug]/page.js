import { notFound } from "next/navigation";
import { ArticlePage } from "../../components/article-page";

// 🚀 Buscar dado individual da API
async function getArticle(slug) {
  try {
    const res = await fetch(`http://localhost:3001/api/noticias/${slug}`, {
      cache: "no-store", // Opcional: para não usar cache em dev
    });

    if (!res.ok) return null;

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Erro ao buscar notícia:", error);
    return null;
  }
}

// 🔥 SEO dinâmico
export async function generateMetadata({ params }) {
  const article = await getArticle(params.slug);

  if (!article) {
    return {
      title: "Notícia não encontrada - GameVicio",
    };
  }

  return {
    title: `${article.title} - GameVicio`,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: [article.image],
    },
  };
}

// 🚩 Página dinâmica
export default async function NewsPage({ params }) {
  const article = await getArticle(params.slug);

  if (!article) {
    notFound();
  }

  return <ArticlePage article={article} />;
}
