"use client"

import { useEffect, useState } from "react"
import axios from "axios"

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

interface Book {
  id: string
  title: string
  author: string
  category: string
  totalCopies: number
  availableCopies: number
}

interface User {
  id: string
  name: string
}

const API_BASE = "http://localhost:5000"
const BOOK_API = `${API_BASE}/books`
const USER_API = `${API_BASE}/users`
const ISSUE_API = `${API_BASE}/book-issue`

export function IssueBookPage({ userRole, onNavigate, onLogout }: IssueBookPageProps) {
  const [books, setBooks] = useState<Book[]>([])
  const [members, setMembers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [successMsg, setSuccessMsg] = useState("")

  const [formData, setFormData] = useState({
    userId: "",
    bookId: "",
    dueDate: "",
  })

  /* ===================== FETCH DATA ===================== */

  useEffect(() => {
    fetchInitialData()
  }, [])

  const fetchInitialData = async () => {
    try {
      setLoading(true)
      const [booksRes, usersRes] = await Promise.all([
        axios.get(BOOK_API),
        axios.get(`${USER_API}?role=MEMBER`),
      ])
      setBooks(booksRes.data)
      setMembers(usersRes.data)
    } catch (err) {
      console.error("Error loading data", err)
    } finally {
      setLoading(false)
    }
  }

  /* ===================== HANDLERS ===================== */

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleIssueBook = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.userId || !formData.bookId || !formData.dueDate) return

    try {
      await axios.post(`${ISSUE_API}/issue`, {
        userId: formData.userId,
        bookId: formData.bookId,
        dueDate: formData.dueDate,
      })

      setSuccessMsg("Book issued successfully ✅")
      setFormData({ userId: "", bookId: "", dueDate: "" })
      await fetchInitialData() // refresh books to show updated availableCopies

      setTimeout(() => setSuccessMsg(""), 3000)
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to issue book")
    }
  }

  /* ===================== UI ===================== */

  return (
    <div className="flex h-screen bg-background">
      <Sidebar currentPage="issue-book" onNavigate={onNavigate} onLogout={onLogout} userRole={userRole} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header userRole={userRole} onLogout={onLogout} />

        <main className="flex-1 overflow-auto p-6 lg:p-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-2">Issue Book</h1>
            <p className="text-muted-foreground mb-6">
              Issue books to registered library members
            </p>

            <Card className="p-6 border-0 shadow-sm mb-6">
              {loading ? (
                <p>Loading...</p>
              ) : (
                <form onSubmit={handleIssueBook} className="space-y-6">
                  {/* MEMBER */}
                  <div className="space-y-2">
                    <Label>Select Member</Label>
                    <select
                      name="userId"
                      value={formData.userId}
                      onChange={handleChange}
                      className="w-full p-2 rounded-md bg-input"
                      required
                    >
                      <option value="">Choose member...</option>
                      {members.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.name} ({m.id})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* BOOK */}
                  <div className="space-y-2">
                    <Label>Select Book</Label>
                    <select
                      name="bookId"
                      value={formData.bookId}
                      onChange={handleChange}
                      className="w-full p-2 rounded-md bg-input"
                      required
                    >
                      <option value="">Choose book...</option>
                      {books
                        .filter((b) => b.availableCopies > 0)
                        .map((b) => (
                          <option key={b.id} value={b.id}>
                            {b.title} ({b.availableCopies} available)
                          </option>
                        ))}
                    </select>
                  </div>

                 {/* DUE DATE */}
<div className="space-y-2">
  <Label>Due Date</Label>
  <input
    type="date"
    name="dueDate"
    value={formData.dueDate}
    onChange={handleChange}
    className="w-full p-2 rounded-md bg-input"
    required
    min={new Date(Date.now() + 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0]} // tomorrow
  />
</div>


                  <Button type="submit" className="w-full">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Issue Book
                  </Button>

                  {successMsg && (
                    <p className="text-green-600 font-semibold text-center">
                      {successMsg}
                    </p>
                  )}
                </form>
              )}
            </Card>

            {/* AVAILABLE BOOKS TABLE */}
            <Card className="p-6 border-0 shadow-sm mt-6">
              <h2 className="text-xl font-bold mb-4">Available Books</h2>
              <div className="overflow-x-auto">
                <table className="w-full table-auto border-collapse border border-border">
                  <thead>
                    <tr className="bg-muted-foreground/20">
                      <th className="border px-4 py-2 text-left">Title</th>
                      <th className="border px-4 py-2 text-left">Author</th>
                      <th className="border px-4 py-2 text-left">Category</th>
                      <th className="border px-4 py-2 text-center">Total Copies</th>
                      <th className="border px-4 py-2 text-center">Available Copies</th>
                    </tr>
                  </thead>
                  <tbody>
                    {books.map((b) => (
                      <tr key={b.id}>
                        <td className="border px-4 py-2">{b.title}</td>
                        <td className="border px-4 py-2">{b.author}</td>
                        <td className="border px-4 py-2">{b.category}</td>
                        <td className="border px-4 py-2 text-center">{b.totalCopies}</td>
                        <td className="border px-4 py-2 text-center">{b.availableCopies}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
