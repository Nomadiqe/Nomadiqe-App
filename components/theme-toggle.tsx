"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  // useEffect only runs on the client, so now we can safely show the UI
  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="block px-4 py-2 text-sm text-foreground hover:bg-accent cursor-pointer flex items-center">
        <Sun className="h-4 w-4 mr-3" />
        <span>Light Mode</span>
      </div>
    )
  }

  return (
    <button
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="block w-full text-left px-4 py-2 text-sm text-foreground hover:bg-accent flex items-center"
    >
      {theme === "light" ? (
        <>
          <Moon className="h-4 w-4 mr-3" />
          <span>Dark Mode</span>
        </>
      ) : (
        <>
          <Sun className="h-4 w-4 mr-3" />
          <span>Light Mode</span>
        </>
      )}
    </button>
  )
}
