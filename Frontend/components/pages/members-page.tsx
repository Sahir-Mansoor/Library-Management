"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Plus, Edit2, Trash2, X } from "lucide-react"
import { MemberFormModal } from "@/components/member-form-modal"
import axios from "axios"

interface MembersPageProps {
  userRole: string
  onNavigate: (page: string) => void
  onLogout: () => void
}

interface Member {
  id: string
  userId: string
  name: string
  email: string
  phone: string
  status: string
  borrowingLimit: number
  user?: {          // optional in case it's not loaded yet
    id: string
    name: string
    email: string
  }
}

const API_URL = "http://localhost:5000/members" // Replace with your backend URL

export function MembersPage({ userRole, onNavigate, onLogout }: MembersPageProps) {
  const [members, setMembers] = useState<Member[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [editingMember, setEditingMember] = useState<Member | null>(null)
  const [loading, setLoading] = useState(true)

  // Fetch members from backend
  const fetchMembers = async () => {
    try {
      setLoading(true)
      const response = await axios.get(API_URL)
      setMembers(response.data)
    } catch (error) {
      console.error("Error fetching members:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMembers()
    debugger;
  }, [])

 const filteredMembers = members.filter((member) => {
  const name = typeof member.name === "string" ? member.name.toLowerCase() : "";
  const email = typeof member.email === "string" ? member.email.toLowerCase() : "";
  return name.includes(searchTerm.toLowerCase()) || email.includes(searchTerm.toLowerCase());
});


  // Add or Update member
  const handleAddMember = async (newMember: any) => {
    try {
      if (editingMember) {
        const response = await axios.put(`${API_URL}/${editingMember.id}`, newMember)
        setMembers(members.map((m) => (m.id === editingMember.id ? response.data : m)))
      } else {
        const response = await axios.post(API_URL, newMember)
        setMembers([...members, response.data])
      }
    } catch (error) {
      console.error("Error saving member:", error)
    } finally {
      setShowModal(false)
      setEditingMember(null)
    }
  }

 const handleDeleteMember = async (id: string) => {
  const confirmed = window.confirm("Are you sure you want to delete this member?");
  if (!confirmed) return;

  try {
    await axios.delete(`${API_URL}/${id}`);
    setMembers(members.filter((m) => m.id !== id));
  } catch (error) {
    console.error("Error deleting member:", error);
  }
}

  const handleEditMember = (member: Member) => {
    setEditingMember(member)
    setShowModal(true)
  }

  const canModify = userRole !== "member"

  return (
    <div className="flex h-screen bg-background">
      <Sidebar currentPage="members" onNavigate={onNavigate} onLogout={onLogout} userRole={userRole} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header userRole={userRole} onLogout={onLogout} />
        <main className="flex-1 overflow-auto p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Members Management</h1>
                <p className="text-muted-foreground mt-2">Manage library members and their information</p>
              </div>
              {canModify && (
                <Button
                  onClick={() => {
                    setEditingMember(null)
                    setShowModal(true)
                  }}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground w-full sm:w-auto"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Member
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

            {/* Members Table */}
            <Card className="border-0 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-secondary/50 border-b border-border hover:bg-secondary/50">
                      <TableHead className="font-semibold">Member ID</TableHead>
                      <TableHead className="font-semibold">Name</TableHead>
                      <TableHead className="font-semibold">Email</TableHead>
                      <TableHead className="font-semibold">Phone</TableHead>
                      <TableHead className="font-semibold">Status</TableHead>
                      {canModify && <TableHead className="font-semibold text-center">Actions</TableHead>}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={canModify ? 6 : 5} className="text-center py-8">
                          Loading members...
                        </TableCell>
                      </TableRow>
                    ) : filteredMembers.length > 0 ? (
                      filteredMembers.map((member) => (
                        <TableRow
                          key={member.id}
                          className="border-b border-border hover:bg-secondary/30 transition-colors"
                        >
                          <TableCell className="font-medium text-primary">{member.id}</TableCell>
                          <TableCell className="font-medium">{member.user?.name}</TableCell>
                          <TableCell className="text-sm">{member.user?.email}</TableCell>
                          <TableCell className="text-sm">{member.phone}</TableCell>
                          <TableCell>
                            <span
                              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                member.status === "Active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                              }`}
                            >
                              {member.status}
                            </span>
                          </TableCell>
                          {canModify && (
                            <TableCell>
                              <div className="flex items-center justify-center gap-2">
                                <button
                                  onClick={() => handleEditMember(member)}
                                  className="p-2 hover:bg-secondary rounded-lg transition-colors"
                                  title="Edit"
                                >
                                  <Edit2 className="w-4 h-4 text-blue-600" />
                                </button>
                                <button
                                  onClick={() => handleDeleteMember(member.id)}
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
                        <TableCell colSpan={canModify ? 6 : 5} className="text-center py-8">
                          <p className="text-muted-foreground">No members found matching your search.</p>
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
        <MemberFormModal
          member={editingMember}
          onSave={handleAddMember}
          onClose={() => {
            setShowModal(false)
            setEditingMember(null)
          }}
          existingMembers={members}
        />
      )}
    </div>
  )
}
