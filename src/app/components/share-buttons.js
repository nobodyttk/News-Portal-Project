"use client"

import { Share2, Facebook, Twitter, Linkedin, LinkIcon } from "lucide-react"
import { useState } from "react"
import styles from "./share-buttons.module.css"

export function ShareButtons({ article }) {
  const [copied, setCopied] = useState(false)

  const shareUrl = typeof window !== "undefined" ? window.location.href : ""
  const shareText = `${article.title} - GameVicio`

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Erro ao copiar link:", err)
    }
  }

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Share2 size={20} />
        <span>Compartilhar</span>
      </div>

      <div className={styles.buttons}>
        <a
          href={shareLinks.facebook}
          target="_blank"
          rel="noopener noreferrer"
          className={`${styles.button} ${styles.facebook}`}
          aria-label="Compartilhar no Facebook"
        >
          <Facebook size={18} />
        
        </a>

        <a
          href={shareLinks.twitter}
          target="_blank"
          rel="noopener noreferrer"
          className={`${styles.button} ${styles.twitter}`}
          aria-label="Compartilhar no Twitter"
        >
          <Twitter size={18} />
         
        </a>

        <a
          href={shareLinks.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className={`${styles.button} ${styles.linkedin}`}
          aria-label="Compartilhar no LinkedIn"
        >
          <Linkedin size={18} />
        
        </a>

        <button
          onClick={handleCopyLink}
          className={`${styles.button} ${styles.copy} ${copied ? styles.copied : ""}`}
          aria-label="Copiar link"
        >
          <LinkIcon size={18} />
          <span>{copied ? "Copiado!" : "Copiar Link"}</span>
        </button>
      </div>
    </div>
  )
}
