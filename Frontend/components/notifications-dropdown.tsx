"use client"

import { useState } from "react"
import { Bell, X } from "lucide-react"
import { Card } from "@/components/ui/card"

export interface Notification {
  id: number
  title: string
  message: string
  time: string
  type: "reminder" | "success" | "warning" | "info"
  read: boolean
}

interface NotificationsDropdownProps {
  notifications?: Notification[]
}

export function NotificationsDropdown({ notifications: initialNotifications }: NotificationsDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>(
    initialNotifications || [
      {
        id: 1,
        title: "Book Due Tomorrow",
        message: "The book 'React Guide' is due tomorrow",
        time: "2 hours ago",
        type: "reminder",
        read: false,
      },
      {
        id: 2,
        title: "Book Returned Successfully",
        message: "Your book 'JavaScript Basics' has been processed",
        time: "4 hours ago",
        type: "success",
        read: false,
      },
      {
        id: 3,
        title: "Fine Payment Reminder",
        message: "You have an overdue fine of $5.00",
        time: "1 day ago",
        type: "warning",
        read: true,
      },
      {
        id: 4,
        title: "Book Available",
        message: "The book 'Advanced TypeScript' is now available",
        time: "2 days ago",
        type: "info",
        read: true,
      },
    ],
  )

  const unreadCount = notifications.filter((n) => !n.read).length

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "reminder":
        return "border-l-4 border-l-yellow-500 bg-yellow-50 dark:bg-yellow-950"
      case "success":
        return "border-l-4 border-l-green-500 bg-green-50 dark:bg-green-950"
      case "warning":
        return "border-l-4 border-l-red-500 bg-red-50 dark:bg-red-950"
      default:
        return "border-l-4 border-l-blue-500 bg-blue-50 dark:bg-blue-950"
    }
  }

  const markAsRead = (id: number) => {
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const dismissNotification = (id: number) => {
    setNotifications(notifications.filter((n) => n.id !== id))
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 hover:bg-secondary rounded-lg transition-colors relative"
        title="Notifications"
      >
        <Bell className="w-5 h-5 text-muted-foreground" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-5 h-5 bg-destructive text-white text-xs rounded-full flex items-center justify-center font-semibold">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <Card className="absolute right-0 top-12 w-96 shadow-lg z-50 border-0 p-0 max-h-96 overflow-hidden flex flex-col">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h3 className="font-semibold text-foreground">Notifications</h3>
              {unreadCount > 0 && (
                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">{unreadCount} unread</span>
              )}
            </div>

            <div className="overflow-y-auto flex-1">
              {notifications.length === 0 ? (
                <div className="p-8 text-center">
                  <Bell className="w-8 h-8 text-muted-foreground mx-auto mb-2 opacity-50" />
                  <p className="text-sm text-muted-foreground">No notifications</p>
                </div>
              ) : (
                notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`p-4 border-b border-border hover:bg-secondary/50 cursor-pointer transition-colors ${getNotificationColor(notif.type)} ${!notif.read ? "bg-accent/5" : ""}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1" onClick={() => markAsRead(notif.id)}>
                        <p
                          className={`font-medium text-sm ${!notif.read ? "text-foreground font-semibold" : "text-foreground"}`}
                        >
                          {notif.title}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">{notif.message}</p>
                        <p className="text-xs text-muted-foreground mt-2">{notif.time}</p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          dismissNotification(notif.id)
                        }}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="p-3 border-t border-border text-center bg-secondary/30">
              <button className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors">
                View All Notifications
              </button>
            </div>
          </Card>
        </>
      )}
    </div>
  )
}
