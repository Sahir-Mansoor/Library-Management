"use client"

import { useState } from "react"
import { Bell, Moon, Sun, LogOut, User, Shield } from "lucide-react"

interface HeaderProps {
  userRole: string
  userName?: string
  onLogout: () => void
}

export function Header({ userRole, userName = "User", onLogout }: HeaderProps) {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showSettings, setShowSettings] = useState(false)

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
    if (!isDarkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }

  const notifications = [
    {
      id: 1,
      title: "Book Due Tomorrow",
      message: "The book 'React Guide' is due tomorrow",
      time: "2 hours ago",
      type: "warning",
    },
    {
      id: 2,
      title: "Book Returned Successfully",
      message: "Your book 'JavaScript Basics' has been processed",
      time: "4 hours ago",
      type: "success",
    },
    {
      id: 3,
      title: "Fine Payment Reminder",
      message: "You have an overdue fine of $5.00",
      time: "1 day ago",
      type: "error",
    },
    {
      id: 4,
      title: "Book Available",
      message: "The book 'Advanced TypeScript' is now available",
      time: "2 days ago",
      type: "info",
    },
  ]

  return (
    <header className="hidden lg:flex h-16 border-b border-border bg-background items-center justify-between px-8 sticky top-0 z-40">
      <div className="flex-1" />
      <div className="flex items-center gap-6">
        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 hover:bg-secondary rounded-lg transition-colors relative"
            title="Notifications"
          >
            <Bell className="w-5 h-5 text-muted-foreground" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
          </button>

          {showNotifications && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
              <div className="absolute right-0 top-12 w-80 bg-card border border-border rounded-lg shadow-xl z-50 max-h-96 overflow-hidden flex flex-col">
                <div className="p-4 border-b border-border">
                  <h3 className="font-semibold text-foreground">Notifications</h3>
                </div>
                <div className="overflow-y-auto flex-1">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className="p-4 border-b border-border hover:bg-secondary/50 cursor-pointer transition-colors"
                    >
                      <p className="font-medium text-sm text-foreground">{notif.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">{notif.message}</p>
                      <p className="text-xs text-muted-foreground mt-2">{notif.time}</p>
                    </div>
                  ))}
                </div>
                <div className="p-3 border-t border-border text-center bg-secondary/30">
                  <button className="text-xs font-semibold text-primary hover:text-primary/80">
                    View All Notifications
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Dark Mode Toggle */}
        <button
          onClick={toggleDarkMode}
          className="p-2 hover:bg-secondary rounded-lg transition-colors"
          title="Toggle dark mode"
        >
          {isDarkMode ? (
            <Sun className="w-5 h-5 text-muted-foreground" />
          ) : (
            <Moon className="w-5 h-5 text-muted-foreground" />
          )}
        </button>

        <div className="relative">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 hover:bg-secondary rounded-lg transition-colors"
            title="Settings"
          >
            <Shield className="w-5 h-5 text-muted-foreground" />
          </button>

          {showSettings && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowSettings(false)} />
              <div className="absolute right-0 top-12 w-48 bg-card border border-border rounded-lg shadow-xl z-50">
                <div className="p-2">
                  <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-secondary transition-colors text-left text-sm text-foreground hover:text-foreground">
                    <User className="w-4 h-4" />
                    <span>Profile Settings</span>
                  </button>
                  <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-secondary transition-colors text-left text-sm text-foreground hover:text-foreground">
                    <Shield className="w-4 h-4" />
                    <span>Security</span>
                  </button>
                  <div className="my-2 border-t border-border" />
                  <button
                    onClick={() => {
                      onLogout()
                      setShowSettings(false)
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-destructive/10 transition-colors text-left text-sm text-destructive"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="w-px h-6 bg-border" />

        {/* User Profile Display */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-md">
            <span className="text-sm font-semibold text-primary-foreground capitalize">{userName[0]}</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground capitalize">{userName}</p>
            <p className="text-xs text-muted-foreground capitalize">{userRole}</p>
          </div>
        </div>
      </div>
    </header>
  )
}
