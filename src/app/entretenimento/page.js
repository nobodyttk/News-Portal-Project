import { CategoryListing } from "../components/category-listing"

export const metadata = {
  title: "Entretenimento - GameVicio",
  description: "Filmes, séries, quadrinhos e entretenimento geek no GameVicio",
}

export default function EntertainmentPage({ searchParams }) {
  const page = Number.parseInt(searchParams.page) || 1
  const search = searchParams.search || ""

  return (
    <CategoryListing
      category="ENTRETENIMENTO"
      initialPage={page}
      initialSearch={search}
      title="Entretenimento"
      subtitle="Filmes, séries, quadrinhos e todo o universo do entretenimento geek"
      icon="🎬"
    />
  )
}
