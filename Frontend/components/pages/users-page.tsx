"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Plus, Edit2, Trash2, X } from "lucide-react"
import { CreateUserModal } from "@/components/create-user-modal"
import { format } from "date-fns"

interface UsersPageProps {
  userRole: string
  onNavigate: (page: string) => void
  onLogout: () => void
}

const initialUsers = [
  {
    id: "U001",
    fullName: "Admin User",
    email: "admin@library.com",
    role: "Admin",
    status: "Active",
    createdDate: new Date("2024-01-15"),
  },
  {
    id: "U002",
    fullName: "Sarah Librarian",
    email: "sarah.lib@library.com",
    role: "Librarian",
    status: "Active",
    createdDate: new Date("2024-02-10"),
  },
  {
    id: "U003",
    fullName: "John Member",
    email: "john.member@library.com",
    role: "Member",
    status: "Active",
    createdDate: new Date("2024-03-05"),
  },
  {
    id: "U004",
    fullName: "Emma Librarian",
    email: "emma.lib@library.com",
    role: "Librarian",
    status: "Active",
    createdDate: new Date("2024-03-20"),
  },
  {
    id: "U005",
    fullName: "Robert Member",
    email: "robert.member@library.com",
    role: "Member",
    status: "Inactive",
    createdDate: new Date("2024-04-01"),
  },
]

export function UsersPage({ userRole, onNavigate, onLogout }: UsersPageProps) {
  const [users, setUsers] = useState(initialUsers)
  const [searchTerm, setSearchTerm] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [editingUser, setEditingUser] = useState(null)

  const filteredUsers = users.filter(
    (user) =>
      user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddUser = (newUser: any) => {
    if (editingUser) {
      setUsers(users.map((u) => (u.id === editingUser.id ? { ...newUser, id: u.id } : u)))
    } else {
      setUsers([...users, { ...newUser, id: `U${String(users.length + 1).padStart(3, "0")}` }])
    }
    setShowModal(false)
    setEditingUser(null)
  }

  const handleDeleteUser = (id: string) => {
    setUsers(users.filter((u) => u.id !== id))
  }

  const handleEditUser = (user: any) => {
    setEditingUser(user)
    setShowModal(true)
  }

  const canModify = userRole === "admin" || userRole === "librarian"

  return (
    <div className="flex h-screen bg-background">
      <Sidebar currentPage="users" onNavigate={onNavigate} onLogout={onLogout} userRole={userRole} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header userRole={userRole} onLogout={onLogout} />
        <main className="flex-1 overflow-auto p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Users Management</h1>
                <p className="text-muted-foreground mt-2">Manage library users and their permissions</p>
              </div>
              {canModify && (
                <Button
                  onClick={() => {
                    setEditingUser(null)
                    setShowModal(true)
                  }}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground w-full sm:w-auto"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add User
                </Button>
              )}
            </div>

            {/* Search Bar */}
            <Card className="mb-6 border-0 shadow-sm p-4">
              <div className="flex items-center gap-2 bg-input rounded-lg px-3">
                <Search className="w-4 h-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search by name or email..."
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
            </Card>

            {/* Users Table */}
            <Card className="border-0 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-secondary/50 border-b border-border hover:bg-secondary/50">
                      <TableHead className="font-semibold">User ID</TableHead>
                      <TableHead className="font-semibold">Full Name</TableHead>
                      <TableHead className="font-semibold">Email</TableHead>
                      <TableHead className="font-semibold">Role</TableHead>
                      <TableHead className="font-semibold">Status</TableHead>
                      <TableHead className="font-semibold">Created Date</TableHead>
                      {canModify && <TableHead className="font-semibold text-center">Actions</TableHead>}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.length > 0 ? (
                      filteredUsers.map((user) => (
                        <TableRow
                          key={user.id}
                          className="border-b border-border hover:bg-secondary/30 transition-colors"
                        >
                          <TableCell className="font-medium text-primary">{user.id}</TableCell>
                          <TableCell className="font-medium">{user.fullName}</TableCell>
                          <TableCell className="text-sm">{user.email}</TableCell>
                          <TableCell>
                            <span
                              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                                user.role === "Admin"
                                  ? "bg-red-100 text-red-700"
                                  : user.role === "Librarian"
                                    ? "bg-blue-100 text-blue-700"
                                    : "bg-green-100 text-green-700"
                              }`}
                            >
                              {user.role}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span
                              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                user.status === "Active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                              }`}
                            >
                              {user.status}
                            </span>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {format(user.createdDate, "MMM dd, yyyy")}
                          </TableCell>
                          {canModify && (
                            <TableCell>
                              <div className="flex items-center justify-center gap-2">
                                <button
                                  onClick={() => handleEditUser(user)}
                                  className="p-2 hover:bg-secondary rounded-lg transition-colors"
                                  title="Edit"
                                >
                                  <Edit2 className="w-4 h-4 text-blue-600" />
                                </button>
                                <button
                                  onClick={() => handleDeleteUser(user.id)}
                                  className="p-2 hover:bg-secondary rounded-lg transition-colors"
                                  title="Delete"
                                >
                                  <Trash2 className="w-4 h-4 text-red-600" />
                                </button>
                              </div>
                            </TableCell>
                          )}
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={canModify ? 7 : 6} className="text-center py-8">
                          <p className="text-muted-foreground">No users found matching your search.</p>
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

      {showModal && (
        <CreateUserModal
          user={editingUser}
          onSave={handleAddUser}
          onClose={() => {
            setShowModal(false)
            setEditingUser(null)
          }}
        />
      )}
    </div>
  )
}
