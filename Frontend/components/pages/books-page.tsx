"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Plus, Edit2, Trash2, X } from "lucide-react"
import { BookFormModal } from "@/components/book-form-modal"

interface DashboardPageProps {
  userRole: string
  onNavigate: (page: string) => void
  onLogout: () => void
}

const initialBooks = [
  {
    id: "B001",
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    category: "Fiction",
    isbn: "978-0743273565",
    totalQuantity: 5,
    availableCopies: 2,
  },
  {
    id: "B002",
    title: "1984",
    author: "George Orwell",
    category: "Fiction",
    isbn: "978-0451524935",
    totalQuantity: 8,
    availableCopies: 3,
  },
  {
    id: "B003",
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    category: "Classic",
    isbn: "978-0061120084",
    totalQuantity: 6,
    availableCopies: 4,
  },
  {
    id: "B004",
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    category: "Fantasy",
    isbn: "978-0547928227",
    totalQuantity: 7,
    availableCopies: 5,
  },
  {
    id: "B005",
    title: "Pride and Prejudice",
    author: "Jane Austen",
    category: "Romance",
    isbn: "978-0141439518",
    totalQuantity: 4,
    availableCopies: 1,
  },
]

export function BooksPage({ userRole, onNavigate, onLogout }: DashboardPageProps) {
  const [books, setBooks] = useState(initialBooks)
  const [searchTerm, setSearchTerm] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [editingBook, setEditingBook] = useState(null)

  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddBook = (newBook: any) => {
    if (editingBook) {
      setBooks(books.map((b) => (b.id === editingBook.id ? { ...newBook, id: b.id } : b)))
    } else {
      setBooks([...books, { ...newBook, id: `B${String(books.length + 1).padStart(3, "0")}` }])
    }
    setShowModal(false)
    setEditingBook(null)
  }

  const handleDeleteBook = (id: string) => {
    setBooks(books.filter((b) => b.id !== id))
  }

  const handleEditBook = (book: any) => {
    setEditingBook(book)
    setShowModal(true)
  }

  const canModify = userRole !== "member"

  return (
    <div className="flex h-screen bg-background">
      <Sidebar currentPage="books" onNavigate={onNavigate} onLogout={onLogout} userRole={userRole} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header userRole={userRole} onLogout={onLogout} />
        <main className="flex-1 overflow-auto p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Books Management</h1>
                <p className="text-muted-foreground mt-2">Manage your library collection</p>
              </div>
              {canModify && (
                <Button
                  onClick={() => {
                    setEditingBook(null)
                    setShowModal(true)
                  }}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground w-full sm:w-auto"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Book
                </Button>
              )}
            </div>

            {/* Search Bar */}
            <Card className="mb-6 border-0 shadow-sm p-4">
              <div className="flex items-center gap-2 bg-input rounded-lg px-3">
                <Search className="w-4 h-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search by title or author..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border-0 bg-transparent focus-visible:ring-0 focus-visible:outline-none"
                />
                {searchTerm && (
                  <button onClick={() => setSearchTerm("")} className="p-1 hover:bg-secondary rounded">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </Card>

            {/* Books Table */}
            <Card className="border-0 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-secondary/50 border-b border-border hover:bg-secondary/50">
                      <TableHead className="font-semibold">Book ID</TableHead>
                      <TableHead className="font-semibold">Title</TableHead>
                      <TableHead className="font-semibold">Author</TableHead>
                      <TableHead className="font-semibold">Category</TableHead>
                      <TableHead className="font-semibold">ISBN</TableHead>
                      <TableHead className="font-semibold text-center">Total Qty</TableHead>
                      <TableHead className="font-semibold text-center">Available</TableHead>
                      {canModify && <TableHead className="font-semibold text-center">Actions</TableHead>}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBooks.length > 0 ? (
                      filteredBooks.map((book) => (
                        <TableRow
                          key={book.id}
                          className="border-b border-border hover:bg-secondary/30 transition-colors"
                        >
                          <TableCell className="font-medium text-primary">{book.id}</TableCell>
                          <TableCell className="font-medium">{book.title}</TableCell>
                          <TableCell>{book.author}</TableCell>
                          <TableCell>
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                              {book.category}
                            </span>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">{book.isbn}</TableCell>
                          <TableCell className="text-center font-semibold">{book.totalQuantity}</TableCell>
                          <TableCell className="text-center">
                            <span
                              className={`font-semibold ${
                                book.availableCopies > 0 ? "text-green-600" : "text-red-600"
                              }`}
                            >
                              {book.availableCopies}
                            </span>
                          </TableCell>
                          {canModify && (
                            <TableCell>
                              <div className="flex items-center justify-center gap-2">
                                <button
                                  onClick={() => handleEditBook(book)}
                                  className="p-2 hover:bg-secondary rounded-lg transition-colors"
                                  title="Edit"
                                >
                                  <Edit2 className="w-4 h-4 text-blue-600" />
                                </button>
                                <button
                                  onClick={() => handleDeleteBook(book.id)}
                                  className="p-2 hover:bg-secondary rounded-lg transition-colors"
                                  title="Delete"
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
                        <TableCell colSpan={canModify ? 8 : 7} className="text-center py-8">
                          <p className="text-muted-foreground">No books found matching your search.</p>
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

      {showModal && (
        <BookFormModal
          book={editingBook}
          onSave={handleAddBook}
          onClose={() => {
            setShowModal(false)
            setEditingBook(null)
          }}
        />
      )}
    </div>
  )
}
