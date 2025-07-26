import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "./components/theme-provider"
import Header from "./components/header"
import Footer from "./components/footer"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "GameZone - Portal de Notícias de Games, Animes e cultura geek",
  description: "Seu portal de notícias sobre games, entretenimento e cultura geek",
}

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <Header />
          <main className="main-content">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}
