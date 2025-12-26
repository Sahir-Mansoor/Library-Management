"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Search, Plus, Edit2, Trash2, X } from "lucide-react"
import { CreateUserModal } from "@/components/create-user-modal"
import { format } from "date-fns"

/* ================= TYPES ================= */

interface UsersPageProps {
  userRole: string
  onNavigate: (page: string) => void
  onLogout: () => void
}

interface User {
  id: string
  name?: string
  email?: string
  role: string
  status: string
  createdAt: Date
}

/* ================= COMPONENT ================= */

export function UsersPage({
  userRole,
  onNavigate,
  onLogout,
}: UsersPageProps) {
  const [users, setUsers] = useState<User[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)

  /* ================= FETCH USERS ================= */

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const res = await axios.get("http://localhost:5000/users")
      // map backend data to frontend format
      const mappedUsers = res.data.map((u: any) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
        status: u.status,
         createdAt: u.createdAt ? new Date(u.createdAt) : null,
      }))
      setUsers(mappedUsers)
    } catch (err) {
      console.error("Failed to fetch users", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  /* ================= FILTER ================= */

  const filteredUsers = users.filter((user) => {
    const name = user.name?.toLowerCase() || ""
    const email = user.email?.toLowerCase() || ""
    const term = searchTerm.toLowerCase()
    return name.includes(term) || email.includes(term)
  })

  /* ================= HANDLERS ================= */

  const handleAddUser = (newUser: User) => {
    if (editingUser) {
      setUsers((prev) =>
        prev.map((u) =>
          u.id === editingUser.id ? { ...newUser, id: u.id } : u
        )
      )
    } else {
      setUsers((prev) => [
        ...prev,
        {
          ...newUser,
          id: `U${String(prev.length + 1).padStart(3, "0")}`,
          createdAt: newUser.createdAt ?? new Date(),
        },
      ])
    }

    setShowModal(false)
    setEditingUser(null)
  }

 const handleDeleteUser = async (id: string) => {
  if (!confirm('Are you sure you want to delete this user?')) return;

  try {
    await axios.delete(`http://localhost:5000/users/${id}`);
    setUsers(prev => prev.filter(u => u.id !== id));
  } catch (err) {
    console.error('Failed to delete user', err);
    alert('Failed to delete user');
  }
};


  const handleEditUser = (user: User) => {
    setEditingUser(user)
    setShowModal(true)
  }

  const canModify =
    userRole.toLowerCase() === "admin" ||
    userRole.toLowerCase() === "librarian"

  /* ================= UI ================= */

  return (
    <div className="flex h-screen bg-background">
      <Sidebar
        currentPage="users"
        onNavigate={onNavigate}
        onLogout={onLogout}
        userRole={userRole}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header userRole={userRole} onLogout={onLogout} />

        <main className="flex-1 overflow-auto p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold">Users Management</h1>
                <p className="text-muted-foreground mt-2">
                  Manage library users and their permissions
                </p>
              </div>

              {canModify && (
                <Button
                  onClick={() => {
                    setEditingUser(null)
                    setShowModal(true)
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add User
                </Button>
              )}
            </div>

            {/* Search */}
            <Card className="mb-6 p-4">
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4" />
                <Input
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button onClick={() => setSearchTerm("")}>
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </Card>

            {/* Table */}
            <Card>
              {loading ? (
                <p className="text-center py-4">Loading users...</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User ID</TableHead>
                      <TableHead>Full Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created Date</TableHead>
                      {canModify && (
                        <TableHead className="text-center">Actions</TableHead>
                      )}
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {filteredUsers.length ? (
                      filteredUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>{user.id}</TableCell>
                          <TableCell>{user.name}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>{user.role}</TableCell>
                          <TableCell>{user.status}</TableCell>
                          <TableCell>
                            {format(user.createdAt, "MMM dd, yyyy")}
                          </TableCell>

                          {canModify && (
                            <TableCell>
                              <div className="flex gap-2 justify-center">
                                <button onClick={() => handleEditUser(user)}>
                                  <Edit2 className="w-4 h-4 text-blue-600" />
                                </button>
                                <button
                                  onClick={() => handleDeleteUser(user.id)}
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
                        <TableCell
                          colSpan={canModify ? 7 : 6}
                          className="text-center"
                        >
                          No users found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              )}
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
