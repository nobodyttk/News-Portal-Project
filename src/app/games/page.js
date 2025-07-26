import { CategoryListing } from "../components/category-listing"

export const metadata = {
  title: "Games - GameVicio",
  description: "Todas as notícias sobre games, lançamentos, reviews e novidades do mundo gamer no GameVicio",
}

export default function GamesPage({ searchParams }) {
  const page = Number.parseInt(searchParams.page) || 1
  const search = searchParams.search || ""

  return (
    <CategoryListing
      category="GAMES"
      initialPage={page}
      initialSearch={search}
      title="Games"
      subtitle="Todas as novidades, lançamentos e reviews do mundo dos games"
      icon="🎮"
    />
  )
}
