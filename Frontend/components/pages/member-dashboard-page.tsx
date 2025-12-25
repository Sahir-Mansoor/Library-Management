"use client"

import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Card } from "@/components/ui/card"
import { AlertCircle, BookOpen, Clock, DollarSign } from "lucide-react"

interface MemberDashboardPageProps {
  userRole: string
  userName: string
  onNavigate: (page: string) => void
  onLogout: () => void
}

export function MemberDashboardPage({ userRole, userName, onNavigate, onLogout }: MemberDashboardPageProps) {
  const dashboardStats = [
    {
      title: "Books Currently Issued",
      value: "3",
      icon: BookOpen,
      color: "bg-blue-50 text-blue-600",
      borderColor: "border-blue-200",
    },
    {
      title: "Due Soon",
      value: "1",
      icon: Clock,
      color: "bg-orange-50 text-orange-600",
      borderColor: "border-orange-200",
    },
    {
      title: "Overdue Books",
      value: "0",
      icon: AlertCircle,
      color: "bg-red-50 text-red-600",
      borderColor: "border-red-200",
    },
    {
      title: "Total Unpaid Fines",
      value: "₹0",
      icon: DollarSign,
      color: "bg-purple-50 text-purple-600",
      borderColor: "border-purple-200",
    },
  ]

  return (
    <div className="flex h-screen bg-background">
      <Sidebar currentPage="dashboard" onNavigate={onNavigate} onLogout={onLogout} userRole={userRole} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header userRole={userRole} onLogout={onLogout} />
        <main className="flex-1 overflow-auto p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground">Welcome, {userName}!</h1>
              <p className="text-muted-foreground mt-2">Your library dashboard overview</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {dashboardStats.map((stat, index) => {
                const Icon = stat.icon
                return (
                  <Card
                    key={index}
                    className={`p-6 border-2 ${stat.borderColor} bg-white hover:shadow-md transition-shadow`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-2">{stat.title}</p>
                        <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                      </div>
                      <div className={`p-3 rounded-lg ${stat.color}`}>
                        <Icon className="w-6 h-6" />
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>

            {/* Quick Info */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6 border-0 shadow-sm bg-blue-50/50">
                <h2 className="font-semibold text-lg mb-3 text-foreground">Quick Info</h2>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-primary rounded-full"></span>
                    <span>Browse available books in the library</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-primary rounded-full"></span>
                    <span>Track your issued books and due dates</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-primary rounded-full"></span>
                    <span>View and manage any outstanding fines</span>
                  </li>
                </ul>
              </Card>

              <Card className="p-6 border-0 shadow-sm bg-green-50/50">
                <h2 className="font-semibold text-lg mb-3 text-foreground">Library Rules</h2>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                    <span>Issue period: 14 days</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                    <span>Max books: 5 at a time</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                    <span>Late fee: ₹10 per day</span>
                  </li>
                </ul>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
