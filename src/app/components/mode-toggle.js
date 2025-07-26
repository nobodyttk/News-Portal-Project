"use client"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useState } from "react"
import styles from "./mode-toggle.module.css"

export function ModeToggle() {
  const { setTheme } = useTheme()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className={styles.dropdown}>
      <button className={styles.trigger} onClick={() => setIsOpen(!isOpen)}>
        <Sun className={`${styles.icon} ${styles.lightIcon}`} />
        <Moon className={`${styles.icon} ${styles.darkIcon}`} />
        <span className={styles.srOnly}>Toggle theme</span>
      </button>
      {isOpen && (
        <div className={styles.content}>
          <button
            className={styles.item}
            onClick={() => {
              setTheme("light")
              setIsOpen(false)
            }}
          >
            Claro
          </button>
          <button
            className={styles.item}
            onClick={() => {
              setTheme("dark")
              setIsOpen(false)
            }}
          >
            Escuro
          </button>
          <button
            className={styles.item}
            onClick={() => {
              setTheme("system")
              setIsOpen(false)
            }}
          >
            Sistema
          </button>
        </div>
      )}
    </div>
  )
}
