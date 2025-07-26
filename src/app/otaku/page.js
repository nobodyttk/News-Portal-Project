import { CategoryListing } from "../components/category-listing"

export const metadata = {
  title: "Otaku - GameZone",
  description: "Notícias sobre anime, mangá, cultura japonesa e mundo otaku no GameZone",
}

export default function OtakuPage({ searchParams }) {
  const page = Number.parseInt(searchParams.page) || 1
  const search = searchParams.search || ""

  return (
    <CategoryListing
      category="OTAKU"
      initialPage={page}
      initialSearch={search}
      title="Otaku"
      subtitle="Anime, mangá, cultura japonesa e tudo sobre o universo otaku"
      icon="🎌"
    />
  )
}
