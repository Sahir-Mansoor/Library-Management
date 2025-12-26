"use client"

import type React from "react"
import { useState, useMemo, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Search, Check } from "lucide-react"
import { getUsers } from "../lib/api/users" // Your API file
interface MemberFormModalProps {
  member: any
  onSave: (member: any) => void
  onClose: () => void
  existingMembers?: any[]
}
interface User {
  id: string
  name?: string
  email?: string
  role: string
  status: string
  createdAt: Date
}
export function MemberFormModal({ member, onSave, onClose, existingMembers = [] }: MemberFormModalProps) {
  const [formData, setFormData] = useState({
    userId: member?.userId || "",
    membershipNumber: member?.membershipNumber || "",
    phone: member?.phone || "",
    status: member?.status || "Active",
    borrowingLimit: member?.borrowingLimit || "5",
  })

  const [searchTerm, setSearchTerm] = useState("")
  const [showUserList, setShowUserList] = useState(!member)
  const [selectedUser, setSelectedUser] = useState(
    member ? { id: member.userId, name: member.name, email: member.email } : null,
  )
  const [users, setUsers] = useState<any[]>([])
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Fetch all users from backend
  useEffect(() => {
    const fetchUsers = async () => {
      const allUsers = await getUsers()
      // Only non-members
      const memberIds = existingMembers.map((m) => m.userId)
      setUsers(allUsers.filter((u: User) => u.role === "MEMBER" && !memberIds.includes(u.id)))
    }
    fetchUsers()
  }, [existingMembers])

  // Update membership number when a user is selected
  useEffect(() => {
    if (selectedUser) {
      setFormData((prev) => ({
        ...prev,
        userId: selectedUser.id,
        membershipNumber: selectedUser.id, // Membership number = user id
      }))
    }
  }, [selectedUser])

  const filteredUsers = useMemo(() => {
    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()),
    )
  }, [searchTerm, users])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!selectedUser) newErrors.user = "Please select a user"
    if (!formData.phone.trim()) newErrors.phone = "Phone Number is required"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleUserSelect = (user: any) => {
    setSelectedUser(user)
    setShowUserList(false)
    setSearchTerm("")
  }

  const handleSubmit = (e: React.FormEvent) => {
    debugger;
    e.preventDefault()
    if (validateForm() && selectedUser) {
      const submitData = {
        userId: selectedUser.id,
  membershipNumber: selectedUser.id,
        phone: formData.phone,
        status: formData.status.toUpperCase(),
        borrowingLimit: Number(formData.borrowingLimit),
      }
      onSave(submitData)
    }
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{member ? "Edit Member" : "Add Member"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          {!member && (
            <div className="space-y-2">
              <Label>Select Existing User *</Label>
              {selectedUser ? (
                <div className="border border-border rounded-lg p-3 bg-secondary/50 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">{selectedUser.name}</p>
                    <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedUser(null)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <div className="relative">
                  <div className="flex items-center gap-2 border border-border rounded-lg px-3 bg-background">
                    <Search className="w-4 h-4 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Search users by name or email"
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value)
                        setShowUserList(true)
                      }}
                      onFocus={() => setShowUserList(true)}
                      className="border-0 bg-transparent focus-visible:ring-0 focus-visible:outline-none"
                    />
                  </div>

                  {showUserList && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-background border border-border rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto">
                      {filteredUsers.length > 0 ? (
                        filteredUsers.map((user) => (
                          <button
                            key={user.id}
                            type="button"
                            onClick={() => handleUserSelect(user)}
                            className="w-full text-left px-4 py-2 hover:bg-secondary transition-colors flex items-start justify-between"
                          >
                            <div>
                              <p className="font-medium text-foreground">{user.name}</p>
                              <p className="text-sm text-muted-foreground">{user.email}</p>
                            </div>
                            <Check className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                          </button>
                        ))
                      ) : (
                        <div className="px-4 py-3 text-center text-muted-foreground text-sm">
                          {users.length === 0 ? "No users available" : "No matching users found"}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
              {errors.user && <p className="text-sm text-red-600">{errors.user}</p>}
            </div>
          )}

          {/* Membership Number */}
          <div className="space-y-2">
            <Label htmlFor="membershipNumber">Membership Number *</Label>
            <Input
              id="membershipNumber"
              value={formData.membershipNumber}
              readOnly
              className="bg-background cursor-not-allowed text-muted-foreground"
            />
          </div>

          {/* Phone Number */}
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number *</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="Enter phone number"
              className="bg-background"
            />
            {errors.phone && <p className="text-sm text-red-600">{errors.phone}</p>}
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <select
              id="status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          {/* Borrowing Limit */}
          <div className="space-y-2">
            <Label htmlFor="borrowingLimit">Borrowing Limit (Optional)</Label>
            <Input
              id="borrowingLimit"
              type="number"
              value={formData.borrowingLimit}
              onChange={(e) => setFormData({ ...formData, borrowingLimit: e.target.value })}
              placeholder="e.g., 5"
              className="bg-background"
            />
            <p className="text-xs text-muted-foreground">Maximum books a member can borrow at once</p>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <Button type="button" onClick={onClose} variant="outline" className="flex-1 bg-transparent">
              Cancel
            </Button>
            <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground">
              {member ? "Update" : "Add"} Member
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
