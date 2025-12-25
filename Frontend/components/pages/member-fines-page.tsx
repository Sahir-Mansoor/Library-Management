"use client"

import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AlertCircle, CheckCircle } from "lucide-react"

interface MemberFinesPageProps {
  userRole: string
  onNavigate: (page: string) => void
  onLogout: () => void
}

const finesData = [
  {
    id: "F001",
    bookTitle: "1984",
    fineReason: "Overdue",
    daysLate: 5,
    fineAmount: 50,
    paymentStatus: "Unpaid",
    isPaid: false,
  },
  {
    id: "F002",
    bookTitle: "The Catcher in the Rye",
    fineReason: "Overdue",
    daysLate: 2,
    fineAmount: 20,
    paymentStatus: "Paid",
    isPaid: true,
  },
]

export function MemberFinesPage({ userRole, onNavigate, onLogout }: MemberFinesPageProps) {
  const totalUnpaidFines = finesData.filter((f) => !f.isPaid).reduce((sum, f) => sum + f.fineAmount, 0)
  const totalPaidFines = finesData.filter((f) => f.isPaid).reduce((sum, f) => sum + f.fineAmount, 0)

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

            {/* Unpaid Fines Table */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-foreground mb-4">Unpaid Fines</h2>
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
                      {finesData.filter((f) => !f.isPaid).length > 0 ? (
                        finesData
                          .filter((f) => !f.isPaid)
                          .map((fine) => (
                            <TableRow
                              key={fine.id}
                              className="border-b border-border hover:bg-secondary/30 transition-colors"
                            >
                              <TableCell className="font-medium">{fine.bookTitle}</TableCell>
                              <TableCell>{fine.fineReason}</TableCell>
                              <TableCell className="text-center">{fine.daysLate}</TableCell>
                              <TableCell className="text-right font-semibold">₹{fine.fineAmount}</TableCell>
                              <TableCell className="text-center">
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">
                                  Unpaid
                                </span>
                              </TableCell>
                            </TableRow>
                          ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-8">
                            <p className="text-muted-foreground">No unpaid fines.</p>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </Card>
            </div>

            {/* Paid Fines Table */}
            <div>
              <h2 className="text-xl font-bold text-foreground mb-4">Paid Fines</h2>
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
                      {finesData.filter((f) => f.isPaid).length > 0 ? (
                        finesData
                          .filter((f) => f.isPaid)
                          .map((fine) => (
                            <TableRow
                              key={fine.id}
                              className="border-b border-border hover:bg-secondary/30 transition-colors"
                            >
                              <TableCell className="font-medium">{fine.bookTitle}</TableCell>
                              <TableCell>{fine.fineReason}</TableCell>
                              <TableCell className="text-center">{fine.daysLate}</TableCell>
                              <TableCell className="text-right font-semibold">₹{fine.fineAmount}</TableCell>
                              <TableCell className="text-center">
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                                  Paid
                                </span>
                              </TableCell>
                            </TableRow>
                          ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-8">
                            <p className="text-muted-foreground">No paid fines.</p>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
