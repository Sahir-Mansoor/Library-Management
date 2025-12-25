"use client"

import { useState } from "react"
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

const initialFines = [
  {
    id: "F001",
    memberName: "John Doe",
    bookTitle: "The Great Gatsby",
    dueDate: "2024-12-15",
    daysLate: 10,
    fineAmount: 100,
    status: "Pending",
  },
  {
    id: "F002",
    memberName: "Robert Johnson",
    bookTitle: "To Kill a Mockingbird",
    dueDate: "2024-12-20",
    daysLate: 5,
    fineAmount: 50,
    status: "Pending",
  },
  {
    id: "F003",
    memberName: "Sarah Williams",
    bookTitle: "1984",
    dueDate: "2024-12-10",
    daysLate: 15,
    fineAmount: 150,
    status: "Paid",
  },
  {
    id: "F004",
    memberName: "Michael Davis",
    bookTitle: "The Hobbit",
    dueDate: "2024-12-05",
    daysLate: 20,
    fineAmount: 200,
    status: "Pending",
  },
]

export function FinesPage({ userRole, onNavigate, onLogout }: FinesPageProps) {
  const [fines, setFines] = useState(initialFines)

  const handleMarkAsPaid = (id: string) => {
    setFines(fines.map((fine) => (fine.id === id ? { ...fine, status: "Paid" } : fine)))
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

            {/* Fine Summary Cards */}
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
