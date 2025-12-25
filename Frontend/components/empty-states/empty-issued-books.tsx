"use client"

import { BookMarked } from "lucide-react"
import { Button } from "@/components/ui/button"

interface EmptyIssuedBooksProps {
  onActionClick?: () => void
  showButton?: boolean
}

export function EmptyIssuedBooks({ onActionClick, showButton = false }: EmptyIssuedBooksProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="bg-blue-100 p-4 rounded-full mb-4">
        <BookMarked className="w-12 h-12 text-blue-600" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">No Issued Books</h3>
      <p className="text-muted-foreground text-center mb-6 max-w-sm">
        You don't have any books issued currently. Browse the library and issue a book to get started.
      </p>
      {showButton && (
        <Button onClick={onActionClick} className="bg-primary hover:bg-primary/90 text-primary-foreground">
          Browse Books
        </Button>
      )}
    </div>
  )
}
