"use client"

import { useEffect, useState } from "react"
import axios from "axios"
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

interface Summary {
  totalBooks: number
  issuedBooks: number
  availableBooks: number
  totalMembers: number
  overdueBooks: number
}

interface Book {
  title: string
  author: string
}

interface QuickStats {
  booksDueToday: number
  newMembersThisMonth: number
  mostPopularCategory: string
}

export function DashboardPage({ userRole, onNavigate, onLogout }: DashboardPageProps) {
  const [summary, setSummary] = useState<Summary>({
    totalBooks: 0,
    issuedBooks: 0,
    availableBooks: 0,
    totalMembers: 0,
    overdueBooks: 0,
  })
  const [recentBooks, setRecentBooks] = useState<Book[]>([])
  const [quickStats, setQuickStats] = useState<QuickStats>({
    booksDueToday: 0,
    newMembersThisMonth: 0,
    mostPopularCategory: '',
  })

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const summaryRes = await axios.get(`http://localhost:5000/dashboard/summary`)
        setSummary(summaryRes.data)
        debugger;

        const recentRes = await axios.get(`http://localhost:5000/dashboard/recent-books`)
        setRecentBooks(recentRes.data)

        const quickRes = await axios.get(`http://localhost:5000/dashboard/quick-stats`)
        setQuickStats(quickRes.data)
      } catch (err) {
        console.error("Failed to fetch dashboard data", err)
      }
    }
    fetchDashboard()
  }, [])

  const stats = [
    { title: "Total No. of Books", value: summary.totalBooks.toString(), icon: BookOpen, color: "bg-blue-500/10", iconColor: "text-blue-600" },
    { title: "Issued Books", value: summary.issuedBooks.toString(), icon: BookMarked, color: "bg-purple-500/10", iconColor: "text-purple-600" },
    { title: "Available Copies of Books", value: summary.availableBooks.toString(), icon: TrendingUp, color: "bg-green-500/10", iconColor: "text-green-600" },
    { title: "Total Members", value: summary.totalMembers.toString(), icon: Users, color: "bg-orange-500/10", iconColor: "text-orange-600" },
    { title: "Overdue Books", value: summary.overdueBooks.toString(), icon: AlertCircle, color: "bg-red-500/10", iconColor: "text-red-600" },
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
              {stats.map((stat, idx) => (
                <StatsCard key={idx} {...stat} />
              ))}
            </div>

            {/* Recent Books */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg">Recently Added Books</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentBooks.map((book, idx) => (
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

              {/* Quick Stats */}
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg">Quick Stats</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                      <span className="text-muted-foreground">Books Due Today</span>
                      <span className="font-bold text-lg text-blue-600">{quickStats.booksDueToday}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                      <span className="text-muted-foreground">New Members This Month</span>
                      <span className="font-bold text-lg text-green-600">{quickStats.newMembersThisMonth}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                      <span className="text-muted-foreground">Most Popular Category</span>
                      <span className="font-bold text-lg text-purple-600">{quickStats.mostPopularCategory}</span>
                    </div>
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
