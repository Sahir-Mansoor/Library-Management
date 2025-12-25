"use client"

import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AlertCircle } from "lucide-react"

interface MemberIssuedBooksPageProps {
  userRole: string
  onNavigate: (page: string) => void
  onLogout: () => void
}

const issuedBooks = [
  {
    id: "I001",
    title: "The Great Gatsby",
    issueDate: "2024-01-10",
    dueDate: "2024-01-24",
    status: "On Time",
    isOverdue: false,
  },
  {
    id: "I002",
    title: "1984",
    issueDate: "2024-01-05",
    dueDate: "2024-01-19",
    status: "Overdue",
    isOverdue: true,
  },
  {
    id: "I003",
    title: "To Kill a Mockingbird",
    issueDate: "2024-01-12",
    dueDate: "2024-01-26",
    status: "On Time",
    isOverdue: false,
  },
]

export function MemberIssuedBooksPage({ userRole, onNavigate, onLogout }: MemberIssuedBooksPageProps) {
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
                    {issuedBooks.length > 0 ? (
                      issuedBooks.map((book) => (
                        <TableRow
                          key={book.id}
                          className={`border-b border-border transition-colors ${
                            book.isOverdue ? "bg-red-50/50 hover:bg-red-50/70" : "hover:bg-secondary/30"
                          }`}
                        >
                          <TableCell className="font-medium">{book.title}</TableCell>
                          <TableCell className="text-sm">{book.issueDate}</TableCell>
                          <TableCell className="text-sm">{book.dueDate}</TableCell>
                          <TableCell>
                            <span
                              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                                book.isOverdue ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
                              }`}
                            >
                              {book.isOverdue && <AlertCircle className="w-3 h-3" />}
                              {book.status}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))
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
