"use client"

import { Card } from "@/components/ui/card"

export function TableSkeleton() {
  return (
    <div className="space-y-3 p-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex gap-4 items-center">
          <div className="h-12 bg-muted rounded-lg flex-1 animate-pulse" />
          <div className="h-12 bg-muted rounded-lg flex-1 animate-pulse" />
          <div className="h-12 bg-muted rounded-lg flex-1 animate-pulse" />
          <div className="h-12 bg-muted rounded-lg w-20 animate-pulse" />
        </div>
      ))}
    </div>
  )
}

export function CardSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {[...Array(4)].map((_, i) => (
        <Card key={i} className="p-6 border-0 shadow-sm">
          <div className="h-4 bg-muted rounded w-24 mb-4 animate-pulse" />
          <div className="h-8 bg-muted rounded w-32 animate-pulse" />
        </Card>
      ))}
    </div>
  )
}

export function FormSkeleton() {
  return (
    <Card className="p-6 border-0 shadow-sm">
      <div className="space-y-4">
        {[...Array(4)].map((_, i) => (
          <div key={i}>
            <div className="h-4 bg-muted rounded w-20 mb-2 animate-pulse" />
            <div className="h-10 bg-muted rounded animate-pulse" />
          </div>
        ))}
        <div className="h-10 bg-muted rounded animate-pulse mt-6" />
      </div>
    </Card>
  )
}
