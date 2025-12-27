"use client"

import { useEffect, useState } from "react"
import axios from "axios"

import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CheckCircle, AlertCircle } from "lucide-react"

interface FinesPageProps {
  userRole: string
  onNavigate: (page: string) => void
  onLogout: () => void
}

interface IssuedBook {
  id: string
  user: { id: string; name: string }
  book: { id: string; title: string }
  issueDate: string
  dueDate: string
  returnDate?: string | null
  status: "ISSUED" | "RETURNED"
}

interface Fine {
  id: string
  memberName: string
  bookTitle: string
  dueDate: string
  daysLate: number
  fineAmount: number
  status: "Pending" | "Paid"
}

export function FinesPage({ userRole, onNavigate, onLogout }: FinesPageProps) {
  const [issuedBooks, setIssuedBooks] = useState<IssuedBook[]>([])
  const [fines, setFines] = useState<Fine[]>([])
  const [loading, setLoading] = useState(true)

  const API_BASE = "http://localhost:5000"
  const ISSUE_API = `${API_BASE}/book-issue`

  // Fetch issued books from backend
  useEffect(() => {
    fetchIssuedBooks()
  }, [])

  const fetchIssuedBooks = async () => {
    try {
      setLoading(true)
      const res = await axios.get<IssuedBook[]>(ISSUE_API)
      setIssuedBooks(res.data)
      generateFines(res.data)
    } catch (err) {
      console.error("Failed to fetch issued books:", err)
    } finally {
      setLoading(false)
    }
  }

  // Calculate fines dynamically
  const calculateFine = (dueDate: string, returnDate?: string | null) => {
    const due = new Date(dueDate)
    const today = returnDate ? new Date(returnDate) : new Date()
    const diffTime = today.getTime() - due.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays > 0 ? diffDays * 10 : 0
  }

  // Generate fines list
  const generateFines = (books: IssuedBook[]) => {
    const fineList: Fine[] = books.map((b) => {
      const daysLate = Math.max(
        0,
        Math.ceil(
          ((b.returnDate ? new Date(b.returnDate) : new Date()).getTime() - new Date(b.dueDate).getTime()) /
            (1000 * 60 * 60 * 24)
        )
      )
      const fineAmount = daysLate * 10
      return {
        id: b.id,
        memberName: b.user.name,
        bookTitle: b.book.title,
        dueDate: new Date(b.dueDate).toLocaleDateString(),
        daysLate,
        fineAmount,
        status: b.status === "RETURNED" ? "Paid" : daysLate > 0 ? "Pending" : "Paid",
      }
    })
    setFines(fineList)
  }

  const handleMarkAsPaid = (id: string) => {
    setFines(fines.map((f) => (f.id === id ? { ...f, status: "Paid" } : f)))
  }

  const pendingFines = fines.filter((f) => f.status === "Pending")
  const paidFines = fines.filter((f) => f.status === "Paid")
  const totalPendingFine = pendingFines.reduce((sum, f) => sum + f.fineAmount, 0)

  return (
    <div className="flex h-screen bg-background">
      <Sidebar currentPage="fines" onNavigate={onNavigate} onLogout={onLogout} userRole={userRole} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header userRole={userRole} onLogout={onLogout} />
        <main className="flex-1 overflow-auto p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground">Fines Management</h1>
              <p className="text-muted-foreground mt-2">Track and manage overdue book fines</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <Card className="border-0 shadow-sm p-6 bg-red-50 border-l-4 border-red-600">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Pending Fines</p>
                    <p className="text-3xl font-bold text-red-600">₹{totalPendingFine}</p>
                    <p className="text-xs text-muted-foreground mt-2">{pendingFines.length} pending</p>
                  </div>
                  <AlertCircle className="w-12 h-12 text-red-600/20" />
                </div>
              </Card>

              <Card className="border-0 shadow-sm p-6 bg-green-50 border-l-4 border-green-600">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Paid Fines</p>
                    <p className="text-3xl font-bold text-green-600">
                      ₹{paidFines.reduce((sum, f) => sum + f.fineAmount, 0)}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">{paidFines.length} resolved</p>
                  </div>
                  <CheckCircle className="w-12 h-12 text-green-600/20" />
                </div>
              </Card>
            </div>

            {/* Pending Fines Table */}
            <Card className="border-0 shadow-sm overflow-hidden mb-8">
              <div className="p-6 border-b border-border bg-secondary/20">
                <h2 className="text-xl font-bold text-foreground">Pending Fines</h2>
              </div>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-secondary/50 border-b border-border hover:bg-secondary/50">
                      <TableHead className="font-semibold">Member Name</TableHead>
                      <TableHead className="font-semibold">Book Title</TableHead>
                      <TableHead className="font-semibold">Due Date</TableHead>
                      <TableHead className="font-semibold text-center">Days Late</TableHead>
                      <TableHead className="font-semibold text-center">Fine Amount (₹)</TableHead>
                      <TableHead className="font-semibold text-center">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingFines.length > 0 ? (
                      pendingFines.map((fine) => (
                        <TableRow
                          key={fine.id}
                          className="border-b border-border hover:bg-secondary/30 transition-colors"
                        >
                          <TableCell className="font-medium">{fine.memberName}</TableCell>
                          <TableCell className="font-medium">{fine.bookTitle}</TableCell>
                          <TableCell className="text-sm">{fine.dueDate}</TableCell>
                          <TableCell className="text-center font-semibold text-red-600">{fine.daysLate}</TableCell>
                          <TableCell className="text-center font-bold text-red-600">₹{fine.fineAmount}</TableCell>
                          <TableCell className="text-center">
                            <Button
                              onClick={() => handleMarkAsPaid(fine.id)}
                              size="sm"
                              className="bg-green-600 hover:bg-green-700 text-white"
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Mark Paid
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">
                          <p className="text-muted-foreground">No pending fines.</p>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </Card>

            {/* Paid Fines Table */}
            {paidFines.length > 0 && (
              <Card className="border-0 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-border bg-secondary/20">
                  <h2 className="text-xl font-bold text-foreground">Paid Fines</h2>
                </div>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-secondary/50 border-b border-border hover:bg-secondary/50">
                        <TableHead className="font-semibold">Member Name</TableHead>
                        <TableHead className="font-semibold">Book Title</TableHead>
                        <TableHead className="font-semibold">Due Date</TableHead>
                        <TableHead className="font-semibold text-center">Days Late</TableHead>
                        <TableHead className="font-semibold text-center">Fine Amount (₹)</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paidFines.map((fine) => (
                        <TableRow
                          key={fine.id}
                          className="border-b border-border hover:bg-secondary/30 transition-colors"
                        >
                          <TableCell className="font-medium">{fine.memberName}</TableCell>
                          <TableCell className="font-medium">{fine.bookTitle}</TableCell>
                          <TableCell className="text-sm">{fine.dueDate}</TableCell>
                          <TableCell className="text-center font-semibold">{fine.daysLate}</TableCell>
                          <TableCell className="text-center font-bold text-green-600">₹{fine.fineAmount}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </Card>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
