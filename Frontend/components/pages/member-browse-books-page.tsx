"use client"
import axios from "axios"

import { useEffect, useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, X } from "lucide-react"

interface MemberBrowseBooksPageProps {
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
  isbn: string
}
const API_BASE = "http://localhost:5000"
const BOOK_API = `${API_BASE}/books`
const categories = `${API_BASE}/books/categories`


export function MemberBrowseBooksPage({ userRole, onNavigate, onLogout }: MemberBrowseBooksPageProps) {
  const [books, setBooks] = useState<Book[]>([])
  
  const [searchTerm, setSearchTerm] = useState("")
    const [selectedCategory, setSelectedCategory] = useState("All")
  const [loading, setLoading] = useState(true)
    const [categories, setCategories] = useState<string[]>([])

  useEffect(() => {
    fetchInitialData()
    fetchCategories()
  }, [])
   const fetchInitialData = async () => {
    try {
      setLoading(true)
      const [booksRes] = await Promise.all([
        axios.get(BOOK_API),
      ])
      setBooks(booksRes.data)
    } catch (err) {
      console.error("Error loading data", err)
    } finally {
      setLoading(false)
    }
  }
  const fetchCategories = async () => {
  try {
    const res = await fetch(`${API_BASE}/books/categories`);
    const data = await res.json(); // expecting ["Fiction", "Sci-Fi", ...]
    setCategories(data);
  } catch (err) {
    console.error("Failed to fetch categories:", err);
  }
};



  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "All" || book.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="flex h-screen bg-background">
      <Sidebar currentPage="browse-books" onNavigate={onNavigate} onLogout={onLogout} userRole={userRole} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header userRole={userRole} onLogout={onLogout} />
        <main className="flex-1 overflow-auto p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground">Browse Books</h1>
              <p className="text-muted-foreground mt-2">Explore our library collection</p>
            </div>

            {/* Search and Filter */}
            <Card className="mb-6 border-0 shadow-sm p-4">
              <div className="space-y-4">
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

              <div className="flex flex-wrap gap-2">
  {/* "All" button */}
  <Button
    key="All"
    onClick={() => setSelectedCategory("All")}
    variant={selectedCategory === "All" ? "default" : "outline"}
    className="text-sm"
  >
    All
  </Button>

  {/* Dynamic category buttons */}
  {categories.map((cat) => (
    <Button
      key={cat}
      onClick={() => setSelectedCategory(cat)}
      variant={selectedCategory === cat ? "default" : "outline"}
      className="text-sm"
    >
      {cat}
    </Button>
  ))}
</div>
              </div>
            </Card>

            {/* Books Table */}
            <Card className="border-0 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-secondary/50 border-b border-border hover:bg-secondary/50">
                      <TableHead className="font-semibold">Title</TableHead>
                      <TableHead className="font-semibold">Author</TableHead>
                      <TableHead className="font-semibold">Category</TableHead>
                      <TableHead className="font-semibold">ISBN</TableHead>
                      <TableHead className="font-semibold text-center">Availability</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBooks.length > 0 ? (
                      filteredBooks.map((book) => (
                        <TableRow
                          key={book.id}
                          className="border-b border-border hover:bg-secondary/30 transition-colors"
                        >
                          <TableCell className="font-medium">{book.title}</TableCell>
                          <TableCell>{book.author}</TableCell>
                          <TableCell>
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                              {book.category}
                            </span>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">{book.isbn}</TableCell>
                          <TableCell className="text-center">
                            {book.availableCopies > 0 ? (
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                                Available ({book.availableCopies})
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">
                                Issued
                              </span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8">
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
    </div>
  )
}
