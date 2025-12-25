"use client"

import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { StatsCard } from "@/components/stats-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Users, AlertCircle, BookMarked, TrendingUp } from "lucide-react"

interface DashboardPageProps {
  userRole: string
  onNavigate: (page: string) => void
  onLogout: () => void
}

export function DashboardPage({ userRole, onNavigate, onLogout }: DashboardPageProps) {
  const stats = [
    {
      title: "Total Books",
      value: "2,543",
      icon: BookOpen,
      color: "bg-blue-500/10",
      iconColor: "text-blue-600",
    },
    {
      title: "Issued Books",
      value: "842",
      icon: BookMarked,
      color: "bg-purple-500/10",
      iconColor: "text-purple-600",
    },
    {
      title: "Available Books",
      value: "1,701",
      icon: TrendingUp,
      color: "bg-green-500/10",
      iconColor: "text-green-600",
    },
    {
      title: "Total Members",
      value: "456",
      icon: Users,
      color: "bg-orange-500/10",
      iconColor: "text-orange-600",
    },
    {
      title: "Overdue Books",
      value: "23",
      icon: AlertCircle,
      color: "bg-red-500/10",
      iconColor: "text-red-600",
    },
  ]

  return (
    <div className="flex h-screen bg-background">
      <Sidebar currentPage="dashboard" onNavigate={onNavigate} onLogout={onLogout} userRole={userRole} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header userRole={userRole} onLogout={onLogout} />
        <main className="flex-1 overflow-auto p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
              <p className="text-muted-foreground mt-2">Welcome back! Here's your library overview.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
              {stats.map((stat, index) => (
                <StatsCard key={index} {...stat} />
              ))}
            </div>

            {/* Recent Activity Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg">Recently Added Books</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { title: "The Great Gatsby", author: "F. Scott Fitzgerald" },
                      { title: "1984", author: "George Orwell" },
                      { title: "To Kill a Mockingbird", author: "Harper Lee" },
                    ].map((book, idx) => (
                      <div key={idx} className="flex items-start gap-3 pb-4 border-b border-border last:border-b-0">
                        <div className="w-10 h-10 bg-primary/10 rounded flex items-center justify-center flex-shrink-0">
                          <BookOpen className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{book.title}</p>
                          <p className="text-sm text-muted-foreground">{book.author}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg">Quick Stats</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { label: "Books Due Today", value: "8", color: "text-blue-600" },
                      { label: "New Members This Month", value: "42", color: "text-green-600" },
                      { label: "Most Popular Category", value: "Fiction", color: "text-purple-600" },
                    ].map((stat, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                        <span className="text-muted-foreground">{stat.label}</span>
                        <span className={`font-bold text-lg ${stat.color}`}>{stat.value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
