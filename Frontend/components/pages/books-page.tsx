"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Search, Plus, Edit2, Trash2, X } from "lucide-react"
import { BookFormModal } from "@/components/book-form-modal"

interface DashboardPageProps {
  userRole: string
  onNavigate: (page: string) => void
  onLogout: () => void
}

interface Book {
  id: string
  title: string
  author: string
  category: string
  isbn: string
  totalCopies: number
}

const API_URL = "http://localhost:5000/books"

export function BooksPage({
  userRole,
  onNavigate,
  onLogout,
}: DashboardPageProps) {
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [editingBook, setEditingBook] = useState<Book | null>(null)

  const canModify = userRole !== "member"

  /* =========================
     FETCH BOOKS
  ========================= */
  useEffect(() => {
    fetchBooks()
  }, [])

  const fetchBooks = async () => {
    try {
      setLoading(true)
      const res = await axios.get(API_URL)
      setBooks(res.data)
    } catch (err) {
      console.error("Error fetching books:", err)
    } finally {
      setLoading(false)
    }
  }

  /* =========================
     SEARCH FILTER
  ========================= */
  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase())
  )

  /* =========================
     CREATE / UPDATE
  ========================= */
  const handleSaveBook = async (data: Partial<Book>) => {
    try {
      if (editingBook) {
        const res = await axios.put(
          `${API_URL}/${editingBook.id}`,
          data
        )
        setBooks((prev) =>
          prev.map((b) => (b.id === editingBook.id ? res.data : b))
        )
      } else {
        const res = await axios.post(API_URL, data)
        setBooks((prev) => [...prev, res.data])
      }
    } catch (err) {
      console.error("Error saving book:", err)
    } finally {
      setShowModal(false)
      setEditingBook(null)
    }
  }

  /* =========================
     DELETE (CONFIRM)
  ========================= */
  const handleDeleteBook = async (id: string) => {
    if (!confirm("Are you sure you want to delete this book?")) return

    try {
      await axios.delete(`${API_URL}/${id}`)
      setBooks((prev) => prev.filter((b) => b.id !== id))
    } catch (err) {
      console.error("Error deleting book:", err)
    }
  }

  const handleEditBook = (book: Book) => {
    setEditingBook(book)
    setShowModal(true)
  }

  /* =========================
     RENDER
  ========================= */
  return (
    <div className="flex h-screen bg-background">
      <Sidebar
        currentPage="books"
        onNavigate={onNavigate}
        onLogout={onLogout}
        userRole={userRole}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header userRole={userRole} onLogout={onLogout} />

        <main className="flex-1 overflow-auto p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {/* HEADER */}
            <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold">Books Management</h1>
                <p className="text-muted-foreground mt-2">
                  Manage library books (CRUD only)
                </p>
              </div>

              {canModify && (
                <Button
                  onClick={() => {
                    setEditingBook(null)
                    setShowModal(true)
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Book
                </Button>
              )}
            </div>

            {/* SEARCH */}
            <Card className="mb-6 p-4">
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by title or author..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button onClick={() => setSearchTerm("")}>
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </Card>

            {/* TABLE */}
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Book ID</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>ISBN</TableHead>
                    <TableHead className="text-center">
                      Total Copies
                    </TableHead>
                    {canModify && (
                      <TableHead className="text-center">
                        Actions
                      </TableHead>
                    )}
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-6">
                        Loading books...
                      </TableCell>
                    </TableRow>
                  ) : filteredBooks.length > 0 ? (
                    filteredBooks.map((book) => (
                      <TableRow key={book.id}>
                        <TableCell>{book.id}</TableCell>
                        <TableCell>{book.title}</TableCell>
                        <TableCell>{book.author}</TableCell>
                        <TableCell>{book.category}</TableCell>
                        <TableCell>{book.isbn}</TableCell>
                        <TableCell className="text-center">
                          {book.totalCopies}
                        </TableCell>

                        {canModify && (
                          <TableCell>
                            <div className="flex justify-center gap-2">
                              <button
                                onClick={() => handleEditBook(book)}
                              >
                                <Edit2 className="w-4 h-4 text-blue-600" />
                              </button>
                              <button
                                onClick={() => handleDeleteBook(book.id)}
                              >
                                <Trash2 className="w-4 h-4 text-red-600" />
                              </button>
                            </div>
                          </TableCell>
                        )}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-6">
                        No books found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </Card>
          </div>
        </main>
      </div>

      {showModal && (
        <BookFormModal
          book={editingBook}
          onSave={handleSaveBook}
          onClose={() => {
            setShowModal(false)
            setEditingBook(null)
          }}
        />
      )}
    </div>
  )
}
