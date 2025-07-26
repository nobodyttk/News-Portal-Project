import Link from "next/link"
import { Facebook, Twitter, Instagram, Youtube, Twitch } from "lucide-react"
import styles from "./footer.module.css"

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          <div className={styles.column}>
            <Link href="/" className={styles.logo}>
              <div className={styles.logoContainer}>
                <span className={styles.logoGame}>GAME</span>
                <span className={styles.logoVicio}>FERAL</span>
              </div>
            </Link>
            <p className={styles.description}>Seu portal de notícias sobre games, entretenimento e cultura geek.</p>
          </div>

          <div className={styles.column}>
            <h3 className={styles.columnTitle}>Categorias</h3>
            <ul className={styles.linkList}>
              <li>
                <Link href="/noticias" className={styles.link}>
                  Notícias
                </Link>
              </li>
              <li>
                <Link href="/games" className={styles.link}>
                  Games
                </Link>
              </li>
              <li>
                <Link href="/otaku" className={styles.link}>
                  Otaku
                </Link>
              </li>
              <li>
                <Link href="/entretenimento" className={styles.link}>
                  Entretenimento
                </Link>
              </li>
             
            </ul>
          </div>

          <div className={styles.column}>
            <h3 className={styles.columnTitle}>Links Úteis</h3>
            <ul className={styles.linkList}>
              <li>
                <Link href="/sobre" className={styles.link}>
                  Sobre Nós
                </Link>
              </li>
              <li>
                <Link href="/contato" className={styles.link}>
                  Contato
                </Link>
              </li>
              <li>
                <Link href="/politica-de-privacidade" className={styles.link}>
                  Política de Privacidade
                </Link>
              </li>
              <li>
                <Link href="/termos-de-uso" className={styles.link}>
                  Termos de Uso
                </Link>
              </li>
            </ul>
          </div>

          <div className={styles.column}>
            <h3 className={styles.columnTitle}>Redes Sociais</h3>
            <div className={styles.socialLinks}>
              <Link href="https://facebook.com" className={styles.socialLink}>
                <Facebook size={20} />
                <span className={styles.srOnly}>Facebook</span>
              </Link>
              <Link href="https://twitter.com" className={styles.socialLink}>
                <Twitter size={20} />
                <span className={styles.srOnly}>Twitter</span>
              </Link>
              <Link href="https://instagram.com" className={styles.socialLink}>
                <Instagram size={20} />
                <span className={styles.srOnly}>Instagram</span>
              </Link>
              <Link href="https://youtube.com" className={styles.socialLink}>
                <Youtube size={20} />
                <span className={styles.srOnly}>Youtube</span>
              </Link>
              <Link href="https://twitch.tv" className={styles.socialLink}>
                <Twitch size={20} />
                <span className={styles.srOnly}>Twitch</span>
              </Link>
            </div>
          </div>
        </div>

        <div className={styles.bottom}>
          <p className={styles.copyright}>&copy; {new Date().getFullYear()} GameVicio. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
