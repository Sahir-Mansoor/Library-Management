"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"

interface AccessDeniedPageProps {
  userRole: string
  onNavigate: (page: string) => void
  onLogout: () => void
}

export function AccessDeniedPage({ userRole, onNavigate, onLogout }: AccessDeniedPageProps) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-md shadow-lg border-0">
        <div className="p-8 text-center">
          <div className="mb-6 flex justify-center">
            <div className="bg-destructive/10 p-4 rounded-full">
              <AlertCircle className="w-12 h-12 text-destructive" />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-foreground mb-2">Access Denied</h1>
          <p className="text-muted-foreground mb-6">
            You do not have permission to access this page. Your current role is{" "}
            <span className="font-semibold capitalize">{userRole}</span>.
          </p>

          <div className="space-y-3">
            <Button
              onClick={() => onNavigate("dashboard")}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              Back to Dashboard
            </Button>
            <Button onClick={onLogout} variant="outline" className="w-full bg-transparent">
              Logout
            </Button>
          </div>

          <p className="text-xs text-muted-foreground mt-6">
            If you believe this is an error, please contact the system administrator.
          </p>
        </div>
      </Card>
    </div>
  )
}
