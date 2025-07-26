

"use client"

import { DiscussionEmbed } from "disqus-react"

export function DisqusComments({ slug, id, title }) {
  const disqusShortname = "feral-1" // 🔧 substitua pelo seu shortname

  const disqusConfig = {
    url: `http://localhost:3000/noticias/${slug}`, // 🔗 URL pública
    identifier: id.toString(), // 🔑 ID único (string)
    title: title,              // 📝 Título da página
    language: "pt_BR",         // 🌎 Idioma dos comentários
  }

  return (
    <div style={{ marginTop: "50px" }}>
      <DiscussionEmbed shortname={disqusShortname} config={disqusConfig} />
    </div>
  )
}
