"use client"

import { useState } from "react"
import {
  BookOpen,
  LayoutDashboard,
  BookMarked,
  Users,
  ArrowRightLeft,
  RotateCcw,
  DollarSign,
  Menu,
  X,
  LogOut,
  Search,
  History,
  User,
  ChevronRight,
  UserCog,
} from "lucide-react"

interface SidebarProps {
  currentPage: string
  onNavigate: (page: string) => void
  onLogout: () => void
  userRole: string
}

export function Sidebar({ currentPage, onNavigate, onLogout, userRole }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false)

  const memberMenuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "browse-books", label: "Browse Books", icon: Search },
    { id: "issued-books", label: "My Issued Books", icon: BookMarked },
    { id: "my-fines", label: "My Fines", icon: DollarSign },
    { id: "borrowing-history", label: "Borrowing History", icon: History },
    { id: "profile", label: "Profile", icon: User },
  ]

  const adminMenuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "books", label: "Books Management", icon: BookMarked },
    { id: "members", label: "Members Management", icon: Users },
    { id: "users", label: "Users Management", icon: UserCog },
    { id: "issue-book", label: "Issue Book", icon: ArrowRightLeft },
    { id: "return-book", label: "Return Book", icon: RotateCcw },
    { id: "fines", label: "Fines Management", icon: DollarSign },
  ]

  const menuItems = userRole === "member" ? memberMenuItems : adminMenuItems

  const navItems = (
    <>
      {menuItems.map((item) => {
        const Icon = item.icon
        const isActive = currentPage === item.id
        return (
          <button
            key={item.id}
            onClick={() => {
              onNavigate(item.id)
              setIsOpen(false)
            }}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 text-left group ${
              isActive ? "bg-primary text-primary-foreground shadow-md" : "text-foreground hover:bg-secondary/80"
            }`}
          >
            <div className="flex items-center gap-3">
              <Icon className={`w-5 h-5 transition-transform ${isActive ? "" : "group-hover:scale-110"}`} />
              <span className={`font-medium ${isActive ? "font-semibold" : ""}`}>{item.label}</span>
            </div>
            {isActive && <ChevronRight className="w-4 h-4" />}
          </button>
        )
      })}
    </>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-56 bg-gradient-to-b from-card to-card/95 text-foreground flex-col border-r border-border shadow-sm">
        <div className="p-6 border-b border-border/50">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-primary to-primary/80 p-2.5 rounded-lg shadow-lg">
              <BookOpen className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-bold text-lg tracking-tight">LibraryHub</h1>
              <p className="text-xs text-muted-foreground capitalize font-medium">{userRole}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">{navItems}</nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-border/50">
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-destructive/10 hover:bg-destructive/20 text-destructive font-medium transition-colors duration-200"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Menu Button */}
      <div className="lg:hidden flex items-center justify-between h-14 bg-card border-b border-border/50 px-4 sticky top-0 z-50">
        <button onClick={() => setIsOpen(!isOpen)} className="p-2 hover:bg-secondary rounded-lg transition-colors">
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
        <div className="flex items-center gap-2">
          <div className="bg-gradient-to-br from-primary to-primary/80 p-1.5 rounded-lg">
            <BookOpen className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-semibold text-sm">LibraryHub</span>
        </div>
      </div>

      {/* Mobile Sidebar */}
      {isOpen && (
        <>
          <div className="lg:hidden fixed inset-0 bg-black/50 z-30 top-14" onClick={() => setIsOpen(false)} />
          <aside className="lg:hidden fixed left-0 top-14 h-[calc(100vh-56px)] w-56 bg-gradient-to-b from-card to-card/95 text-foreground flex flex-col z-40 border-r border-border/50">
            <div className="p-4 border-b border-border/50 flex items-center gap-3">
              <div className="bg-gradient-to-br from-primary to-primary/80 p-2.5 rounded-lg">
                <BookOpen className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-bold">LibraryHub</h1>
                <p className="text-xs text-muted-foreground capitalize font-medium">{userRole}</p>
              </div>
            </div>

            <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">{navItems}</nav>

            <div className="p-4 border-t border-border/50">
              <button
                onClick={() => {
                  onLogout()
                  setIsOpen(false)
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-destructive/10 hover:bg-destructive/20 text-destructive font-medium transition-colors duration-200"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </aside>
        </>
      )}
    </>
  )
}
