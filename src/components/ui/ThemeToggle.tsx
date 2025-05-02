"use client"

import type React from "react"
import { useTheme } from "next-themes"
import { Sun, Moon } from "react-feather"
import { Button } from "./Button"

export const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  return (
    <Button variant="ghost" size="sm" onClick={toggleTheme} aria-label="Cambiar tema">
      {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
    </Button>
  )
}
