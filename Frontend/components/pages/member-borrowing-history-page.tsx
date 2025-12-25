"use client"

import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CheckCircle, XCircle } from "lucide-react"

interface MemberBorrowingHistoryPageProps {
  userRole: string
  onNavigate: (page: string) => void
  onLogout: () => void
}

const borrowingHistory = [
  {
    id: "H001",
    bookTitle: "The Great Gatsby",
    issueDate: "2023-12-01",
    returnDate: "2023-12-15",
    finePaid: "No",
    finePaidStatus: false,
  },
  {
    id: "H002",
    bookTitle: "To Kill a Mockingbird",
    issueDate: "2023-11-20",
    returnDate: "2023-12-04",
    finePaid: "Yes",
    finePaidStatus: true,
  },
  {
    id: "H003",
    bookTitle: "The Hobbit",
    issueDate: "2023-11-01",
    returnDate: "2023-11-15",
    finePaid: "No",
    finePaidStatus: false,
  },
  {
    id: "H004",
    bookTitle: "Pride and Prejudice",
    issueDate: "2023-10-15",
    returnDate: "2023-10-29",
    finePaid: "Yes",
    finePaidStatus: true,
  },
  {
    id: "H005",
    bookTitle: "1984",
    issueDate: "2023-09-20",
    returnDate: "2023-10-04",
    finePaid: "No",
    finePaidStatus: false,
  },
]

export function MemberBorrowingHistoryPage({ userRole, onNavigate, onLogout }: MemberBorrowingHistoryPageProps) {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar currentPage="borrowing-history" onNavigate={onNavigate} onLogout={onLogout} userRole={userRole} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header userRole={userRole} onLogout={onLogout} />
        <main className="flex-1 overflow-auto p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground">Borrowing History</h1>
              <p className="text-muted-foreground mt-2">Complete record of all your book transactions</p>
            </div>

            {/* History Table */}
            <Card className="border-0 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-secondary/50 border-b border-border hover:bg-secondary/50">
                      <TableHead className="font-semibold">Book Title</TableHead>
                      <TableHead className="font-semibold">Issue Date</TableHead>
                      <TableHead className="font-semibold">Return Date</TableHead>
                      <TableHead className="font-semibold text-center">Fine Paid</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {borrowingHistory.length > 0 ? (
                      borrowingHistory.map((history) => (
                        <TableRow
                          key={history.id}
                          className="border-b border-border hover:bg-secondary/30 transition-colors"
                        >
                          <TableCell className="font-medium">{history.bookTitle}</TableCell>
                          <TableCell className="text-sm">{history.issueDate}</TableCell>
                          <TableCell className="text-sm">{history.returnDate}</TableCell>
                          <TableCell className="text-center">
                            {history.finePaidStatus ? (
                              <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                                <CheckCircle className="w-3 h-3" />
                                Yes
                              </div>
                            ) : (
                              <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-800">
                                <XCircle className="w-3 h-3" />
                                No
                              </div>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-8">
                          <p className="text-muted-foreground">No borrowing history available.</p>
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
