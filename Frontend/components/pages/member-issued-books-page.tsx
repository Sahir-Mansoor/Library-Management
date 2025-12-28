"use client"

import { useEffect, useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AlertCircle } from "lucide-react"

interface MemberIssuedBooksPageProps {
  userRole: string
  userId: string      // Add userId prop
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

export function MemberIssuedBooksPage({
  userRole,
  userId,
  onNavigate,
  onLogout,
}: MemberIssuedBooksPageProps) {
 const [issuedBooks, setIssuedBooks] = useState<IssuedBook[]>([])
const [loading, setLoading] = useState(true)

useEffect(() => {
  debugger;
  const fetchIssuedBooks = async () => {
    if (!userId) return // don't fetch if userId is missing
    try {
      setLoading(true)
      const res = await fetch(`http://localhost:5000/book-issue/user/${userId}`)
      const data = await res.json()
      setIssuedBooks(data)
    } catch (err) {
      console.error("Failed to fetch issued books:", err)
    } finally {
      setLoading(false)
    }
  }

  fetchIssuedBooks()
}, [userId])

  return (
    <div className="flex h-screen bg-background">
      <Sidebar currentPage="issued-books" onNavigate={onNavigate} onLogout={onLogout} userRole={userRole} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header userRole={userRole} onLogout={onLogout} />
        <main className="flex-1 overflow-auto p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground">My Issued Books</h1>
              <p className="text-muted-foreground mt-2">Track your currently issued books</p>
            </div>

            {/* Issued Books Table */}
            <Card className="border-0 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-secondary/50 border-b border-border hover:bg-secondary/50">
                      <TableHead className="font-semibold">Book Title</TableHead>
                      <TableHead className="font-semibold">Issue Date</TableHead>
                      <TableHead className="font-semibold">Due Date</TableHead>
                      <TableHead className="font-semibold">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-8">
                          <p className="text-muted-foreground">Loading issued books...</p>
                        </TableCell>
                      </TableRow>
                    ) : issuedBooks.length > 0 ? (
                      issuedBooks.map((book) => {
                        const isOverdue = new Date(book.dueDate) < new Date() && book.status !== "RETURNED"
                        return (
                          <TableRow
                            key={book.id}
                            className={`border-b border-border transition-colors ${
                              isOverdue ? "bg-red-50/50 hover:bg-red-50/70" : "hover:bg-secondary/30"
                            }`}
                          >
                            <TableCell className="font-medium">{book.book.title}</TableCell>
                            <TableCell className="text-sm">{new Date(book.issueDate).toLocaleDateString()}</TableCell>
                            <TableCell className="text-sm">{new Date(book.dueDate).toLocaleDateString()}</TableCell>
                            <TableCell>
                              <span
                                className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                                  isOverdue ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
                                }`}
                              >
                                {isOverdue && <AlertCircle className="w-3 h-3" />}
                                {book.status}
                              </span>
                            </TableCell>
                          </TableRow>
                        )
                      })
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-8">
                          <p className="text-muted-foreground">No issued books at the moment.</p>
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
