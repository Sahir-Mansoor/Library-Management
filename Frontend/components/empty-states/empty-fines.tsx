"use client"

import { DollarSign } from "lucide-react"

export function EmptyFines() {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="bg-green-100 p-4 rounded-full mb-4">
        <DollarSign className="w-12 h-12 text-green-600" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">No Fines Found</h3>
      <p className="text-muted-foreground text-center mb-6 max-w-sm">
        Great news! You have no outstanding fines. Keep returning books on time to maintain this record.
      </p>
    </div>
  )
}
