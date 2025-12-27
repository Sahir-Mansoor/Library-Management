"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { RotateCcw, AlertCircle } from "lucide-react"

interface ReturnBookPageProps {
  userRole: string
  onNavigate: (page: string) => void
  onLogout: () => void
}

interface IssueBook {
  id: string
  issueDate: string
  dueDate: string
  returnDate?: string
  status: "ISSUED" | "RETURNED" | "OVERDUE"
  fine? : number
  user: {
    id: string
    name: string
  }
  book: {
    id: string
    title: string
  }
}

const API_BASE = "http://localhost:5000"
const ISSUE_API = `${API_BASE}/book-issue`

export function ReturnBookPage({ userRole, onNavigate, onLogout }: ReturnBookPageProps) {
  const [issuedBooks, setIssuedBooks] = useState<IssueBook[]>([])
  const [returnedBooks, setReturnedBooks] = useState<IssueBook[]>([])

  useEffect(() => {
    fetchIssuedBooks()
  }, [])

  const fetchIssuedBooks = async () => {
    try {
      const res = await axios.get(ISSUE_API)
      const activeBooks = res.data.filter((b: IssueBook) => b.status === "ISSUED")
      setIssuedBooks(activeBooks)
    } catch (err) {
      console.error("Failed to fetch issued books", err)
    }
  }

  const calculateFine = (dueDate: string) => {
    const due = new Date(dueDate)
    const today = new Date()
    const diffTime = today.getTime() - due.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays > 0 ? diffDays * 10 : 0
  }

  const handleReturnBook = async (book: IssueBook) => {
  const fine = calculateFine(book.dueDate)
  const returnDate = new Date().toISOString()

  try {
    // ✅ Correct POST URL
    await axios.post(`${ISSUE_API}/return/${book.id}`)

    // Move book from issuedBooks to returnedBooks
    setReturnedBooks([
      ...returnedBooks,
      { ...book, returnDate, status: "RETURNED" },
    ])
    setIssuedBooks(issuedBooks.filter((b) => b.id !== book.id))
  } catch (err) {
    console.error("Failed to return book:", err)
    alert("Failed to return book")
  }
}


  return (
    <div className="flex h-screen bg-background">
      <Sidebar currentPage="return-book" onNavigate={onNavigate} onLogout={onLogout} userRole={userRole} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header userRole={userRole} onLogout={onLogout} />
        <main className="flex-1 overflow-auto p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground">Return Book</h1>
              <p className="text-muted-foreground mt-2">Process book returns and calculate fines</p>
            </div>

            {/* Active Issued Books */}
            <Card className="border-0 shadow-sm overflow-hidden mb-8">
              <div className="p-6 border-b border-border bg-secondary/20">
                <h2 className="text-xl font-bold text-foreground">Active Issued Books</h2>
              </div>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-secondary/50 border-b border-border hover:bg-secondary/50">
                      <TableHead className="font-semibold">Member</TableHead>
                      <TableHead className="font-semibold">Book Title</TableHead>
                      <TableHead className="font-semibold">Issue Date</TableHead>
                      <TableHead className="font-semibold">Due Date</TableHead>
                      <TableHead className="font-semibold">Status</TableHead>
                      <TableHead className="font-semibold text-center">Fine (₹)</TableHead>
                      <TableHead className="font-semibold text-center">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {issuedBooks.length > 0 ? (
                      issuedBooks.map((book) => {
                        const fine = calculateFine(book.dueDate)
                        return (
                          <TableRow
                            key={book.id}
                            className="border-b border-border hover:bg-secondary/30 transition-colors"
                          >
                            <TableCell className="font-medium">{book.user.name}</TableCell>
                            <TableCell className="font-medium">{book.book.title}</TableCell>
                            <TableCell className="text-sm">{new Date(book.issueDate).toLocaleDateString()}</TableCell>
                            <TableCell className="text-sm">{new Date(book.dueDate).toLocaleDateString()}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                {fine > 0 && <AlertCircle className="w-4 h-4 text-red-600" />}
                                <span
                                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                    fine > 0 ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
                                  }`}
                                >
                                  {fine > 0 ? "Overdue" : "Active"}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className={`font-semibold text-center ${fine > 0 ? "text-red-600" : ""}`}>
                              {fine}
                            </TableCell>
                            <TableCell className="text-center">
                              <Button
                                onClick={() => handleReturnBook(book)}
                                size="sm"
                                className="bg-primary hover:bg-primary/90 text-primary-foreground"
                              >
                                <RotateCcw className="w-4 h-4 mr-1" />
                                Return
                              </Button>
                            </TableCell>
                          </TableRow>
                        )
                      })
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8">
                          <p className="text-muted-foreground">No active issued books.</p>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </Card>

            {/* Returned Books */}
            {returnedBooks.length > 0 && (
              <Card className="border-0 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-border bg-secondary/20">
                  <h2 className="text-xl font-bold text-foreground">Returned Books</h2>
                </div>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-secondary/50 border-b border-border hover:bg-secondary/50">
                        <TableHead className="font-semibold">Member</TableHead>
                        <TableHead className="font-semibold">Book Title</TableHead>
                        <TableHead className="font-semibold">Due Date</TableHead>
                        <TableHead className="font-semibold">Return Date</TableHead>
                        <TableHead className="font-semibold text-center">Fine (₹)</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {returnedBooks.map((book) => (
                        <TableRow
                          key={book.id}
                          className="border-b border-border hover:bg-secondary/30 transition-colors"
                        >
                          <TableCell className="font-medium">{book.user.name}</TableCell>
                          <TableCell className="font-medium">{book.book.title}</TableCell>
                          <TableCell className="text-sm">{new Date(book.dueDate).toLocaleDateString()}</TableCell>
                          <TableCell className="text-sm">{new Date(book.returnDate!).toLocaleDateString()}</TableCell>
                          <TableCell className={`font-semibold text-center ${calculateFine(book.dueDate) > 0 ? "text-red-600" : ""}`}>
  {calculateFine(book.dueDate)}
</TableCell>

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
