"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { X } from "lucide-react"

interface BookFormModalProps {
  book: any
  onSave: (book: any) => void
  onClose: () => void
}

export function BookFormModal({ book, onSave, onClose }: BookFormModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    category: "",
    isbn: "",
    totalCopies: 0,
    availableCopies:0,
  })

  useEffect(() => {
    if (book) {
      setFormData({
        title: book.title || "",
        author: book.author || "",
        category: book.category || "",
        isbn: book.isbn || "",
        totalCopies: book.totalCopies || 0,
        availableCopies: book.availableCopies || 0,
      })
    }
  }, [book])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
   setFormData((prev) => ({
    ...prev,
    [name]:
      name === "totalCopies" || name === "availableCopies"
        ? value === "" ? 0 : Number(value)
        : value, // keep text fields as strings
  }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()


  const title = formData.title.trim()
  const author = formData.author.trim()
  const isbn = formData.isbn.trim()
  const totalCopies = Number(formData.totalCopies)
  const availableCopies = Number(formData.availableCopies)

  if (!title || !author || !isbn) {
    alert("Title, Author, and ISBN are required")
    return
  }

  if (isNaN(totalCopies) || totalCopies < 1) {
    alert("Total copies must be at least 1")
    return
  }

  // Default availableCopies to totalCopies if it's 0
  if (!formData.availableCopies) {
    formData.availableCopies = formData.totalCopies
  }

    onSave({
      ...formData,
      totalCopies: Number(formData.totalCopies),
    })
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md border-0 shadow-xl">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-foreground">
              {book ? "Edit Book" : "Add New Book"}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-secondary rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Book Title</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter book title"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="author">Author</Label>
              <Input
                id="author"
                name="author"
                value={formData.author}
                onChange={handleChange}
                placeholder="Enter author name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="Enter category"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="isbn">ISBN</Label>
              <Input
                id="isbn"
                name="isbn"
                value={formData.isbn}
                onChange={handleChange}
                placeholder="Enter ISBN"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="totalQuantity">Total Quantity</Label>
              <Input
  id="totalCopies"
  name="totalCopies"
  type="number"
  value={formData.totalCopies}
  onChange={handleChange}
/>

            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                onClick={onClose}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                {book ? "Update" : "Add"} Book
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  )
}
