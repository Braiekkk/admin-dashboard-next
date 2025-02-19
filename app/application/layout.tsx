import Sidebar from "@/components/Sidebar"
import { ThemeProvider } from "@/components/theme-provider"
import type React from "react"

export default function ApplicationLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto bg-background p-8">{children}</main>
      </div>
    </ThemeProvider>
  )
}

