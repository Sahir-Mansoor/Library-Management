"use client"

import type React from "react"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { CheckCircle } from "lucide-react"

interface IssueBookPageProps {
  userRole: string
  onNavigate: (page: string) => void
  onLogout: () => void
}

const books = [
  { id: "B001", title: "The Great Gatsby", author: "F. Scott Fitzgerald", availableCopies: 2 },
  { id: "B002", title: "1984", author: "George Orwell", availableCopies: 3 },
  { id: "B003", title: "To Kill a Mockingbird", author: "Harper Lee", availableCopies: 4 },
  { id: "B004", title: "The Hobbit", author: "J.R.R. Tolkien", availableCopies: 5 },
  { id: "B005", title: "Pride and Prejudice", author: "Jane Austen", availableCopies: 1 },
]

const members = [
  { id: "M001", name: "John Doe" },
  { id: "M002", name: "Sarah Williams" },
  { id: "M003", name: "Robert Johnson" },
  { id: "M004", name: "Emma Brown" },
  { id: "M005", name: "Michael Davis" },
]

export function IssueBookPage({ userRole, onNavigate, onLogout }: IssueBookPageProps) {
  const [formData, setFormData] = useState({
    memberId: "",
    bookId: "",
    issueDate: new Date().toISOString().split("T")[0],
    dueDate: "",
  })
  const [issuedBooks, setIssuedBooks] = useState<any[]>([])

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleIssueBook = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.memberId && formData.bookId && formData.dueDate) {
      const member = members.find((m) => m.id === formData.memberId)
      const book = books.find((b) => b.id === formData.bookId)

      const newIssue = {
        id: `I${Date.now()}`,
        memberId: formData.memberId,
        memberName: member?.name,
        bookId: formData.bookId,
        bookTitle: book?.title,
        issueDate: formData.issueDate,
        dueDate: formData.dueDate,
      }

      setIssuedBooks([...issuedBooks, newIssue])
      setFormData({
        memberId: "",
        bookId: "",
        issueDate: new Date().toISOString().split("T")[0],
        dueDate: "",
      })
    }
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar currentPage="issue-book" onNavigate={onNavigate} onLogout={onLogout} userRole={userRole} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header userRole={userRole} onLogout={onLogout} />
        <main className="flex-1 overflow-auto p-6 lg:p-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground">Issue Book</h1>
              <p className="text-muted-foreground mt-2">Issue books to library members</p>
            </div>

            {/* Issue Form */}
            <Card className="border-0 shadow-sm p-6 mb-8">
              <form onSubmit={handleIssueBook} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="memberId">Select Member</Label>
                    <select
                      id="memberId"
                      name="memberId"
                      value={formData.memberId}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-input border border-input rounded-md text-foreground"
                      required
                    >
                      <option value="">Choose a member...</option>
                      {members.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.name} ({m.id})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bookId">Select Book</Label>
                    <select
                      id="bookId"
                      name="bookId"
                      value={formData.bookId}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-input border border-input rounded-md text-foreground"
                      required
                    >
                      <option value="">Choose a book...</option>
                      {books
                        .filter((b) => b.availableCopies > 0)
                        .map((b) => (
                          <option key={b.id} value={b.id}>
                            {b.title} ({b.availableCopies} available)
                          </option>
                        ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="issueDate">Issue Date</Label>
                    <input
                      id="issueDate"
                      name="issueDate"
                      type="date"
                      value={formData.issueDate}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-input border border-input rounded-md text-foreground"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dueDate">Due Date</Label>
                    <input
                      id="dueDate"
                      name="dueDate"
                      type="date"
                      value={formData.dueDate}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-input border border-input rounded-md text-foreground"
                      required
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Issue Book
                </Button>
              </form>
            </Card>

            {/* Issued Books List */}
            {issuedBooks.length > 0 && (
              <Card className="border-0 shadow-sm p-6">
                <h2 className="text-xl font-bold text-foreground mb-4">Books Issued Today</h2>
                <div className="space-y-3">
                  {issuedBooks.map((issue) => (
                    <div key={issue.id} className="p-4 bg-secondary/30 rounded-lg border border-border">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-xs text-muted-foreground">Member</p>
                          <p className="font-semibold text-foreground">{issue.memberName}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Book</p>
                          <p className="font-semibold text-foreground">{issue.bookTitle}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Issue Date</p>
                          <p className="font-semibold text-foreground">{issue.issueDate}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Due Date</p>
                          <p className="font-semibold text-foreground">{issue.dueDate}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
