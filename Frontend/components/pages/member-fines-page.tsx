"use client"

import { useEffect, useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AlertCircle, CheckCircle } from "lucide-react"

interface MemberFinesPageProps {
  userRole: string
  userId: string
  onNavigate: (page: string) => void
  onLogout: () => void
}

interface IssuedBook {
  id: string
  book: {
    id: string
    title: string
    author: string
    isbn: string
    category: string
  }
  issueDate: string
  dueDate: string
  status: string
  returnDate?: string
}

interface Fine {
  id: string
  bookTitle: string
  fineReason: string
  daysLate: number
  fineAmount: number
  isPaid: boolean
}

export function MemberFinesPage({ userRole, userId, onNavigate, onLogout }: MemberFinesPageProps) {
  const [issuedBooks, setIssuedBooks] = useState<IssuedBook[]>([])
  const [fines, setFines] = useState<Fine[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch issued books
  useEffect(() => {
    if (!userId) return

    const fetchIssuedBooks = async () => {
      setLoading(true)
      try {
        const res = await fetch(`http://localhost:5000/book-issue/user/${userId}`)
        const data: IssuedBook[] = await res.json()
        setIssuedBooks(data)
      } catch (err) {
        console.error("Failed to fetch issued books:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchIssuedBooks()
  }, [userId])

  // Calculate fines
  useEffect(() => {
    const calculateFine = (dueDate: string, returnDate?: string | null) => {
      const due = new Date(dueDate)
      const returned = returnDate ? new Date(returnDate) : new Date()
      const diffTime = returned.getTime() - due.getTime()
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      return diffDays > 0 ? diffDays * 10 : 0 // 10 currency units per day
    }

    const fineList: Fine[] = issuedBooks.map((b) => {
      const fineAmount = calculateFine(b.dueDate, b.returnDate)
      return {
        id: b.id,
        bookTitle: b.book.title,
        fineReason: fineAmount > 0 ? "Overdue" : "None",
        daysLate: fineAmount > 0 ? Math.ceil((b.returnDate ? new Date(b.returnDate) : new Date()).getTime() - new Date(b.dueDate).getTime()) / (1000*60*60*24) : 0,
        fineAmount,
        isPaid: b.status === "RETURNED", // Mark as paid if book is returned
      }
    }).filter(f => f.fineAmount > 0) // only include books with fines

    setFines(fineList)
  }, [issuedBooks])

  const totalUnpaidFines = fines.filter(f => !f.isPaid).reduce((sum, f) => sum + f.fineAmount, 0)
  const totalPaidFines = fines.filter(f => f.isPaid).reduce((sum, f) => sum + f.fineAmount, 0)

  return (
    <div className="flex h-screen bg-background">
      <Sidebar currentPage="my-fines" onNavigate={onNavigate} onLogout={onLogout} userRole={userRole} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header userRole={userRole} onLogout={onLogout} />
        <main className="flex-1 overflow-auto p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground">My Fines</h1>
              <p className="text-muted-foreground mt-2">View and manage your library fines</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <Card className="p-6 border-2 border-red-200 bg-red-50/50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">Total Unpaid Fines</p>
                    <p className="text-3xl font-bold text-red-600">₹{totalUnpaidFines}</p>
                  </div>
                  <AlertCircle className="w-12 h-12 text-red-400" />
                </div>
              </Card>

              <Card className="p-6 border-2 border-green-200 bg-green-50/50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">Total Paid Fines</p>
                    <p className="text-3xl font-bold text-green-600">₹{totalPaidFines}</p>
                  </div>
                  <CheckCircle className="w-12 h-12 text-green-400" />
                </div>
              </Card>
            </div>

            {/* Fines Table */}
            <Card className="border-0 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-secondary/50 border-b border-border hover:bg-secondary/50">
                      <TableHead className="font-semibold">Book Title</TableHead>
                      <TableHead className="font-semibold">Fine Reason</TableHead>
                      <TableHead className="font-semibold text-center">Days Late</TableHead>
                      <TableHead className="font-semibold text-right">Fine Amount</TableHead>
                      <TableHead className="font-semibold text-center">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8">
                          <p className="text-muted-foreground">Loading fines...</p>
                        </TableCell>
                      </TableRow>
                    ) : fines.length > 0 ? (
                      fines.map(f => (
                        <TableRow key={f.id} className="border-b border-border hover:bg-secondary/30 transition-colors">
                          <TableCell className="font-medium">{f.bookTitle}</TableCell>
                          <TableCell>{f.fineReason}</TableCell>
                          <TableCell className="text-center">{f.daysLate}</TableCell>
                          <TableCell className="text-right font-semibold">₹{f.fineAmount}</TableCell>
                          <TableCell className="text-center">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${f.isPaid ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                              {f.isPaid ? "Paid" : "Unpaid"}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8">
                          <p className="text-muted-foreground">No fines.</p>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
