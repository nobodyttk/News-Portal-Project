// app/noticias/page.jsx
import { NewsListing } from "../../app/components/news-listing"
import axios from "axios" // Importe o axios aqui para usar no servidor

export const metadata = {
  title: "Todas as Notícias - GameVicio",
  description: "Confira todas as últimas notícias sobre games, entretenimento e tecnologia no GameVicio",
}

const ITEMS_PER_PAGE = 6 // Defina isso aqui também, pois será usado no servidor

// Função para buscar notícias no servidor
async function fetchNewsServer({ page, category, search }) {
  try {
    const params = new URLSearchParams()
    params.set("page", page.toString())
    params.set("limit", ITEMS_PER_PAGE.toString())

    if (category !== "all") {
      params.set("category", category)
    }

    if (search) {
      params.set("search", search)
    }

    const response = await axios.get(`http://localhost:3001/api/noticias?${params.toString()}`)
    return {
      news: response.data.noticias || [],
      totalItems: response.data.pagination?.total || 0,
      error: null,
    }
  } catch (err) {
    console.error("Erro ao buscar notícias no servidor:", err)
    return {
      news: [],
      totalItems: 0,
      error: "Não foi possível carregar as notícias. Tente novamente mais tarde.",
    }
  }
}

export default async function NewsPage({ searchParams }) {
  const page = Number.parseInt(searchParams.page) || 1
  const category = searchParams.category || "all"
  const search = searchParams.search || ""

  // Busca inicial dos dados no servidor
  const { news, totalItems, error } = await fetchNewsServer({ page, category, search })

  return (
    <NewsListing
      initialPage={page}
      initialCategory={category}
      initialSearch={search}
      initialNews={news} // Passamos os dados iniciais
      initialTotalItems={totalItems} // Passamos o total de itens inicial
      initialError={error} // Passamos o erro inicial, se houver
    />
  )
}