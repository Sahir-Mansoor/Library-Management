"use client"

import { History } from "lucide-react"

export function EmptyHistory() {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="bg-purple-100 p-4 rounded-full mb-4">
        <History className="w-12 h-12 text-purple-600" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">No Borrowing History</h3>
      <p className="text-muted-foreground text-center mb-6 max-w-sm">
        You haven't borrowed any books yet. Start exploring the library and borrow your first book!
      </p>
    </div>
  )
}
