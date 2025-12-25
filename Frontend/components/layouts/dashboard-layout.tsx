"use client"

import type React from "react"

import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"

interface DashboardLayoutProps {
  children: React.ReactNode
  currentPage: string
  userRole: string
  userName: string
  onNavigate: (page: string) => void
  onLogout: () => void
}

export function DashboardLayout({
  children,
  currentPage,
  userRole,
  userName,
  onNavigate,
  onLogout,
}: DashboardLayoutProps) {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar currentPage={currentPage} onNavigate={onNavigate} onLogout={onLogout} userRole={userRole} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header userRole={userRole} onLogout={onLogout} userName={userName} />

        <main className="flex-1 overflow-auto bg-background">{children}</main>
      </div>
    </div>
  )
}
