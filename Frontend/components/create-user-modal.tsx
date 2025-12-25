"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { AlertCircle } from "lucide-react"

interface CreateUserModalProps {
  user?: any
  onSave: (user: any) => void
  onClose: () => void
}

export function CreateUserModal({ user, onSave, onClose }: CreateUserModalProps) {
  const [formData, setFormData] = useState({
    fullName: user?.fullName || "",
    email: user?.email || "",
    password: "",
    role: user?.role || "Member",
    memberId: user?.memberId || "",
    status: user?.status || "Active",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full Name is required"
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email"
    }
    if (!user && !formData.password) {
      newErrors.password = "Password is required"
    } else if (!user && formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }
    if (formData.role === "Member" && !formData.memberId.trim()) {
      newErrors.memberId = "Member ID is required for Members"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      const submitData = user
        ? {
            ...user,
            fullName: formData.fullName,
            email: formData.email,
            role: formData.role,
            status: formData.status,
            memberId: formData.memberId,
          }
        : {
            ...formData,
            createdDate: new Date(),
          }
      onSave(submitData)
    }
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{user ? "Edit User" : "Create New User"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          {!user && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-blue-700">
                <strong>Note:</strong> Role cannot be changed after creation.
              </p>
            </div>
          )}

          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Full Name *</label>
            <Input
              type="text"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              placeholder="Enter full name"
              className="w-full"
            />
            {errors.fullName && <p className="text-sm text-red-600 mt-1">{errors.fullName}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Email *</label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="Enter email address"
              className="w-full"
            />
            {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}
          </div>

          {/* Password */}
          {!user && (
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Password *</label>
              <Input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Enter password (min 6 characters)"
                className="w-full"
              />
              {errors.password && <p className="text-sm text-red-600 mt-1">{errors.password}</p>}
            </div>
          )}

          {/* Role */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Role *</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              disabled={!!user}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="Member">Member - View-only access</option>
              <option value="Librarian">Librarian - Management permissions</option>
              <option value="Admin">Admin - Full system access</option>
            </select>
          </div>

          {/* Member ID */}
          {formData.role === "Member" && (
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Member ID *</label>
              <Input
                type="text"
                value={formData.memberId}
                onChange={(e) => setFormData({ ...formData, memberId: e.target.value })}
                placeholder="e.g., MEM001"
                className="w-full"
              />
              {errors.memberId && <p className="text-sm text-red-600 mt-1">{errors.memberId}</p>}
            </div>
          )}

          {/* Employee ID for Librarian/Admin */}
          {(formData.role === "Librarian" || formData.role === "Admin") && (
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Employee ID</label>
              <Input
                type="text"
                value={formData.memberId}
                onChange={(e) => setFormData({ ...formData, memberId: e.target.value })}
                placeholder="e.g., EMP001"
                className="w-full"
              />
            </div>
          )}

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Status *</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <Button type="button" onClick={onClose} variant="outline" className="flex-1 bg-transparent">
              Cancel
            </Button>
            <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground">
              {user ? "Update User" : "Create User"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
