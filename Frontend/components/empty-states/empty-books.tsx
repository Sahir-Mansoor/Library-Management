"use client"
import { Button } from "@/components/ui/button"
import { BookOpen } from "lucide-react"

interface EmptyBooksProps {
  onAddClick?: () => void
  showButton?: boolean
}

export function EmptyBooks({ onAddClick, showButton = false }: EmptyBooksProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="bg-primary/10 p-4 rounded-full mb-4">
        <BookOpen className="w-12 h-12 text-primary" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">No Books Available</h3>
      <p className="text-muted-foreground text-center mb-6 max-w-sm">
        There are currently no books in the system. Add some books to get started with your library management.
      </p>
      {showButton && (
        <Button onClick={onAddClick} className="bg-primary hover:bg-primary/90 text-primary-foreground">
          Add First Book
        </Button>
      )}
    </div>
  )
}
